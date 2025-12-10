import { injectable, inject } from 'inversify';
import { IUserService } from './user.service.interface';
import { IAccountRepository } from '../../repositories/account/account.repository.interface';
import { TYPES } from '../../types';
import { UserResponse, UserDetailResponse } from '../../schemas/user.schema';

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.AccountRepository) private accountRepo: IAccountRepository) {}

  /**
   * Function Objective — getAllUsers
   * Summary: Retrieve all users from the system.
   * Inputs: None.
   * Preconditions: None.
   * Behavior: Fetch all accounts -> Strip sensitive data -> Return list.
   * Responses: Array of UserResponse objects.
   * Side effects: None.
   */
  /**
   * Change Log
   * 2025-12-05: Create. (Gemini)
   */
  async getAllUsers(): Promise<UserResponse[]> {
    const accounts = await this.accountRepo.findAll();
    
    return accounts.map(account => {
      const { password_hash, ...userWithoutPassword } = account;
      return userWithoutPassword as UserResponse;
    });
  }

  /**
   * Function Objective — getUserById
   * Summary: Retrieve a specific user by ID with full details.
   * Inputs: id (User ID).
   * Preconditions: None.
   * Behavior: Fetch account with full profile -> Strip sensitive data -> Return object.
   * Responses: UserDetailResponse object or null.
   * Side effects: None.
   */
  /**
   * Change Log
   * 2025-12-08: Create. (Gemini)
   */
  async getUserById(id: string): Promise<UserDetailResponse | null> {
    const account = await this.accountRepo.findByIdWithFullProfile(id);
    if (!account) return null;

    const { password_hash, ...userWithoutPassword } = account;
    return userWithoutPassword as unknown as UserDetailResponse;
  }
}