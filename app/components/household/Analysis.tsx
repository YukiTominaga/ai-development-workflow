'use client';

import type { CategorySummary } from '@/app/types/household';
import { formatCurrency } from '@/app/utils/date';
import { getCategoryConfig } from '@/app/constants/categories';
import PieChart from './PieChart';

interface AnalysisProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  getCategorySummary: (
    month: string,
    type: 'income' | 'expense'
  ) => CategorySummary[];
  getMonthlySummary: (month: string) => {
    income: number;
    expense: number;
    balance: number;
  };
}

export default function Analysis({
  selectedMonth,
  getCategorySummary,
  getMonthlySummary,
}: AnalysisProps) {
  const expenseSummary = getCategorySummary(selectedMonth, 'expense');
  const incomeSummary = getCategorySummary(selectedMonth, 'income');
  const summary = getMonthlySummary(selectedMonth);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">分析</h2>
        <p className="text-gray-400">月ごとのカテゴリ別内訳</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Expense Analysis */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">支出内訳</h3>
          {expenseSummary.length > 0 ? (
            <>
              <PieChart data={expenseSummary} />
              <div className="mt-6">
                <table className="w-full">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">
                        カテゴリ
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">
                        金額
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">
                        割合
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {expenseSummary.map((item) => {
                      const config = getCategoryConfig(item.category);
                      return (
                        <tr key={item.category}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{config.emoji}</span>
                              <span className="text-sm text-gray-300">
                                {item.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-red-400 font-medium">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300">
                            {item.percentage.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-400">
                        合計
                      </td>
                      <td className="px-4 py-3 text-right text-red-400 font-bold">
                        {formatCurrency(summary.expense)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300 font-medium">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center py-8">
              今月の支出データがありません
            </p>
          )}
        </div>

        {/* Income Analysis */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">収入内訳</h3>
          {incomeSummary.length > 0 ? (
            <>
              <PieChart data={incomeSummary} />
              <div className="mt-6">
                <table className="w-full">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">
                        カテゴリ
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">
                        金額
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">
                        割合
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {incomeSummary.map((item) => {
                      const config = getCategoryConfig(item.category);
                      return (
                        <tr key={item.category}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{config.emoji}</span>
                              <span className="text-sm text-gray-300">
                                {item.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300">
                            {item.percentage.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-400">
                        合計
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-bold">
                        {formatCurrency(summary.income)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300 font-medium">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center py-8">
              今月の収入データがありません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
