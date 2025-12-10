import { IAuthService } from '../services/auth/auth.service.interface';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { formatResponse } from '../utils/formatter';
import { ResponseCodes } from '../utils/exception';

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  /**
   * Function Objective — login
   * Summary: Handle user login authentication.
   * Inputs: path param (N), body param (Y), Authorization (N).
   * Preconditions: None.
   * Behavior: Validate input -> Call AuthService.login -> Return tokens.
   * Responses: 200 | 400
   * Side effects: None.
   */
  /**
   * Change Log
   * 2025-12-04: Create. (ThaiNQ)
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.login(req.body);
      res.status(ResponseCodes.OK).json(
        formatResponse(ResponseCodes.OK, 'Login successfully', result)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Function Objective — getProfile
   * Summary: Get authenticated user's profile information.
   * Inputs: path param (N), body param (N), Authorization (Y).
   * Preconditions: Authenticated user.
   * Behavior: Extract userId from token -> Call AuthService.getProfile -> Return profile.
   * Responses: 200 | 401 | 404
   * Side effects: None.
   */
  /**
   * Change Log
   * 2025-12-04: Create. (ThaiNQ)
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user is attached by authMiddleware
      const userId = (req as any).user?.id;
      const result = await this.authService.getProfile(userId);
      res.status(ResponseCodes.OK).json(
        formatResponse(ResponseCodes.OK, 'Get profile successfully', result)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Function Objective — register
   * Summary: Handle user registration.
   * Inputs: body param (Y).
   * Preconditions: Valid input data.
   * Behavior: Validate input -> Call AuthService.register -> Return created user.
   * Responses: 201 | 400
   * Side effects: Creates new account.
   */
  /**
   * Change Log
   * 2025-12-05: Create. (Gemini)
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.register(req.body);
      res.status(ResponseCodes.CREATED).json(
        formatResponse(ResponseCodes.CREATED, 'Register successfully', result)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Function Objective — changePassword
   * Summary: Handle password change.
   * Inputs: body param (Y), Authorization (Y).
   * Preconditions: Authenticated user.
   * Behavior: Validate input -> Extract userId -> Call AuthService.changePassword -> Return success.
   * Responses: 200 | 400 | 401
   * Side effects: Updates password.
   */
  /**
   * Change Log
   * 2025-12-05: Create. (ThaiNQ)
   */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      await this.authService.changePassword(userId, req.body);
      res.status(ResponseCodes.OK).json(
        formatResponse(ResponseCodes.OK, 'Password changed successfully', null)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Function Objective — updateProfile
   * Summary: Handle user profile update.
   * Inputs: body param (Y), Authorization (Y).
   * Preconditions: Authenticated user.
   * Behavior: Validate input -> Extract userId -> Call AuthService.updateProfile -> Return updated profile.
   * Responses: 200 | 400 | 401 | 404
   * Side effects: Updates user profile.
   */
  /**
   * Change Log
   * 2025-12-05: Create. (ThaiNQ)
   */
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.authService.updateProfile(userId, req.body);
      res.status(ResponseCodes.OK).json(
        formatResponse(ResponseCodes.OK, 'Profile updated successfully', result)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Function Objective — refreshToken
   * Summary: Refresh access token.
   * Inputs: body param (refreshToken).
   * Preconditions: Valid refresh token.
   * Behavior: Validate input -> Call AuthService.refreshToken -> Return new tokens.
   * Responses: 200 | 401
   * Side effects: Rotates refresh token.
   */
  /**
   * Change Log
   * 2025-12-08: Create. (ThaiNQ)
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.refreshToken(req.body);
      res.status(ResponseCodes.OK).json(
        formatResponse(ResponseCodes.OK, 'Token refreshed successfully', result)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Function Objective — logout
   * Summary: Logout user.
   * Inputs: body param (refreshToken).
   * Preconditions: None.
   * Behavior: Validate input -> Call AuthService.logout -> Return success.
   * Responses: 200
   * Side effects: Deletes refresh token.
   */
  /**
   * Change Log
   * 2025-12-08: Create. (ThaiNQ)
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.logout(req.body);
      res.status(ResponseCodes.OK).json(
        formatResponse(ResponseCodes.OK, 'Logout successfully', null)
      );
    } catch (error) {
      next(error);
    }
  }
}
