import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';
import { UpdateCategorySchema } from '@/lib/validations';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/categories/[id] - Get a specific category
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = UpdateCategorySchema.parse(body);

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Check if category has transactions
    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id },
    });

    if (transactionCount > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete category with existing transactions',
          details: { transactionCount },
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
