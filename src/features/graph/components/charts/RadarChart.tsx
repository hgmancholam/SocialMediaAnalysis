/**
 * RadarChart Component
 *
 * Radar chart for multi-dimensional data visualization
 * Features:
 * - Interactive tooltip
 * - Legend
 * - Smooth animations
 * - Responsive
 * - Themed colors
 */

'use client';

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarChartProps {
  data: Array<{
    subject: string;
    [key: string]: string | number;
  }>;
  dataKeys: {
    key: string;
    name: string;
    color: string;
  }[];
  height?: number;
  showLegend?: boolean;
  domain?: [number, number];
  showActualValues?: boolean;
}

export function RadarChart({
  data,
  dataKeys,
  height = 300,
  showLegend = true,
  domain = [0, 100],
  showActualValues = false,
}: RadarChartProps) {
  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-[#1E2533] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-sm text-gray-300 mb-2 font-medium">{label}</p>
        {payload.map((entry, index) => {
          const item = data.find((d) => d.subject === label);
          const displayValue = showActualValues && item?.usuarios ? item.usuarios : entry.value;
          const suffix = showActualValues && item?.usuarios ? '' : '%';
          const percentage = item?.porcentaje;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-400">{entry.name}:</span>
                <span className="text-white font-semibold">
                  {typeof displayValue === 'number' ? displayValue.toFixed(0) : displayValue}
                  {suffix}
                </span>
              </div>
              {percentage !== undefined && (
                <div className="text-xs text-gray-500 ml-5">
                  {typeof percentage === 'number' ? percentage.toFixed(2) : percentage}% del total
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#ffffff20" />
        <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
        <PolarRadiusAxis angle={90} domain={domain} stroke="#9CA3AF" tick={false} />
        <Tooltip content={<CustomTooltip />} />
        {dataKeys.map((dataKey) => (
          <Radar
            key={dataKey.key}
            name={dataKey.name}
            dataKey={dataKey.key}
            stroke={dataKey.color}
            fill={dataKey.color}
            fillOpacity={0.6}
            animationDuration={600}
          />
        ))}
        {showLegend && (
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
            }}
            iconType="circle"
          />
        )}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
