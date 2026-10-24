// Small helpers that turn raw values into text people can read quickly.

/** 1_234_567 seconds -> "14d 6h 56m". Short servers show minutes only. */
export function formatUptime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** 42.37 -> "42%". Rounds so the table stays easy to scan. */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** A date -> "3 min ago" / "2 h ago" / "4 d ago", relative to `now`. */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const seconds = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} d ago`;
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** A date -> "Oct 24, 2026, 2:05 PM" in the viewer's own locale and time zone. */
export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}
