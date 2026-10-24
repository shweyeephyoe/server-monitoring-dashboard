import type { ServerStatus } from '../types';
import { STATUS_LABELS } from '../utils/status';

// Each status has a different symbol as well as a different colour, so people
// with colour-vision deficiency can still tell them apart (WCAG 1.4.1).
const STATUS_ICONS: Record<ServerStatus, string> = {
  healthy: '●',
  warning: '▲',
  critical: '■',
};

interface StatusBadgeProps {
  status: ServerStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {/* aria-hidden: screen readers read the word, not the symbol. */}
      <span aria-hidden="true">{STATUS_ICONS[status]}</span>
      {STATUS_LABELS[status]}
    </span>
  );
}
