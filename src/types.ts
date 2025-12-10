export const TYPES = {
  // Infrastructure
  PrismaClient: Symbol.for('PrismaClient'),

  // Repositories
  AccountRepository: Symbol.for('AccountRepository'),

  // Services
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),

  // Controllers
  AuthController: Symbol.for('AuthController'),
  AdminController: Symbol.for('AdminController'),
};
