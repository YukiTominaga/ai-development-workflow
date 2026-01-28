import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';
import { CreateTransactionSchema, TransactionQuerySchema } from '@/lib/validations';

// GET /api/transactions - Get all transactions with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = TransactionQuerySchema.parse(searchParams);

    const where: {
      type?: 'INCOME' | 'EXPENSE';
      categoryId?: string;
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) {
        where.date.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.date.lte = new Date(query.endDate);
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
      take: query.limit,
      skip: query.offset,
    });

    // Get total count for pagination
    const total = await prisma.transaction.count({ where });

    return NextResponse.json({
      data: transactions,
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateTransactionSchema.parse(body);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        date: new Date(data.date),
        description: data.description,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
