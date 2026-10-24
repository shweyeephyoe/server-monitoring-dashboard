import type { Server, ServerStatus, StatusFilter } from '../types';

/**
 * Usage thresholds, in percent. Keeping them in one named object (instead of
 * typing 75 or 90 in several places) makes them easy to find and change.
 */
export const THRESHOLDS = {
  warning: 75,
  critical: 90,
} as const;

/**
 * Work out a server's status from its CPU and memory usage.
 * The worst of the two readings wins: if either is critical, the server is critical.
 *
 * Deriving status from the numbers (rather than typing it by hand in the mock
 * data) guarantees the badge and the usage numbers can never disagree.
 */
export function getServerStatus(cpuUsage: number, memoryUsage: number): ServerStatus {
  const highest = Math.max(cpuUsage, memoryUsage);
  if (highest >= THRESHOLDS.critical) return 'critical';
  if (highest >= THRESHOLDS.warning) return 'warning';
  return 'healthy';
}

/** Same idea for a single metric - used to colour usage bars. */
export function getUsageLevel(value: number): ServerStatus {
  return getServerStatus(value, 0);
}

export interface StatusCounts {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
}

export function countByStatus(servers: Server[]): StatusCounts {
  const counts: StatusCounts = { total: servers.length, healthy: 0, warning: 0, critical: 0 };
  for (const server of servers) {
    counts[server.status] += 1;
  }
  return counts;
}

/**
 * Apply the status filter and the search box together.
 * Search is case-insensitive and matches any part of the server name.
 */
export function filterServers(servers: Server[], status: StatusFilter, searchText: string): Server[] {
  const query = searchText.trim().toLowerCase();
  return servers.filter((server) => {
    const matchesStatus = status === 'all' || server.status === status;
    const matchesSearch = query === '' || server.name.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });
}

/** Human-readable labels, so the UI never shows raw values like "critical". */
export const STATUS_LABELS: Record<ServerStatus, string> = {
  healthy: 'Healthy',
  warning: 'Warning',
  critical: 'Critical',
};
