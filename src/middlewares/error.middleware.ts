import { Request, Response, NextFunction } from 'express';
import { HttpException, ResponseCodes } from '../utils/exception';
import { errorLogger } from '../utils/loggers/error.logger';
import { config } from '../config';
// Helper function to redact sensitive data
const sanitizeBody = (body: any) => {
  if (!body) return body;
  const sanitized = { ...body };
  if ('password' in sanitized) sanitized.password = '[REDACTED]';
  if ('refreshToken' in sanitized) sanitized.refreshToken = '[REDACTED]';
  // Add any other sensitive fields you want to redact
  return sanitized;
};

/**
 * Global Error Handling Middleware
 * 
 * Captures all errors thrown in the application (synchronous or asynchronous passed via next()).
 * Formats the response to a standard structure and logs the error.
 */
export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    const statusCode = error instanceof HttpException ? error.status : ResponseCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    const data = error instanceof HttpException ? error.data : null;

    // Log the error details
    errorLogger.error({
      statusCode,
      message,
      path: req.path,
      method: req.method,
      ip: req.ip,
      stack: error.stack,
      body: sanitizeBody(req.body),
      query: req.query,
      params: req.params,
    });

    // Send standardized response
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      data,
      // Only show stack trace in development mode for security
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  } catch (err) {
    // Fallback if error handling logic itself fails
    next(err);
  }
};
