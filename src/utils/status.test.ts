import { describe, expect, it } from 'vitest';
import { createMockServers } from '../data/mockServers';
import { countByStatus, filterServers, getServerStatus } from './status';

describe('getServerStatus', () => {
  it('is healthy when both values are below the warning threshold', () => {
    expect(getServerStatus(40, 74)).toBe('healthy');
  });

  it('is warning from 75% up to 89%', () => {
    expect(getServerStatus(75, 10)).toBe('warning');
    expect(getServerStatus(10, 89)).toBe('warning');
  });

  it('is critical at 90% or more on either metric', () => {
    expect(getServerStatus(90, 10)).toBe('critical');
    expect(getServerStatus(10, 99)).toBe('critical');
  });
});

describe('filterServers', () => {
  const servers = createMockServers(new Date('2026-01-01T12:00:00Z'));

  it('returns every server for "all" with an empty search', () => {
    expect(filterServers(servers, 'all', '')).toHaveLength(servers.length);
  });

  it('returns only servers with the chosen status', () => {
    const critical = filterServers(servers, 'critical', '');
    expect(critical.length).toBeGreaterThan(0);
    expect(critical.every((server) => server.status === 'critical')).toBe(true);
  });

  it('searches by name, ignoring case and extra spaces', () => {
    const results = filterServers(servers, 'all', '  PROD-DB ');
    expect(results.map((server) => server.name)).toEqual(['prod-db-01', 'prod-db-02']);
  });

  it('combines status and search', () => {
    const results = filterServers(servers, 'healthy', 'prod-db');
    expect(results).toHaveLength(0); // both prod-db servers are above 75%
  });
});

describe('countByStatus', () => {
  it('adds up to the total number of servers', () => {
    const servers = createMockServers();
    const counts = countByStatus(servers);
    expect(counts.healthy + counts.warning + counts.critical).toBe(counts.total);
  });
});
