import type { Incident, Server } from '../types';
import { formatDateTime, formatRelativeTime } from '../utils/format';

interface IncidentListProps {
  incidents: Incident[];
  servers: Server[];
  now: Date;
  onSelectServer?: (serverId: string) => void;
  /** Hide the server name, e.g. inside a single server's details panel. */
  hideServer?: boolean;
}

/** A list of recent (simulated) incidents, newest first. */
export function IncidentList({ incidents, servers, now, onSelectServer, hideServer = false }: IncidentListProps) {
  if (incidents.length === 0) {
    return <p className="empty-state">No recent incidents.</p>;
  }

  // Newest first. We copy with [...] before sorting because .sort() changes
  // the original array, and React state/props should never be modified directly.
  const sorted = [...incidents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <ul className="incident-list">
      {sorted.map((incident) => {
        const server = servers.find((s) => s.id === incident.serverId);
        return (
          <li key={incident.id} className="incident">
            <div className="incident__meta">
              <span className={`severity severity--${incident.severity.toLowerCase()}`}>{incident.severity}</span>
              <span className={`incident-status incident-status--${incident.status.toLowerCase()}`}>{incident.status}</span>
              <span className="incident__id">{incident.id}</span>
            </div>
            <p className="incident__description">{incident.description}</p>
            <div className="incident__footer">
              {!hideServer && server && (
                onSelectServer ? (
                  <button type="button" className="link-button" onClick={() => onSelectServer(server.id)}>
                    {server.name}
                  </button>
                ) : (
                  <span>{server.name}</span>
                )
              )}
              <time dateTime={incident.timestamp.toISOString()} title={formatDateTime(incident.timestamp)}>
                {formatRelativeTime(incident.timestamp, now)}
              </time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
