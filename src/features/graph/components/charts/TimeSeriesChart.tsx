/**
 * TimeSeriesChart Component
 *
 * Line chart for temporal data visualization
 * Features:
 * - Multiple series support
 * - Interactive tooltip
 * - Legend
 * - Brush for zoom/pan
 * - date-fns formatting
 * - Smooth animations
 * - Responsive
 */

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DataPoint {
  date: Date | string;
  [key: string]: number | Date | string;
}

interface TimeSeriesChartProps {
  data: DataPoint[];
  series: {
    key: string;
    name: string;
    color: string;
  }[];
  height?: number;
  showBrush?: boolean;
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export function TimeSeriesChart({
  data,
  series,
  height = 300,
  showBrush = false,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
}: TimeSeriesChartProps) {
  // Format data with proper date parsing
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      dateValue: typeof item.date === 'string' ? new Date(item.date) : item.date,
      dateLabel: format(typeof item.date === 'string' ? new Date(item.date) : item.date, 'd MMM', {
        locale: es,
      }),
    }));
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ color: string; name: string; value: number }>;
    label?: string;
  }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-[#1E2533] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-sm text-gray-300 mb-2">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-semibold">{entry.value.toLocaleString('es-CO')}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis
          dataKey="dateLabel"
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
          label={
            xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined
          }
        />
        <YAxis
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
            }}
            iconType="line"
          />
        )}
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={600}
          />
        ))}
        {showBrush && <Brush dataKey="dateLabel" height={30} stroke="#3B82F6" fill="#1E2533" />}
      </LineChart>
    </ResponsiveContainer>
  );
}
