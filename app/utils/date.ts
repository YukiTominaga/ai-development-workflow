export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  return `${year}年${parseInt(m)}月`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}
