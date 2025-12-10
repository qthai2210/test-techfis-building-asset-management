import { IAuthService } from './auth.service.interface';
import { injectable, inject } from 'inversify';
import { ResponseCodes, HttpException } from '../../utils/exception';
import { generateTokens, REFRESH_TOKEN_EXPIRY, verifyRefreshToken, generateAccessToken, generateRefreshToken, ACCESS_TOKEN_EXPIRY } from '../../utils/jwt';
import actionLogger from '../../utils/loggers/action.logger';
import { compareSync, hashSync } from 'bcrypt';
import { ChangePasswordInput, CreateUserInput, LoginInput, LoginResponse, LogoutInput, RefreshTokenInput, RefreshTokenResponse, UpdateProfileInput, UserResponse } from '../../schemas/user.schema';
import { IAccountRepository } from '../../repositories/account/account.repository.interface';
import { TYPES } from '../../types';
import { AccountRole } from '@prisma/client';

@injectable()
export class AuthService implements IAuthService {
  private _accountRepo: IAccountRepository;

  constructor(@inject(TYPES.AccountRepository) accountRepo: IAccountRepository) {
    this._accountRepo = accountRepo;
  }

  /**
   * Function Objective — login
   * Summary: Authenticate user credentials and generate tokens.
   * Inputs: LoginInput (username, password).
   * Preconditions: None.
   * Behavior: Find account -> Verify password -> Generate tokens -> Save Refresh Token -> Log action.
   * Responses: LoginResponse.
   * Side effects: Logs action, Creates RefreshToken record.
   */
  /**
   * Change Log
   * 2025-12-04: Create. (ThaiNQ)
   * 2025-12-08: Update to support Refresh Token. (Gemini)
   */
  async login(input: LoginInput): Promise<LoginResponse> {
    const { username, password } = input;

    // Find account by username
    const account = await this._accountRepo.findByUsernameWithEmployee(username);

    if (!account) {
      throw new HttpException(ResponseCodes.BAD_REQUEST, 'Username or password incorrect.');
    }

    // Verify password
    if (!compareSync(password, account.password_hash)) {
      throw new HttpException(ResponseCodes.BAD_REQUEST, 'Username or password incorrect.');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(account.id);

    // Save refresh token to DB
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000);
    await this._accountRepo.saveRefreshToken(account.id, refreshToken, expiresAt);

    // Log action
    actionLogger.info('User logged in successfully', {
      action: 'AuthService.login',
      accountId: account.id,
      username: account.username,
    });

    // Remove password_hash and employee before returning to match UserResponse schema
    const { password_hash, employee, ...userWithoutPasswordForResponse } = account;

    // Parse expiration from string '180h' to seconds (approximate) or just use a fixed number
    // 180 hours = 648000 seconds
    const expiresIn = 648000; 

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: userWithoutPasswordForResponse as UserResponse,
    };
  }

  /**
   * Function Objective — getProfile
   * Summary: Retrieve full profile details for a user.
   * Inputs: userId (string).
   * Preconditions: Valid userId.
   * Behavior: Find account by ID -> Include employee & department -> Strip password.
   * Responses: User profile object.
   * Side effects: None.
   */
  /**
   * Change Log
   * 2025-12-04: Create. (ThaiNQ)
   */
  async getProfile(userId: string) {
    const account = await this._accountRepo.findByIdWithFullProfile(userId);

    if (!account) {
      throw new HttpException(ResponseCodes.NOT_FOUND, 'User not found.');
    }

    const { password_hash, ...userWithoutPassword } = account;
    return userWithoutPassword;
  }

  /**
   * Function Objective — register
   * Summary: Register a new user account linked to an employee.
   * Inputs: CreateUserInput.
   * Preconditions: Username must be unique, Employee must exist and not have an account.
   * Behavior: Validate uniqueness -> Hash password -> Create account -> Return result.
   * Responses: Created user object.
   * Side effects: Create account record.
   */
  /**
   * Change Log
   * 2025-12-05: Create. (Gemini)
   */
  async register(input: CreateUserInput): Promise<UserResponse> {
    // Check if username exists
    const existingUsername = await this._accountRepo.findByUsernameWithEmployee(input.username);
    if (existingUsername) {
      throw new HttpException(ResponseCodes.BAD_REQUEST, 'Username already exists.');
    }

    // Check if employee is already linked
    const existingEmployee = await this._accountRepo.findByEmployeeId(input.employee_id);
    if (existingEmployee) {
      throw new HttpException(ResponseCodes.BAD_REQUEST, 'Employee already has an account.');
    }

    // Hash password
    const hashedPassword = hashSync(input.password, 10);

    // Create account
    const account = await this._accountRepo.createAccount({
      username: input.username,
      password_hash: hashedPassword,
      employee_id: input.employee_id,
      role: input.role as AccountRole, // Cast Zod enum to Prisma enum if they match
    });

    const { password_hash, ...userWithoutPassword } = account;
    return userWithoutPassword as UserResponse;
  }

  /**
   * Function Objective — changePassword
   * Summary: Change user password.
   * Inputs: userId, ChangePasswordInput (currentPassword, newPassword).
   * Preconditions: User must be authenticated. Current password must match.
   * Behavior: Verify current password -> Hash new password -> Update account -> Revoke all sessions.
   * Responses: void.
   * Side effects: Updates password hash in DB, Deletes all refresh tokens.
   */
  /**
   * Change Log
   * 2025-12-05: Create. (Gemini)
   * 2025-12-08: Updated to revoke all refresh tokens. (Gemini)
   */
  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const account = await this._accountRepo.findById(userId);
    if (!account) {
      throw new HttpException(ResponseCodes.NOT_FOUND, 'User not found.');
    }

    if (!compareSync(input.currentPassword, account.password_hash)) {
      throw new HttpException(ResponseCodes.BAD_REQUEST, 'Current password is incorrect.');
    }

    const newPasswordHash = hashSync(input.newPassword, 10);
    await this._accountRepo.update(userId, { password_hash: newPasswordHash });
    
    // Revoke all refresh tokens for security
    await this._accountRepo.deleteAllRefreshTokensForUser(userId);

    actionLogger.info('User changed password successfully', {
      action: 'AuthService.changePassword',
      accountId: account.id,
      username: account.username,
    });
  }

  /**
   * Function Objective — updateProfile
   * Summary: Update authenticated user's profile information.
   * Inputs: userId, UpdateProfileInput (e.g., username).
   * Preconditions: User must be authenticated.
   * Behavior: Find account -> Validate input -> Update account in DB -> Return updated profile.
   * Responses: UserResponse.
   * Side effects: Updates user record.
   */
  /**
   * Change Log
   * 2025-12-05: Create. (Gemini)
   */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserResponse> {
    const account = await this._accountRepo.findById(userId);
    if (!account) {
      throw new HttpException(ResponseCodes.NOT_FOUND, 'User not found.');
    }

    if (input.username && input.username !== account.username) {
      const existingUsername = await this._accountRepo.findByUsernameWithEmployee(input.username);
      if (existingUsername) {
        throw new HttpException(ResponseCodes.BAD_REQUEST, 'Username already exists.');
      }
    }

    const updatedAccount = await this._accountRepo.update(userId, { username: input.username });

    if (!updatedAccount) {
      throw new HttpException(ResponseCodes.INTERNAL_SERVER_ERROR, 'Failed to update profile.');
    }

    const { password_hash, ...userWithoutPassword } = updatedAccount;
    return userWithoutPassword as UserResponse;
  }

  /**
   * Function Objective — refreshToken
   * Summary: Refresh access token using a valid refresh token.
   * Inputs: RefreshTokenInput.
   * Preconditions: Refresh token must be valid and exist in DB.
   * Behavior: Verify token -> Find in DB -> Rotate token (delete old, create new) -> Return new tokens.
   * Responses: RefreshTokenResponse.
   * Side effects: Deletes old token, Creates new token.
   */
  /**
   * Change Log
   * 2025-12-08: Create. (Gemini)
   */
  async refreshToken(input: RefreshTokenInput): Promise<RefreshTokenResponse> {
    const { refreshToken } = input;

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new HttpException(ResponseCodes.UNAUTHORIZED, 'Invalid refresh token');
    }

    const savedToken = await this._accountRepo.findRefreshToken(refreshToken);
    if (!savedToken) {
      // Token reuse detection or invalid token
      // Optionally: Delete all tokens for this user if we suspect theft
      throw new HttpException(ResponseCodes.UNAUTHORIZED, 'Invalid refresh token (reuse detected or revoked)');
    }

    // Check expiry (Prisma stores Date, jwt payload has exp timestamp)
    // DB check is safer
    if (savedToken.expires_at < new Date()) {
      await this._accountRepo.deleteRefreshToken(refreshToken);
      throw new HttpException(ResponseCodes.UNAUTHORIZED, 'Refresh token expired');
    }

    // Rotate Token: Delete old, issue new
    await this._accountRepo.deleteRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken(savedToken.account_id);
    const newRefreshToken = generateRefreshToken(savedToken.account_id);
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000);

    await this._accountRepo.saveRefreshToken(savedToken.account_id, newRefreshToken, newExpiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 648000, // 180h
    };
  }

  /**
   * Function Objective — logout
   * Summary: Logout user by revoking the refresh token.
   * Inputs: LogoutInput.
   * Preconditions: None.
   * Behavior: Delete refresh token from DB.
   * Responses: void.
   * Side effects: Deletes refresh token.
   */
  /**
   * Change Log
   * 2025-12-08: Create. (Gemini)
   */
  async logout(input: LogoutInput): Promise<void> {
    const { refreshToken } = input;
    if (refreshToken) {
      await this._accountRepo.deleteRefreshToken(refreshToken);
    }
  }
}
