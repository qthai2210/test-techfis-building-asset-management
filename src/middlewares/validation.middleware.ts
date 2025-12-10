/**
 * Validation Middleware
 * Change Log
 * 2025-11-12: Create bodyValidationMiddleware, paramsValidationMiddleware, queryValidationMiddleware. (ThaiNQ)
 */
import { ResponseCodes } from "../utils/exception";
import { formatResponse } from "../utils/formatter";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

/**
 * Middleware for validating request body
 * @param schema - Zod schema for validation
 */
export const bodyValidationMiddleware =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Default to empty object if body is undefined (e.g., multipart/form-data with no fields)
      const bodyData = req.body ?? {};
      const validatedData = schema.parse(bodyData);
      req.body = validatedData; // Replace with validated & transformed data
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map(
          (err) => `${err.path.join(".")} - ${err.message}`
        );
        const response = formatResponse(
          ResponseCodes.BAD_REQUEST,
          "Body validation error",
          validationErrors
        );
        return res.status(ResponseCodes.BAD_REQUEST).json(response);
      }
      next(error);
    }
  };

/**
 * Middleware for validating request params (e.g., :id)
 * @param schema - Zod schema for validation
 */
export const paramsValidationMiddleware =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData; // Replace with validated & transformed data
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map(
          (err) => `${err.path.join(".")} - ${err.message}`
        );
        const response = formatResponse(
          ResponseCodes.BAD_REQUEST,
          "Params validation error",
          validationErrors
        );
        return res.status(ResponseCodes.BAD_REQUEST).json(response);
      }
      next(error);
    }
  };

/**
 * Middleware for validating query parameters
 * @param schema - Zod schema for validation
 */
export const queryValidationMiddleware =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      // Store validated data on `req.query` for easier typed access in handlers
      // and keep `validatedQuery` for backward compatibility.
      try {
        (req as any).query = validatedData;
      } catch (e) {
        // In case assignment fails at runtime, still set validatedQuery
      }
      (req as any).validatedQuery = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map(
          (err) => `${err.path.join(".")} - ${err.message}`
        );
        const response = formatResponse(
          ResponseCodes.BAD_REQUEST,
          "Query validation error",
          validationErrors
        );
        return res.status(ResponseCodes.BAD_REQUEST).json(response);
      }
      next(error);
    }
  };

// Backward compatibility
export const validationMiddleware = bodyValidationMiddleware;
export default validationMiddleware;
