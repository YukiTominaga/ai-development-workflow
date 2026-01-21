import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import type { Budget } from '../../types/household';
import { EXPENSE_CATEGORIES, getCategoryIcon } from '../../constants/categories';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

export function BudgetModal({ isOpen, onClose, budgets, onAddBudget, onDeleteBudget }: BudgetModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !amount) return;

    const icon = getCategoryIcon(selectedCategory);
    onAddBudget({
      category: selectedCategory,
      amount: parseInt(amount),
      icon,
    });

    setSelectedCategory('');
    setAmount('');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-slate-900">
              予算設定
            </Dialog.Title>
            <Dialog.Close className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                カテゴリ
              </label>
              <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
                <Select.Trigger className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between">
                  <Select.Value placeholder="カテゴリを選択" />
                  <Select.Icon>
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
                    <Select.Viewport className="p-2">
                      {EXPENSE_CATEGORIES.map((category) => (
                        <Select.Item
                          key={category.name}
                          value={category.name}
                          className="px-4 py-2 rounded hover:bg-slate-100 cursor-pointer outline-none flex items-center gap-2"
                        >
                          <span className="text-xl">{category.icon}</span>
                          <Select.ItemText>{category.name}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                予算額
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">¥</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              予算を設定
            </button>
          </form>

          {budgets.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">設定済み予算</h3>
              <div className="space-y-2">
                {budgets.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{budget.icon}</span>
                      <span className="font-medium text-slate-900">{budget.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-900">¥{budget.amount.toLocaleString()}</span>
                      <button
                        onClick={() => onDeleteBudget(budget.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        aria-label="削除"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
