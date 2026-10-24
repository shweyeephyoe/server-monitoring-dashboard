// Shared TypeScript types. Defining the "shape" of our data in one place means
// TypeScript can warn us if a component uses a field that doesn't exist or
// passes the wrong kind of value (for example, a string where a number belongs).

/** The three health states a server can be in. */
export type ServerStatus = 'healthy' | 'warning' | 'critical';

/** The status filter also allows "all", which means "don't filter". */
export type StatusFilter = ServerStatus | 'all';

export type Environment = 'Production' | 'Staging' | 'Development';

/** One reading in a server's usage history (used by the chart). */
export interface MetricPoint {
  /** Short label for the x-axis, e.g. "14:00". */
  time: string;
  /** CPU usage as a percentage, 0-100. */
  cpu: number;
  /** Memory usage as a percentage, 0-100. */
  memory: number;
}

export interface Server {
  id: string;
  name: string;
  environment: Environment;
  role: string;
  operatingSystem: string;
  region: string;
  /** Uses reserved documentation IP ranges, so it can never point at a real host. */
  ipAddress: string;
  /** Derived from CPU and memory usage - see utils/status.ts. */
  status: ServerStatus;
  cpuUsage: number;
  memoryUsage: number;
  /** How long the server has been running, in seconds. */
  uptimeSeconds: number;
  /** When the (simulated) health check last ran. */
  lastChecked: Date;
  /** The last 24 hourly readings, oldest first. */
  history: MetricPoint[];
}

export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Open' | 'Investigating' | 'Resolved';

export interface Incident {
  id: string;
  /** Which server the incident relates to (matches Server.id). */
  serverId: string;
  severity: IncidentSeverity;
  description: string;
  timestamp: Date;
  status: IncidentStatus;
}
