import { UserResponse, UserDetailResponse } from '../../schemas/user.schema';

export interface IUserService {
  getAllUsers(): Promise<UserResponse[]>;
  getUserById(id: string): Promise<UserDetailResponse | null>;
}
