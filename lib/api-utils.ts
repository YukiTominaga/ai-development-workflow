import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiError = {
  error: string;
  details?: unknown;
};

export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

export function validateMethod(
  request: Request,
  allowedMethods: string[]
): NextResponse<ApiError> | null {
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      { error: `Method ${request.method} not allowed` },
      { status: 405 }
    );
  }
  return null;
}
