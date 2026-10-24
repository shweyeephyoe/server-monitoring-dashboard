/*
 * SIMULATED DATA - NOT REAL INFRASTRUCTURE.
 *
 * Every server below is made up for demonstration purposes. IP addresses come
 * from the ranges reserved for documentation (RFC 5737: 192.0.2.x,
 * 198.51.100.x, 203.0.113.x), which are never assigned to real machines.
 */
import type { Environment, MetricPoint, Server } from '../types';
import { getServerStatus } from '../utils/status';
import { createRandom } from './random';

/** The minimal facts we type by hand for each server. Everything else is generated. */
interface ServerSeed {
  id: string;
  name: string;
  environment: Environment;
  role: string;
  operatingSystem: string;
  region: string;
  ipAddress: string;
  cpuUsage: number;
  memoryUsage: number;
  uptimeDays: number;
  lastCheckedMinutesAgo: number;
}

const SERVER_SEEDS: ServerSeed[] = [
  { id: 'srv-01', name: 'prod-web-01', environment: 'Production', role: 'Web server', operatingSystem: 'Ubuntu 22.04 LTS', region: 'Demo Region A', ipAddress: '192.0.2.11', cpuUsage: 42, memoryUsage: 58, uptimeDays: 48.3, lastCheckedMinutesAgo: 1 },
  { id: 'srv-02', name: 'prod-web-02', environment: 'Production', role: 'Web server', operatingSystem: 'Ubuntu 22.04 LTS', region: 'Demo Region A', ipAddress: '192.0.2.12', cpuUsage: 78, memoryUsage: 64, uptimeDays: 48.3, lastCheckedMinutesAgo: 1 },
  { id: 'srv-03', name: 'prod-api-01', environment: 'Production', role: 'API service', operatingSystem: 'Ubuntu 22.04 LTS', region: 'Demo Region A', ipAddress: '192.0.2.21', cpuUsage: 55, memoryUsage: 61, uptimeDays: 21.7, lastCheckedMinutesAgo: 2 },
  { id: 'srv-04', name: 'prod-db-01', environment: 'Production', role: 'Database (primary)', operatingSystem: 'Rocky Linux 9', region: 'Demo Region A', ipAddress: '192.0.2.31', cpuUsage: 67, memoryUsage: 94, uptimeDays: 112.4, lastCheckedMinutesAgo: 1 },
  { id: 'srv-05', name: 'prod-db-02', environment: 'Production', role: 'Database (replica)', operatingSystem: 'Rocky Linux 9', region: 'Demo Region B', ipAddress: '198.51.100.31', cpuUsage: 38, memoryUsage: 77, uptimeDays: 112.4, lastCheckedMinutesAgo: 3 },
  { id: 'srv-06', name: 'prod-cache-01', environment: 'Production', role: 'In-memory cache', operatingSystem: 'Debian 12', region: 'Demo Region A', ipAddress: '192.0.2.41', cpuUsage: 22, memoryUsage: 81, uptimeDays: 9.2, lastCheckedMinutesAgo: 2 },
  { id: 'srv-07', name: 'prod-queue-01', environment: 'Production', role: 'Message queue', operatingSystem: 'Debian 12', region: 'Demo Region B', ipAddress: '198.51.100.51', cpuUsage: 31, memoryUsage: 44, uptimeDays: 64.9, lastCheckedMinutesAgo: 4 },
  { id: 'srv-08', name: 'prod-batch-01', environment: 'Production', role: 'Scheduled batch jobs', operatingSystem: 'Windows Server 2022', region: 'Demo Region B', ipAddress: '198.51.100.61', cpuUsage: 96, memoryUsage: 73, uptimeDays: 3.1, lastCheckedMinutesAgo: 1 },
  { id: 'srv-09', name: 'stg-web-01', environment: 'Staging', role: 'Web server', operatingSystem: 'Ubuntu 22.04 LTS', region: 'Demo Region A', ipAddress: '203.0.113.11', cpuUsage: 18, memoryUsage: 36, uptimeDays: 6.5, lastCheckedMinutesAgo: 5 },
  { id: 'srv-10', name: 'stg-api-01', environment: 'Staging', role: 'API service', operatingSystem: 'Ubuntu 22.04 LTS', region: 'Demo Region A', ipAddress: '203.0.113.21', cpuUsage: 27, memoryUsage: 49, uptimeDays: 6.5, lastCheckedMinutesAgo: 5 },
  { id: 'srv-11', name: 'stg-db-01', environment: 'Staging', role: 'Database', operatingSystem: 'Rocky Linux 9', region: 'Demo Region A', ipAddress: '203.0.113.31', cpuUsage: 34, memoryUsage: 57, uptimeDays: 30.2, lastCheckedMinutesAgo: 6 },
  { id: 'srv-12', name: 'dev-build-01', environment: 'Development', role: 'CI build agent', operatingSystem: 'Ubuntu 24.04 LTS', region: 'Demo Region B', ipAddress: '203.0.113.71', cpuUsage: 63, memoryUsage: 52, uptimeDays: 0.4, lastCheckedMinutesAgo: 8 },
];

const HOURS_OF_HISTORY = 24;

/**
 * Build 24 hourly readings that wander up and down and finish exactly at the
 * server's current value, so the chart and the table always agree.
 */
function buildHistory(seed: ServerSeed, seedNumber: number, now: Date): MetricPoint[] {
  const random = createRandom(seedNumber);
  const clamp = (value: number) => Math.min(100, Math.max(1, value));
  const points: MetricPoint[] = [];

  for (let hoursAgo = HOURS_OF_HISTORY - 1; hoursAgo >= 0; hoursAgo--) {
    // How far back we are, from 1 (oldest) to 0 (now). Older points drift
    // further from the current value; the newest point equals it exactly.
    const distance = hoursAgo / (HOURS_OF_HISTORY - 1);
    const wobble = () => (random() - 0.5) * 30 * distance;

    const time = new Date(now.getTime() - hoursAgo * 3_600_000);
    points.push({
      time: `${String(time.getHours()).padStart(2, '0')}:00`,
      cpu: Math.round(clamp(seed.cpuUsage - 10 * distance + wobble())),
      memory: Math.round(clamp(seed.memoryUsage - 6 * distance + wobble())),
    });
  }
  return points;
}

/**
 * Turn the hand-written seeds into full Server objects.
 * `now` is a parameter (instead of always using the real clock) so tests can
 * pass in a fixed time and get predictable results.
 */
export function createMockServers(now: Date = new Date()): Server[] {
  return SERVER_SEEDS.map((seed, index) => ({
    id: seed.id,
    name: seed.name,
    environment: seed.environment,
    role: seed.role,
    operatingSystem: seed.operatingSystem,
    region: seed.region,
    ipAddress: seed.ipAddress,
    cpuUsage: seed.cpuUsage,
    memoryUsage: seed.memoryUsage,
    status: getServerStatus(seed.cpuUsage, seed.memoryUsage),
    uptimeSeconds: Math.round(seed.uptimeDays * 86_400),
    lastChecked: new Date(now.getTime() - seed.lastCheckedMinutesAgo * 60_000),
    history: buildHistory(seed, index + 1, now),
  }));
}

/**
 * Average CPU and memory across all servers for each hour.
 * This powers the fleet-wide chart on the main dashboard.
 */
export function getFleetAverageHistory(servers: Server[]): MetricPoint[] {
  if (servers.length === 0) return [];
  return servers[0].history.map((point, hourIndex) => {
    const cpuTotal = servers.reduce((sum, server) => sum + server.history[hourIndex].cpu, 0);
    const memoryTotal = servers.reduce((sum, server) => sum + server.history[hourIndex].memory, 0);
    return {
      time: point.time,
      cpu: Math.round(cpuTotal / servers.length),
      memory: Math.round(memoryTotal / servers.length),
    };
  });
}
