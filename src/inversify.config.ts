import { Container } from 'inversify';
import { TYPES } from './types';
import { PrismaClient } from '@prisma/client';
import { prismaClient } from './utils/db';

// Interfaces & Implementations
import { IAccountRepository } from './repositories/account/account.repository.interface';
import { AccountRepository } from './repositories/account/account.repository';
import { IAuthService } from './services/auth/auth.service.interface';
import { AuthService } from './services/auth/auth.service';
import { IUserService } from './services/user/user.service.interface';
import { UserService } from './services/user/user.service';
import { AuthController } from './controllers/auth.controller';
import { AdminController } from './controllers/admin.controller';

const container = new Container();

// Bind Infrastructure
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prismaClient);

// Bind Repositories
container.bind<IAccountRepository>(TYPES.AccountRepository).to(AccountRepository).inSingletonScope();

// Bind Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();

// Bind Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<AdminController>(TYPES.AdminController).to(AdminController).inSingletonScope();

export { container };
