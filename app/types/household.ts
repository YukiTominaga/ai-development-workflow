export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  icon: string;
}
