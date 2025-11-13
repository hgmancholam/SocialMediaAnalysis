/**
 * BarChart Component
 *
 * Bar chart for comparative data visualization
 * Features:
 * - Stacked/Grouped modes
 * - Interactive tooltip
 * - Legend
 * - Smooth animations
 * - Responsive
 * - Themed colors
 */

'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  bars: {
    key: string;
    name: string;
    color: string;
  }[];
  height?: number;
  stacked?: boolean;
  showLegend?: boolean;
  xAxisKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  layout?: 'vertical' | 'horizontal';
}

export function BarChart({
  data,
  bars,
  height = 300,
  stacked = false,
  showLegend = true,
  xAxisKey = 'name',
  xAxisLabel,
  yAxisLabel,
  layout = 'horizontal',
}: BarChartProps) {
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
        <p className="text-sm text-gray-300 mb-2 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-semibold">{entry.value.toLocaleString('es-CO')}</span>
          </div>
        ))}
      </div>
    );
  };

  const isVertical = layout === 'vertical';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        {isVertical ? (
          <>
            <XAxis
              type="number"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={
                xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined
              }
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              width={100}
              label={
                yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined
              }
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={
                xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined
              }
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={
                yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined
              }
            />
          </>
        )}
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
            }}
            iconType="rect"
          />
        )}
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color}
            stackId={stacked ? 'stack' : undefined}
            animationDuration={600}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
