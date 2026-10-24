import { describe, expect, it } from 'vitest';
import { formatPercent, formatRelativeTime, formatUptime } from './format';

describe('formatUptime', () => {
  it('shows days, hours and minutes for long uptimes', () => {
    expect(formatUptime(2 * 86_400 + 3 * 3_600 + 4 * 60)).toBe('2d 3h 4m');
  });

  it('drops days when under one day', () => {
    expect(formatUptime(5 * 3_600 + 30 * 60)).toBe('5h 30m');
  });

  it('shows only minutes when under one hour', () => {
    expect(formatUptime(125)).toBe('2m');
  });
});

describe('formatPercent', () => {
  it('rounds to a whole number', () => {
    expect(formatPercent(42.6)).toBe('43%');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-01-01T12:00:00Z');
  const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000);

  it('describes recent times in minutes and hours', () => {
    expect(formatRelativeTime(minutesAgo(0), now)).toBe('just now');
    expect(formatRelativeTime(minutesAgo(5), now)).toBe('5 min ago');
    expect(formatRelativeTime(minutesAgo(180), now)).toBe('3 h ago');
    expect(formatRelativeTime(minutesAgo(3 * 1_440), now)).toBe('3 d ago');
  });
});
