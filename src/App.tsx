import { useCallback, useMemo, useState } from 'react';
import { DemoBanner } from './components/DemoBanner';
import { FilterBar } from './components/FilterBar';
import { IncidentList } from './components/IncidentList';
import { ServerDetailsPanel } from './components/ServerDetailsPanel';
import { ServerTable } from './components/ServerTable';
import { SummaryCards } from './components/SummaryCards';
import { UsageChart } from './components/UsageChart';
import { createMockIncidents } from './data/mockIncidents';
import { createMockServers, getFleetAverageHistory } from './data/mockServers';
import type { Incident, Server, StatusFilter } from './types';
import { formatDateTime } from './utils/format';
import { countByStatus, filterServers } from './utils/status';

interface AppProps {
  /**
   * Optional data overrides. The real app uses the defaults; tests can pass
   * their own servers, incidents or a fixed "now" time.
   */
  initialServers?: Server[];
  initialIncidents?: Incident[];
  now?: Date;
}

export default function App({ initialServers, initialIncidents, now: nowProp }: AppProps) {
  // The mock data is created once, when the app first loads. useState with a
  // function means "run this only on the first render", not on every update.
  const [now] = useState(() => nowProp ?? new Date());
  const [servers] = useState(() => initialServers ?? createMockServers(now));
  const [incidents] = useState(() => initialIncidents ?? createMockIncidents(now));

  // The three pieces of state the user can change.
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  // "Derived" values are calculated from state instead of being stored as
  // state themselves. useMemo skips recalculating when the inputs are unchanged.
  const counts = useMemo(() => countByStatus(servers), [servers]);
  const visibleServers = useMemo(
    () => filterServers(servers, statusFilter, searchText),
    [servers, statusFilter, searchText],
  );
  const fleetHistory = useMemo(() => getFleetAverageHistory(servers), [servers]);
  const selectedServer = servers.find((server) => server.id === selectedServerId) ?? null;

  // useCallback keeps the same function between renders, so the details panel's
  // effect (which depends on onClose) doesn't re-run on every render.
  const closeDetails = useCallback(() => setSelectedServerId(null), []);

  return (
    <>
      <DemoBanner />
      <div className="app">
        <header className="app-header">
          <div>
            <h1>Server Monitoring Dashboard</h1>
            <p className="app-header__subtitle">IT operations overview · portfolio demo</p>
          </div>
          <p className="app-header__timestamp">
            Data snapshot: <time dateTime={now.toISOString()}>{formatDateTime(now)}</time>
          </p>
        </header>

        <main>
          <SummaryCards counts={counts} />

          <div className="dashboard-grid">
            <section className="panel panel--servers" aria-labelledby="servers-heading">
              <div className="panel__header">
                <h2 id="servers-heading">Servers</h2>
                <p className="panel__subtitle" aria-live="polite">
                  Showing {visibleServers.length} of {servers.length}
                </p>
              </div>
              <FilterBar
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                searchText={searchText}
                onSearchTextChange={setSearchText}
                counts={counts}
              />
              <ServerTable servers={visibleServers} onSelectServer={setSelectedServerId} now={now} />
            </section>

            <section className="panel panel--chart" aria-labelledby="chart-heading">
              <div className="panel__header">
                <h2 id="chart-heading">Fleet CPU &amp; memory</h2>
                <p className="panel__subtitle">Average across all servers · last 24 hours</p>
              </div>
              <UsageChart data={fleetHistory} description="Average CPU and memory usage across all simulated servers over the last 24 hours" />
            </section>

            <section className="panel panel--incidents" aria-labelledby="incidents-heading">
              <div className="panel__header">
                <h2 id="incidents-heading">Recent incidents</h2>
                <p className="panel__subtitle">{incidents.filter((i) => i.status !== 'Resolved').length} active</p>
              </div>
              <IncidentList incidents={incidents} servers={servers} now={now} onSelectServer={setSelectedServerId} />
            </section>
          </div>
        </main>

        <footer className="app-footer">
          Portfolio project · All servers, metrics and incidents are fictional · Built with React, TypeScript &amp; Vite
        </footer>
      </div>

      {/* Only render the panel when a server is selected. */}
      {selectedServer && (
        <ServerDetailsPanel
          server={selectedServer}
          incidents={incidents.filter((incident) => incident.serverId === selectedServer.id)}
          servers={servers}
          now={now}
          onClose={closeDetails}
        />
      )}
    </>
  );
}
