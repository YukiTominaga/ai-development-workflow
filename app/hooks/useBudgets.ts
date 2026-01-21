import { useLocalStorage } from './useLocalStorage';
import type { Budget } from '../types/household';

export function useBudgets() {
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('household-budgets', []);

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.id === id ? { ...budget, ...updates } : budget
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  const getBudgetByCategory = (category: string): Budget | undefined => {
    return budgets.find((budget) => budget.category === category);
  };

  return {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetByCategory,
  };
}
