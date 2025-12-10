import httpLogger from '../utils/loggers/http.logger';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = uuidv4();

  res.on('finish', () => {
    const duration = Date.now() - start;

    httpLogger.info({
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration,
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
      userId: (req as any).user?.id || null,
    });
  });

  next();
};
export default logMiddleware;
