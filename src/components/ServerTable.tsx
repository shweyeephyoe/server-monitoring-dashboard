import type { Server } from '../types';
import { formatDateTime, formatRelativeTime, formatUptime } from '../utils/format';
import { StatusBadge } from './StatusBadge';
import { UsageBar } from './UsageBar';

interface ServerTableProps {
  servers: Server[];
  onSelectServer: (serverId: string) => void;
  now: Date;
}

/**
 * The main list of servers. On small screens the CSS turns each row into a
 * card; the `data-label` attributes supply the column name for each value.
 */
export function ServerTable({ servers, onSelectServer, now }: ServerTableProps) {
  if (servers.length === 0) {
    return (
      <p className="empty-state" role="status">
        No servers match the current filter and search.
      </p>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="server-table">
        <caption className="visually-hidden">
          Simulated servers. Select a server name to see details.
        </caption>
        <thead>
          <tr>
            <th scope="col">Server</th>
            <th scope="col">Environment</th>
            <th scope="col">Status</th>
            <th scope="col">CPU</th>
            <th scope="col">Memory</th>
            <th scope="col">Uptime</th>
            <th scope="col">Last checked</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            // Clicking anywhere on the row opens details for mouse users.
            // Keyboard and screen-reader users use the button in the first cell.
            <tr key={server.id} onClick={() => onSelectServer(server.id)} className="server-row">
              <th scope="row" data-label="Server">
                <button
                  type="button"
                  className="server-name-button"
                  onClick={(event) => {
                    event.stopPropagation(); // avoid triggering the row click twice
                    onSelectServer(server.id);
                  }}
                >
                  {server.name}
                </button>
              </th>
              <td data-label="Environment">
                <span className={`env-tag env-tag--${server.environment.toLowerCase()}`}>{server.environment}</span>
              </td>
              <td data-label="Status">
                <StatusBadge status={server.status} />
              </td>
              <td data-label="CPU">
                <UsageBar value={server.cpuUsage} label={`${server.name} CPU`} />
              </td>
              <td data-label="Memory">
                <UsageBar value={server.memoryUsage} label={`${server.name} memory`} />
              </td>
              <td data-label="Uptime">{formatUptime(server.uptimeSeconds)}</td>
              <td data-label="Last checked">
                <time dateTime={server.lastChecked.toISOString()} title={formatDateTime(server.lastChecked)}>
                  {formatRelativeTime(server.lastChecked, now)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
