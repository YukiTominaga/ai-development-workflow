import { useState } from 'react';
import type { Transaction, Budget, CategoryTotal } from '../../types/household';
import { TransactionModal } from './TransactionModal';
import { BudgetModal } from './BudgetModal';
import { CategoryPieChart } from './CategoryPieChart';
import { BudgetList } from './BudgetList';
import { TransactionList } from './TransactionList';

interface OverviewTabProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  getMonthlySummary: (month: string) => {
    income: number;
    expense: number;
    balance: number;
  };
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  getTransactionsByMonth: (month: string) => Transaction[];
  getCategoryBreakdown: (month: string, type: 'income' | 'expense') => CategoryTotal[];
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
}

export function OverviewTab({
  currentMonth,
  setCurrentMonth,
  getMonthlySummary,
  addTransaction,
  getTransactionsByMonth,
  getCategoryBreakdown,
  budgets,
  addBudget,
  deleteBudget,
}: OverviewTabProps) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const summary = getMonthlySummary(currentMonth);
  const transactions = getTransactionsByMonth(currentMonth);
  const expenseBreakdown = getCategoryBreakdown(currentMonth, 'expense');

  const spending = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const formatMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1);

    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between px-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              aria-label="前月"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-slate-900">{formatMonth(currentMonth)}</h2>

            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              aria-label="次月"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 px-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm text-slate-600">収入</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.income)}</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span className="text-sm text-slate-600">支出</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.expense)}</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-slate-600">残高</span>
              </div>
              <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                {formatCurrency(summary.balance)}
              </div>
            </div>
          </div>

          <div className="px-4 flex justify-end">
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">予算設定</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 px-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">カテゴリ別支出</h3>
              <CategoryPieChart data={expenseBreakdown} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">予算</h3>
              <BudgetList budgets={budgets} spending={spending} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm mx-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">取引履歴</h3>
            <TransactionList transactions={transactions} />
          </div>
        </div>

        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full shadow-xl flex items-center justify-center transition-colors"
          aria-label="取引を追加"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onAddTransaction={addTransaction}
        defaultDate={`${currentMonth}-${String(new Date().getDate()).padStart(2, '0')}`}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgets={budgets}
        onAddBudget={addBudget}
        onDeleteBudget={deleteBudget}
      />
    </>
  );
}
