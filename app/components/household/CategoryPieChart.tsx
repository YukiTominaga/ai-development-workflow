import { useMemo } from 'react';
import type { CategoryTotal } from '../../types/household';
import { CATEGORY_COLORS, getCategoryIcon } from '../../constants/categories';

interface CategoryPieChartProps {
  data: CategoryTotal[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    let currentAngle = -90;
    return data.map((item) => {
      const startAngle = currentAngle;
      const sweepAngle = (item.percentage / 100) * 360;
      currentAngle += sweepAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (currentAngle * Math.PI) / 180;

      const x1 = 50 + 40 * Math.cos(startRad);
      const y1 = 50 + 40 * Math.sin(startRad);
      const x2 = 50 + 40 * Math.cos(endRad);
      const y2 = 50 + 40 * Math.sin(endRad);

      const largeArc = sweepAngle > 180 ? 1 : 0;

      return {
        category: item.category,
        percentage: item.percentage,
        path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
        color: CATEGORY_COLORS[item.category] || '#6b7280',
      };
    });
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">データがありません</p>
      </div>
    );
  }

  const topCategories = data.slice(0, 4);
  const otherCount = data.length > 4 ? data.length - 4 : 0;

  return (
    <div className="flex items-center gap-8">
      <div className="w-64 h-64 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {chartData.map((item, index) => (
            <path
              key={item.category}
              d={item.path}
              fill={item.color}
              className="transition-opacity hover:opacity-80"
            />
          ))}
        </svg>
      </div>

      <div className="flex-1 space-y-3">
        {topCategories.map((item) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#6b7280' }}
              />
              <span className="text-xl">{getCategoryIcon(item.category)}</span>
              <span className="text-slate-700">{item.category}</span>
            </div>
            <span className="font-medium text-slate-900">{Math.round(item.percentage)}%</span>
          </div>
        ))}
        {otherCount > 0 && (
          <div className="text-sm text-slate-500">
            他 {otherCount} カテゴリ
          </div>
        )}
      </div>
    </div>
  );
}
