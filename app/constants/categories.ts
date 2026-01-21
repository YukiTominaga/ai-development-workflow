export const INCOME_CATEGORIES = [
  { name: '給料', icon: '💼' },
  { name: 'ボーナス', icon: '🎁' },
  { name: '副業', icon: '💻' },
  { name: '投資', icon: '📈' },
  { name: 'その他', icon: '📦' },
] as const;

export const EXPENSE_CATEGORIES = [
  { name: '食費', icon: '🍽️' },
  { name: '住居費', icon: '🏠' },
  { name: '光熱費', icon: '💡' },
  { name: '交通費', icon: '🚃' },
  { name: '通信費', icon: '📱' },
  { name: '娯楽費', icon: '🎮' },
  { name: '医療費', icon: '🏥' },
  { name: '教育費', icon: '📚' },
  { name: '保険', icon: '🛡️' },
  { name: 'その他', icon: '📦' },
] as const;

export function getCategoryIcon(category: string): string {
  const expenseCategory = EXPENSE_CATEGORIES.find(c => c.name === category);
  if (expenseCategory) return expenseCategory.icon;

  const incomeCategory = INCOME_CATEGORIES.find(c => c.name === category);
  if (incomeCategory) return incomeCategory.icon;

  return '📦';
}

export const CATEGORY_COLORS: Record<string, string> = {
  '食費': '#10b981',
  '住居費': '#3b82f6',
  '光熱費': '#f59e0b',
  '交通費': '#eab308',
  '通信費': '#8b5cf6',
  '娯楽費': '#ef4444',
  '医療費': '#14b8a6',
  '教育費': '#06b6d4',
  '保険': '#6366f1',
  'その他': '#6b7280',
};
