'use client';

import type { Transaction } from '@/app/types/household';
import { formatCurrency, formatMonth, formatDate } from '@/app/utils/date';
import { getCategoryConfig } from '@/app/constants/categories';
import PieChart from './PieChart';

interface DashboardProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  transactions: Transaction[];
  getMonthlySummary: (month: string) => { income: number; expense: number; balance: number };
  getCategorySummary: (month: string, type: 'income' | 'expense') => Array<{ category: string; amount: number; percentage: number }>;
  getMonthlyTransactions: (month: string) => Transaction[];
  getTotalBalance: () => number;
}

export default function Dashboard({
  selectedMonth,
  getMonthlySummary,
  getCategorySummary,
  getMonthlyTransactions,
  getTotalBalance,
}: DashboardProps) {
  const summary = getMonthlySummary(selectedMonth);
  const expenseSummary = getCategorySummary(selectedMonth, 'expense');
  const recentTransactions = getMonthlyTransactions(selectedMonth)
    .slice(0, 5)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalBalance = getTotalBalance();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">ダッシュボード</h2>
        <p className="text-gray-400">今月の収支状況</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">収入</span>
            <span className="text-emerald-400">↗</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            {formatCurrency(summary.income)}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">支出</span>
            <span className="text-red-400">↘</span>
          </div>
          <div className="text-3xl font-bold text-red-400">
            {formatCurrency(summary.expense)}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">残高</span>
            <span className="text-emerald-400">💰</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            {formatCurrency(totalBalance)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">カテゴリ別支出</h3>
          {expenseSummary.length > 0 ? (
            <div className="flex justify-center">
              <PieChart data={expenseSummary} />
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              今月の支出データがありません
            </p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">最近の取引</h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => {
                const config = getCategoryConfig(transaction.category);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.emoji}</span>
                      <div>
                        <p className="text-white font-medium">
                          {transaction.category}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {transaction.type === 'income' ? '給与' : transaction.category} • {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        transaction.type === 'income'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              今月の取引がありません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
