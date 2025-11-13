/**
 * PieChart Component
 *
 * Pie/Donut chart for distribution visualization
 * Features:
 * - Donut mode
 * - Percentage display
 * - Interactive tooltip
 * - Legend
 * - Smooth animations
 * - Responsive
 */

'use client';

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface PieChartProps {
  data: PieChartDataPoint[];
  height?: number;
  donut?: boolean;
  showLegend?: boolean;
  showPercentage?: boolean;
}

export function PieChart({
  data,
  height = 300,
  donut = false,
  showLegend = true,
  showPercentage = true,
}: PieChartProps) {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: PieChartDataPoint }>;
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0];
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <div className="bg-[#1E2533] border border-white/10 rounded-lg p-3 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.payload.color }} />
          <span className="text-sm font-medium text-white">{data.name}</span>
        </div>
        <div className="text-sm text-gray-400">
          Valor:{' '}
          <span className="text-white font-semibold">{data.value.toLocaleString('es-CO')}</span>
        </div>
        {showPercentage && (
          <div className="text-sm text-gray-400">
            Porcentaje: <span className="text-white font-semibold">{percentage}%</span>
          </div>
        )}
      </div>
    );
  };

  // Custom label for percentage display
  const renderLabel = (entry: { value: number }) => {
    if (!showPercentage) return '';
    const percentage = ((entry.value / total) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={donut ? 90 : 100}
          innerRadius={donut ? 60 : 0}
          fill="#8884d8"
          dataKey="value"
          animationDuration={600}
          animationBegin={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontSize: '12px',
            }}
            iconType="circle"
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
