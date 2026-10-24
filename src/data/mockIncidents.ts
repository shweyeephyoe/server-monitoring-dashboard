/*
 * SIMULATED DATA - these incidents never happened. They exist to show how an
 * operations team might see recent events alongside server health.
 */
import type { Incident } from '../types';

interface IncidentSeed extends Omit<Incident, 'timestamp'> {
  minutesAgo: number;
}

const INCIDENT_SEEDS: IncidentSeed[] = [
  { id: 'INC-1042', serverId: 'srv-08', severity: 'Critical', status: 'Investigating', minutesAgo: 12, description: 'Sustained CPU above 95% during nightly batch run; jobs are queuing.' },
  { id: 'INC-1041', serverId: 'srv-04', severity: 'High', status: 'Open', minutesAgo: 38, description: 'Database memory usage above 90%; query latency increasing.' },
  { id: 'INC-1040', serverId: 'srv-02', severity: 'Medium', status: 'Investigating', minutesAgo: 95, description: 'Uneven load balancing: prod-web-02 receiving more traffic than prod-web-01.' },
  { id: 'INC-1039', serverId: 'srv-06', severity: 'Low', status: 'Open', minutesAgo: 240, description: 'Cache memory trending upward; eviction policy review suggested.' },
  { id: 'INC-1038', serverId: 'srv-12', severity: 'Low', status: 'Resolved', minutesAgo: 420, description: 'Build agent restarted after scheduled OS patching.' },
  { id: 'INC-1037', serverId: 'srv-03', severity: 'High', status: 'Resolved', minutesAgo: 1_380, description: 'API health check timeouts for 6 minutes; recovered after service restart.' },
];

export function createMockIncidents(now: Date = new Date()): Incident[] {
  return INCIDENT_SEEDS.map(({ minutesAgo, ...incident }) => ({
    ...incident,
    timestamp: new Date(now.getTime() - minutesAgo * 60_000),
  }));
}
