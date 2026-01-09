import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const SpendingHeatmap = ({ transactions }) => {
  const data = transactions
    .filter(t => !t.type) // Only count actual expenses
    .reduce((acc, t) => {
      const existing = acc.find(item => item.date === t.date);
      if (existing) existing.count += Number(t.amount);
      else acc.push({ date: t.date, count: Number(t.amount) });
      return acc;
    }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-4">Spending Intensity</h3>
      <CalendarHeatmap
        startDate={new Date('2025-01-01')}
        endDate={new Date('2025-12-31')}
        values={data}
        classForValue={(value) => {
          if (!value) return 'fill-gray-100';
          if (value.count > 500) return 'fill-red-500';
          if (value.count > 100) return 'fill-red-300';
          return 'fill-red-100';
        }}
      />
      <style>{`
        .react-calendar-heatmap .fill-gray-100 { fill: #f3f4f6; }
        .react-calendar-heatmap .fill-red-100 { fill: #fee2e2; }
        .react-calendar-heatmap .fill-red-300 { fill: #fca5a5; }
        .react-calendar-heatmap .fill-red-500 { fill: #ef4444; }
      `}</style>
    </div>
  );
};
export default SpendingHeatmap;