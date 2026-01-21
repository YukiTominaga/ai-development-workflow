import type { Budget } from '../../types/household';

interface BudgetListProps {
  budgets: Budget[];
  spending: Record<string, number>;
}

export function BudgetList({ budgets, spending }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-slate-400">予算が設定されていません</p>
      </div>
    );
  }

  const displayBudgets = budgets.slice(0, 3);
  const remainingCount = budgets.length > 3 ? budgets.length - 3 : 0;

  return (
    <div className="space-y-4">
      {displayBudgets.map((budget) => {
        const spent = spending[budget.category] || 0;
        const percentage = (spent / budget.amount) * 100;
        const isOverBudget = percentage > 100;

        return (
          <div key={budget.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{budget.icon}</span>
                <span className="font-medium text-slate-700">{budget.category}</span>
              </div>
              <div className="text-sm">
                <span className={isOverBudget ? 'text-red-600 font-bold' : 'text-slate-900'}>
                  ¥{spent.toLocaleString()}
                </span>
                <span className="text-slate-500"> / ¥{budget.amount.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isOverBudget ? 'bg-red-600' : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        );
      })}

      {remainingCount > 0 && (
        <div className="text-center pt-2">
          <span className="text-sm text-slate-500">他 {remainingCount} 件の予算</span>
        </div>
      )}
    </div>
  );
}
