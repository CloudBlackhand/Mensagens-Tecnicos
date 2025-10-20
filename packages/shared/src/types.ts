import { z } from 'zod';

// User types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  picture: z.string().optional(),
  googleId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// Auth types
export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Sheets types
export const SheetDataSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  totalRows: z.number(),
  lastUpdated: z.string().datetime(),
  sheetId: z.string(),
});

export type SheetData = z.infer<typeof SheetDataSchema>;

// API Response types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// Error types
export const ApiErrorSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  timestamp: z.string().datetime(),
  path: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
