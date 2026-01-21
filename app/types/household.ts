export type TransactionType = 'income' | 'expense';

export type CategoryType =
  | '食費'
  | '交通費'
  | '娯楽'
  | '光熱費'
  | '日用品'
  | '衣服'
  | '医療'
  | '給与'
  | '副業'
  | 'その他';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: CategoryType;
  amount: number;
  memo: string;
  date: string; // ISO 8601 format
}

export interface CategorySummary {
  category: CategoryType;
  amount: number;
  percentage: number;
}

export interface MonthlySummary {
  month: string; // YYYY-MM format
  income: number;
  expense: number;
  balance: number;
}
