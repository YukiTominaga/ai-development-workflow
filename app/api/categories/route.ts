import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';
import { CreateCategorySchema, CategoryQuerySchema } from '@/lib/validations';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = CategoryQuerySchema.parse(searchParams);

    const categories = await prisma.category.findMany({
      where: query.type ? { type: query.type } : undefined,
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateCategorySchema.parse(body);

    const category = await prisma.category.create({
      data,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
