import { z } from 'zod';

// TransactionType enum validation
export const TransactionTypeSchema = z.enum(['INCOME', 'EXPENSE']);

// Category validation schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: TransactionTypeSchema,
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
  type: TransactionTypeSchema.optional(),
});

// Transaction validation schemas
export const CreateTransactionSchema = z.object({
  type: TransactionTypeSchema,
  amount: z.number().int().positive('Amount must be a positive integer'),
  date: z.string().datetime().or(z.date()),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
});

export const UpdateTransactionSchema = z.object({
  type: TransactionTypeSchema.optional(),
  amount: z.number().int().positive('Amount must be a positive integer').optional(),
  date: z.string().datetime().or(z.date()).optional(),
  description: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Category ID is required').optional(),
});

// Query parameter schemas
export const TransactionQuerySchema = z.object({
  type: TransactionTypeSchema.optional(),
  categoryId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  offset: z.string().transform(Number).pipe(z.number().int().nonnegative()).optional(),
});

export const CategoryQuerySchema = z.object({
  type: TransactionTypeSchema.optional(),
});

export const StatisticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['category', 'month', 'day']).optional(),
});
