'use client';

import { useState } from 'react';
import type { Transaction, TransactionType, CategoryType } from '@/app/types/household';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/app/constants/categories';

interface TransactionInputProps {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function TransactionInput({ addTransaction }: TransactionInputProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<CategoryType>('食費');
  const [amount, setAmount] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      alert('有効な金額を入力してください');
      return;
    }

    addTransaction({
      type,
      category,
      amount: amountNum,
      memo,
      date,
    });

    setAmount('');
    setMemo('');
    setCategory(type === 'expense' ? '食費' : '給与');
    alert('取引を追加しました');
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">収支入力</h2>
        <p className="text-gray-400">新しい取引を記録</p>
      </div>

      <div className="max-w-2xl bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">新規取引を追加</h3>

        {/* Type Toggle */}
        <div className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setType('expense');
                setCategory('食費');
              }}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              支出
            </button>
            <button
              onClick={() => {
                setType('income');
                setCategory('給与');
              }}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                type === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              収入
            </button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                  category === cat.name
                    ? 'bg-gray-800 border-emerald-500'
                    : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm text-gray-300">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">金額</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              ¥
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Memo Input */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">メモ</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="取引の説明"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Date Input */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
        >
          追加
        </button>
      </div>
    </div>
  );
}
