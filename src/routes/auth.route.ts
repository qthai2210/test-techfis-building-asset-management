import { Router } from 'express';
import { container } from '../inversify.config';
import { TYPES } from '../types';
import { AuthController } from '../controllers/auth.controller';
import { bodyValidationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { changePasswordSchema, createUserSchema, loginSchema, logoutSchema, refreshTokenSchema, updateProfileSchema } from '../schemas/user.schema';

const authRouter = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

authRouter.post(
  '/login',
  bodyValidationMiddleware(loginSchema.shape.body),
  (req, res, next) => authController.login(req, res, next)
);

authRouter.post(
  '/register',
  bodyValidationMiddleware(createUserSchema.shape.body),
  (req, res, next) => authController.register(req, res, next)
);

authRouter.post(
  '/refresh-token',
  bodyValidationMiddleware(refreshTokenSchema.shape.body),
  (req, res, next) => authController.refreshToken(req, res, next)
);

authRouter.post(
  '/logout',
  bodyValidationMiddleware(logoutSchema.shape.body),
  (req, res, next) => authController.logout(req, res, next)
);

authRouter.post(
  '/change-password',
  authMiddleware(),
  bodyValidationMiddleware(changePasswordSchema.shape.body),
  (req, res, next) => authController.changePassword(req, res, next)
);

authRouter.put(
  '/profile',
  authMiddleware(),
  bodyValidationMiddleware(updateProfileSchema.shape.body),
  (req, res, next) => authController.updateProfile(req, res, next)
);

authRouter.get(
  '/me',
  authMiddleware(),
  (req, res, next) => authController.getProfile(req, res, next)
);

export { authRouter };