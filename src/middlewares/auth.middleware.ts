import { config } from '../config';
import { ResponseCodes } from '../utils/exception';
import { formatResponse } from '../utils/formatter';
import { prismaClient } from '../utils/db';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Removed generic PrismaClient instantiation to use singleton pattern

interface JwtPayload {
  userId: string;
  username: string;
}

export function authMiddleware(allowed: 'NoAuth' | string[] = []) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // No authentication
    if (allowed === 'NoAuth') {
      return next();
    }

    // Check token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      // Unauthorized
      const response = formatResponse(ResponseCodes.UNAUTHORIZED, 'Access token is missing.', null);
      res.status(ResponseCodes.UNAUTHORIZED).json(response);
      return;
    }
    try {
      const payload = jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET) as JwtPayload;

      const account = await prismaClient.account.findUnique({
        where: { id: payload.userId },
        include: { employee: true },
      });

      if (!account) {
        // Unauthorized
        const response = formatResponse(ResponseCodes.UNAUTHORIZED, 'Token is invalid.', null);
        res.status(ResponseCodes.UNAUTHORIZED).json(response);
        return;
      }

      // Attach user to req
      (req as any).user = account;

      // Check role allowed
      if (allowed.length > 0 && !allowed.includes(account.role)) {
        // Unauthorized
        const response = formatResponse(
          ResponseCodes.FORBIDDEN,
          'Forbidden: insufficient role',
          null,
        );
        res.status(ResponseCodes.FORBIDDEN).json(response);
        return;
      }

      next();
    } catch (err) {
      // Unauthorized
      const response = formatResponse(ResponseCodes.UNAUTHORIZED, 'Invalid or expired token', null);
      res.status(ResponseCodes.UNAUTHORIZED).json(response);
      return;
    }
  };
}
export default authMiddleware;
