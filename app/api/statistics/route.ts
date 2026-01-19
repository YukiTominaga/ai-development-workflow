import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';
import { StatisticsQuerySchema } from '@/lib/validations';

// GET /api/statistics - Get transaction statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = StatisticsQuerySchema.parse(searchParams);

    const where: {
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) {
        where.date.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.date.lte = new Date(query.endDate);
      }
    }

    // Get total income and expense
    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalIncome = incomeResult._sum.amount ?? 0;
    const totalExpense = expenseResult._sum.amount ?? 0;
    const balance = totalIncome - totalExpense;

    // Get breakdown by category
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
    });

    const categoryBreakdown = transactions.reduce(
      (acc, transaction) => {
        const key = transaction.category.name;
        if (!acc[key]) {
          acc[key] = {
            categoryId: transaction.category.id,
            categoryName: transaction.category.name,
            type: transaction.type,
            totalAmount: 0,
            count: 0,
          };
        }
        acc[key].totalAmount += transaction.amount;
        acc[key].count += 1;
        return acc;
      },
      {} as Record<
        string,
        {
          categoryId: string;
          categoryName: string;
          type: 'INCOME' | 'EXPENSE';
          totalAmount: number;
          count: number;
        }
      >
    );

    // Group by time period if requested
    let timeSeriesData: {
      period: string;
      income: number;
      expense: number;
      balance: number;
    }[] = [];

    if (query.groupBy) {
      const groupedTransactions = transactions.reduce(
        (acc, transaction) => {
          let periodKey: string;
          const date = new Date(transaction.date);

          if (query.groupBy === 'day') {
            periodKey = date.toISOString().split('T')[0];
          } else if (query.groupBy === 'month') {
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          } else {
            // Default to category grouping
            periodKey = transaction.category.name;
          }

          if (!acc[periodKey]) {
            acc[periodKey] = { income: 0, expense: 0 };
          }

          if (transaction.type === 'INCOME') {
            acc[periodKey].income += transaction.amount;
          } else {
            acc[periodKey].expense += transaction.amount;
          }

          return acc;
        },
        {} as Record<string, { income: number; expense: number }>
      );

      timeSeriesData = Object.entries(groupedTransactions)
        .map(([period, data]) => ({
          period,
          income: data.income,
          expense: data.expense,
          balance: data.income - data.expense,
        }))
        .sort((a, b) => a.period.localeCompare(b.period));
    }

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpense,
        balance,
        incomeCount: incomeResult._count,
        expenseCount: expenseResult._count,
      },
      categoryBreakdown: Object.values(categoryBreakdown),
      timeSeriesData: query.groupBy ? timeSeriesData : undefined,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
