import { ChangePasswordInput, CreateUserInput, LoginInput, LoginResponse, LogoutInput, RefreshTokenInput, RefreshTokenResponse, UpdateProfileInput, UserResponse } from '../../schemas/user.schema';

export interface IAuthService {
  login(input: LoginInput): Promise<LoginResponse>;
  getProfile(userId: string): Promise<any>;
  register(input: CreateUserInput): Promise<UserResponse>;
  changePassword(userId: string, input: ChangePasswordInput): Promise<void>;
  updateProfile(userId: string, input: UpdateProfileInput): Promise<UserResponse>;
  refreshToken(input: RefreshTokenInput): Promise<RefreshTokenResponse>;
  logout(input: LogoutInput): Promise<void>;
}
