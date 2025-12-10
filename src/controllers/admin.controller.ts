import { IUserService } from '../services/user/user.service.interface';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { formatResponse } from '../utils/formatter';
import { ResponseCodes, HttpException } from '../utils/exception';

@injectable()
export class AdminController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  /**
   * Function Objective — getAllUsers
   * Summary: Retrieve a list of all users.
   * Inputs: Authorization (Admin role).
   * Preconditions: Authenticated user must have 'admin' role.
   * Behavior: Call UserService.getAllUsers -> Return list.
   * Responses: 200 | 401 | 403
   * Side effects: None.
   */
  /**
   * Change Log
   * 2025-12-05: Create. (ThaiNQ)
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(ResponseCodes.OK).json(
        formatResponse(ResponseCodes.OK, 'Get all users successfully', users)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Function Objective — getUserById
   * Summary: Retrieve a specific user by ID.
   * Inputs: id (params).
   * Preconditions: Authenticated user must have 'admin' role.
   * Behavior: Call UserService.getUserById -> Return user object or 404.
   * Responses: 200 | 404 | 401 | 403
   * Side effects: None.
   */
  /**
   * Change Log
   * 2025-12-08: Create. (ThaiNQ)
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        throw new HttpException(ResponseCodes.NOT_FOUND, 'User not found');
      }

      res.status(ResponseCodes.OK).json(
        formatResponse(ResponseCodes.OK, 'Get user details successfully', user)
      );
    } catch (error) {
      next(error);
    }
  }
}