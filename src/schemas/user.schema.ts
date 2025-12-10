import { z } from 'zod';

// Role enum, synchronized with Prisma
export const AccountRoleEnum = z.enum(['user', 'admin', 'manager']);

// --- REQUEST SCHEMAS ---

// Schema for creating a new User (Account)
export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string({ message: 'Username is required' })
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .trim(),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    role: AccountRoleEnum.optional().default('user'),
    employee_id: z
      .string({ message: 'Employee ID is required' })
      .uuid('Invalid Employee ID format'),
  }),
});

// Schema for updating a User
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid User ID format'),
  }),
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .trim()
      .optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    role: AccountRoleEnum.optional(),
    employee_id: z.string().uuid('Invalid Employee ID format').optional(),
  }),
});

// Schema for user login
export const loginSchema = z.object({
  body: z.object({
    username: z.string({ message: 'Username is required' }).trim(),
    password: z.string({ message: 'Password is required' }),
  }),
});

// Schema for changing password
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ message: 'Current password is required' }),
    newPassword: z
      .string({ message: 'New password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

// Schema for updating user's own profile (username only for now)
export const updateProfileSchema = z.object({
  body: z.object({
    username: z
      .string({ message: 'Username must be a string' })
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .trim()
      .optional(),
  }),
});

// Schema for validating ID in params (Get detail, Delete operations)
export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid User ID format'),
  }),
});

// Schema for refresh token request
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ message: 'Refresh token is required' }),
  }),
});

// Schema for logout
export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string({ message: 'Refresh token is required' }),
  }),
});

// --- RESPONSE SCHEMAS ---

// Full User Schema for Repository/Internal use (includes password)
export const userInternalSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  password_hash: z.string(), // Hash password
  role: AccountRoleEnum,
  employee_id: z.string().uuid(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
  // Add optional relations if needed, or keep them separate
  employee: z.any().optional(), // Placeholder for relation
});

// Standard User Response (excludes sensitive data like password)
export const userResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  role: AccountRoleEnum,
  employee_id: z.string().uuid(),
  created_at: z.date().or(z.string()), // Date objects or ISO strings
  updated_at: z.date().or(z.string()),
});

// Employee Schema for Response
export const employeeResponseSchema = z.object({
  id: z.string().uuid(),
  employee_code: z.string(),
  full_name: z.string(),
  position: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).nullable(),
  status: z.enum(['active', 'inactive', 'resigned']),
  department: z.object({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string(),
  }).nullable().optional(),
});

// User Detail Response (includes employee info)
export const userDetailResponseSchema = userResponseSchema.extend({
  employee: employeeResponseSchema.nullable().optional(),
});

// Response for Login (Token + User info)
export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  user: userResponseSchema,
});

// Response for Refresh Token
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

// --- TYPES ---

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type UserIdParam = z.infer<typeof userIdSchema>['params'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
export type LogoutInput = z.infer<typeof logoutSchema>['body'];

export type UserInternal = z.infer<typeof userInternalSchema>; // Replacement for AccountEntity
export type UserResponse = z.infer<typeof userResponseSchema>;
export type EmployeeResponse = z.infer<typeof employeeResponseSchema>;
export type UserDetailResponse = z.infer<typeof userDetailResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;