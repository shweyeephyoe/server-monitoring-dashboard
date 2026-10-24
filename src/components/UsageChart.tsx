import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MetricPoint } from '../types';
import { THRESHOLDS } from '../utils/status';

interface UsageChartProps {
  data: MetricPoint[];
  /** Short description for screen readers, e.g. "Fleet average over 24 hours". */
  description: string;
  height?: number;
}

// Chart colours: a blue/orange pair stays distinguishable for the most common
// kinds of colour blindness. The legend names each line, so colour is never
// the only clue.
const CPU_COLOR = '#2a78d6';
const MEMORY_COLOR = '#eb6834';
const AXIS_COLOR = '#5b6474';
const GRID_COLOR = '#e3e7ee';

/**
 * A line chart of CPU and memory over time, built with Recharts.
 * Both values are percentages, so they safely share one 0-100% axis.
 */
export function UsageChart({ data, description, height = 260 }: UsageChartProps) {
  return (
    <figure className="usage-chart" aria-label={description}>
      {/* ResponsiveContainer makes the chart fill the width of its parent. */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
          <CartesianGrid stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="time" tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickLine={false} axisLine={{ stroke: GRID_COLOR }} interval="preserveStartEnd" minTickGap={24} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} unit="%" tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickLine={false} axisLine={false} />
          {/* Dashed line marking where "warning" starts. */}
          <ReferenceLine y={THRESHOLDS.warning} stroke="#b45309" strokeDasharray="4 4" label={{ value: 'Warning', position: 'insideTopRight', fill: '#92400e', fontSize: 11 }} />
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, name]}
            contentStyle={{ borderRadius: 8, borderColor: GRID_COLOR, fontSize: 13 }}
          />
          <Legend iconType="plainline" wrapperStyle={{ fontSize: 13 }} />
          <Line type="monotone" dataKey="cpu" name="CPU" stroke={CPU_COLOR} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
          <Line type="monotone" dataKey="memory" name="Memory" stroke={MEMORY_COLOR} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
}
