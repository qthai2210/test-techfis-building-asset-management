import { injectable, inject } from 'inversify';
import { PrismaClient, AccountRole, RefreshToken } from '@prisma/client';
import { TYPES } from '../../types';
import { UserInternal } from '../../schemas/user.schema';
import { IAccountRepository } from './account.repository.interface';

/**
 * Repository implementation using Prisma
 */
@injectable()
export class AccountRepository implements IAccountRepository {
  private _prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this._prisma = prisma;
  }

  // --- Implement IBaseRepository methods ---
  async create(data: Partial<UserInternal>): Promise<UserInternal> {
    // @ts-ignore: Casting to UserInternal which now matches DB structure (password_hash)
    return await this._prisma.account.create({ data: data as any }) as unknown as UserInternal;
  }

  async update(id: string, data: Partial<UserInternal>): Promise<UserInternal | null> {
    // @ts-ignore
    return await this._prisma.account.update({ where: { id }, data: data as any }) as unknown as UserInternal;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this._prisma.account.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findById(id: string): Promise<UserInternal | null> {
    const result = await this._prisma.account.findUnique({ where: { id } });
    return result as unknown as UserInternal;
  }

  async findAll(): Promise<UserInternal[]> {
    const result = await this._prisma.account.findMany();
    return result as unknown as UserInternal[];
  }

  // --- Custom Methods ---

  /**
   * Function Objective — findByUsernameWithEmployee
   */
  async findByUsernameWithEmployee(username: string): Promise<UserInternal | null> {
    const account = await this._prisma.account.findFirst({
      where: { username },
      include: { employee: true },
    });
    
    return account as unknown as UserInternal;
  }

  /**
   * Function Objective — findByIdWithFullProfile
   */
  async findByIdWithFullProfile(id: string): Promise<UserInternal | null> {
    const account = await this._prisma.account.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    return account as unknown as UserInternal;
  }

  /**
   * Function Objective — findByEmployeeId
   */
  async findByEmployeeId(employeeId: string): Promise<UserInternal | null> {
    const account = await this._prisma.account.findUnique({
      where: { employee_id: employeeId },
    });
    return account as unknown as UserInternal;
  }

  /**
   * Function Objective — createAccount
   */
  async createAccount(data: {
    username: string;
    password_hash: string;
    employee_id: string;
    role: AccountRole;
  }): Promise<UserInternal> {
    const account = await this._prisma.account.create({
      data: {
        username: data.username,
        password_hash: data.password_hash,
        employee_id: data.employee_id,
        role: data.role,
      },
    });
    return account as unknown as UserInternal;
  }

  // --- Refresh Token Implementation ---

  async saveRefreshToken(accountId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    return await this._prisma.refreshToken.create({
      data: {
        account_id: accountId,
        token,
        expires_at: expiresAt,
      },
    });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return await this._prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this._prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteAllRefreshTokensForUser(accountId: string): Promise<void> {
    await this._prisma.refreshToken.deleteMany({
      where: { account_id: accountId },
    });
  }
}
