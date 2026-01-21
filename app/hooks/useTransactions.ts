'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Transaction, CategorySummary } from '@/app/types/household';

const STORAGE_KEY = 'household_transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse transactions:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getMonthlyTransactions = useCallback((month: string) => {
    return transactions.filter((t) => t.date.startsWith(month));
  }, [transactions]);

  const getMonthlySummary = useCallback((month: string) => {
    const monthTransactions = getMonthlyTransactions(month);
    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [getMonthlyTransactions]);

  const getCategorySummary = useCallback((month: string, type: 'income' | 'expense'): CategorySummary[] => {
    const monthTransactions = getMonthlyTransactions(month).filter(
      (t) => t.type === type
    );
    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, number>();
    monthTransactions.forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category: category as Transaction['category'],
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [getMonthlyTransactions]);

  const getTotalBalance = useCallback(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyTransactions,
    getMonthlySummary,
    getCategorySummary,
    getTotalBalance,
  };
}
