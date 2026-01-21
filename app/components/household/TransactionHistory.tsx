'use client';

import { useState } from 'react';
import type { Transaction, CategoryType } from '@/app/types/household';
import { formatCurrency, formatDate } from '@/app/utils/date';
import { getCategoryConfig, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/app/constants/categories';

interface TransactionHistoryProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  getMonthlyTransactions: (month: string) => Transaction[];
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export default function TransactionHistory({
  selectedMonth,
  getMonthlyTransactions,
  updateTransaction,
  deleteTransaction,
}: TransactionHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const transactions = getMonthlyTransactions(selectedMonth).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateTransaction(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (confirm('この取引を削除しますか？')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">履歴</h2>
        <p className="text-gray-400">月ごとの取引履歴</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">今月の取引がありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    日付
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    カテゴリ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    メモ
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">
                    金額
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.map((transaction) => {
                  const config = getCategoryConfig(transaction.category);
                  const isEditing = editingId === transaction.id;

                  return (
                    <tr key={transaction.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          />
                        ) : (
                          formatDate(transaction.date)
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value as CategoryType,
                              })
                            }
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          >
                            {(editForm.type === 'expense'
                              ? EXPENSE_CATEGORIES
                              : INCOME_CATEGORIES
                            ).map((cat) => (
                              <option key={cat.name} value={cat.name}>
                                {cat.emoji} {cat.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{config.emoji}</span>
                            <span className="text-sm text-gray-300">
                              {transaction.category}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.memo}
                            onChange={(e) =>
                              setEditForm({ ...editForm, memo: e.target.value })
                            }
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm w-full"
                          />
                        ) : (
                          transaction.memo || '-'
                        )}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-medium ${
                          transaction.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }`}
                      >
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: parseFloat(e.target.value),
                              })
                            }
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm w-32 text-right"
                          />
                        ) : (
                          <>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded transition-colors"
                            >
                              保存
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                            >
                              キャンセル
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(transaction)}
                              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition-colors"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                            >
                              削除
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
