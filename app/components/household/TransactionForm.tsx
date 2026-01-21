import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import type { Transaction, TransactionType } from '../../types/household';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/categories';

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  defaultDate?: string;
}

export function TransactionForm({ initialData, onSubmit, onCancel, defaultDate }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '0');
  const [category, setCategory] = useState(initialData?.category || '');
  const [date, setDate] = useState(
    initialData?.date || defaultDate || new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(initialData?.description || '');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('金額を正しく入力してください');
      return;
    }
    if (!category) {
      alert('カテゴリを選択してください');
      return;
    }
    if (!date) {
      alert('日付を入力してください');
      return;
    }

    onSubmit({
      type,
      amount: amountNum,
      category,
      date,
      description,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">取引種別</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('');
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              type === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            収入
          </button>
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              type === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            支出
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">金額</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">¥</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            min="0"
            step="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">カテゴリ</label>
        <Select.Root value={category} onValueChange={setCategory}>
          <Select.Trigger
            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
            aria-label="カテゴリを選択"
          >
            <Select.Value placeholder="カテゴリを選択してください" />
            <Select.Icon>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
              <Select.Viewport className="p-2">
                {categories.map((cat) => (
                  <Select.Item
                    key={cat.name}
                    value={cat.name}
                    className="px-4 py-2 rounded-md cursor-pointer hover:bg-blue-50 focus:bg-blue-50 focus:outline-none data-[state=checked]:bg-blue-100 flex items-center gap-2"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <Select.ItemText>{cat.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">説明（任意）</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="詳細を入力してください"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          追加
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
