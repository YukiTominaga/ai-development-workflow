import type { CategoryType } from '@/app/types/household';

export interface CategoryConfig {
  name: CategoryType;
  emoji: string;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { name: '食費', emoji: '🛒', color: '#10b981' },
  { name: '交通費', emoji: '🚗', color: '#f59e0b' },
  { name: '娯楽', emoji: '🎮', color: '#8b5cf6' },
  { name: '光熱費', emoji: '💡', color: '#eab308' },
  { name: '日用品', emoji: '🗒️', color: '#6b7280' },
  { name: '衣服', emoji: '👕', color: '#06b6d4' },
  { name: '医療', emoji: '🏥', color: '#ec4899' },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { name: '給与', emoji: '💰', color: '#10b981' },
  { name: '副業', emoji: '💼', color: '#8b5cf6' },
  { name: 'その他', emoji: '📦', color: '#6b7280' },
];

export const ALL_CATEGORIES: CategoryConfig[] = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
];

export const getCategoryConfig = (category: CategoryType): CategoryConfig => {
  return (
    ALL_CATEGORIES.find((c) => c.name === category) || {
      name: category,
      emoji: '📦',
      color: '#6b7280',
    }
  );
};
