import { Router } from 'express';
import { container } from '../inversify.config';
import { TYPES } from '../types';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { paramsValidationMiddleware } from '../middlewares/validation.middleware';
import { userIdSchema } from '../schemas/user.schema';

const adminRouter = Router();
const adminController = container.get<AdminController>(TYPES.AdminController);

// Protect all admin routes with authMiddleware and 'admin' role requirement
adminRouter.use(authMiddleware(['admin']));

adminRouter.get(
  '/users',
  (req, res, next) => adminController.getAllUsers(req, res, next)
);

adminRouter.get(
  '/users/:id',
  paramsValidationMiddleware(userIdSchema.shape.params),
  (req, res, next) => adminController.getUserById(req, res, next)
);

export { adminRouter };