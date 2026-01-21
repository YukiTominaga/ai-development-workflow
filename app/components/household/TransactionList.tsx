import type { Transaction } from '../../types/household';
import { getCategoryIcon } from '../../constants/categories';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-slate-400">取引履歴がありません</p>
      </div>
    );
  }

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-slate-500 mb-3">{formatDate(date)}</h3>
          <div className="space-y-2">
            {groupedTransactions[date].map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-xl">
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{transaction.category}</div>
                    {transaction.description && (
                      <div className="text-sm text-slate-500">{transaction.description}</div>
                    )}
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
