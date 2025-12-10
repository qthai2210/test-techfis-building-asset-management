import { IBaseRepository } from '../../interfaces/repositories/base.interface';
import { UserInternal } from '../../schemas/user.schema';
import { AccountRole, RefreshToken } from '@prisma/client';

export interface IAccountRepository extends IBaseRepository<UserInternal> {
  findByUsernameWithEmployee(username: string): Promise<UserInternal | null>;
  findByIdWithFullProfile(id: string): Promise<UserInternal | null>;
  findByEmployeeId(employeeId: string): Promise<UserInternal | null>;
  createAccount(data: {
    username: string;
    password_hash: string;
    employee_id: string;
    role: AccountRole;
  }): Promise<UserInternal>;

  // Refresh Token Methods
  saveRefreshToken(accountId: string, token: string, expiresAt: Date): Promise<RefreshToken>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
  deleteRefreshToken(token: string): Promise<void>;
  deleteAllRefreshTokensForUser(accountId: string): Promise<void>;
}
