import { formatPercent } from '../utils/format';
import { getUsageLevel } from '../utils/status';

interface UsageBarProps {
  /** Percentage from 0 to 100. */
  value: number;
  /** What is being measured, e.g. "CPU" - used for screen readers. */
  label: string;
}

/** A small horizontal bar with the number next to it. */
export function UsageBar({ value, label }: UsageBarProps) {
  const level = getUsageLevel(value);
  return (
    <div className="usage-bar">
      {/* role="meter" tells assistive technology this is a measurement. */}
      <div
        className="usage-bar__track"
        role="meter"
        aria-label={`${label} usage`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
      >
        <div className={`usage-bar__fill usage-bar__fill--${level}`} style={{ width: `${value}%` }} />
      </div>
      <span className="usage-bar__value">{formatPercent(value)}</span>
    </div>
  );
}
