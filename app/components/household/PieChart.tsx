'use client';

import { getCategoryConfig } from '@/app/constants/categories';
import type { CategoryType } from '@/app/types/household';

interface PieChartProps {
  data: Array<{ category: CategoryType; amount: number; percentage: number }>;
}

export default function PieChart({ data }: PieChartProps) {
  if (data.length === 0) return null;

  let currentAngle = 0;
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  const slices = data.map((item) => {
    const config = getCategoryConfig(item.category);
    const angle = (item.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return {
      pathData,
      color: config.color,
      category: item.category,
      percentage: item.percentage,
    };
  });

  return (
    <div className="w-full">
      <svg viewBox="0 0 200 200" className="w-64 h-64 mx-auto">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            stroke="#000"
            strokeWidth="1"
          />
        ))}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.6}
          fill="#000"
        />
      </svg>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {data.map((item) => {
          const config = getCategoryConfig(item.category);
          return (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm text-gray-300">{item.category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
