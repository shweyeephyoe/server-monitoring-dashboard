import { useEffect, useRef } from 'react';
import type { Incident, Server } from '../types';
import { formatDateTime, formatPercent, formatUptime } from '../utils/format';
import { IncidentList } from './IncidentList';
import { StatusBadge } from './StatusBadge';
import { UsageChart } from './UsageChart';

interface ServerDetailsPanelProps {
  server: Server;
  incidents: Incident[];
  servers: Server[];
  now: Date;
  onClose: () => void;
}

/**
 * A slide-in panel showing everything about one server.
 *
 * Accessibility behaviour (what users of keyboards and screen readers expect
 * from a dialog):
 *  - focus moves into the panel when it opens,
 *  - Tab cycles inside the panel instead of escaping to the page behind,
 *  - Escape closes it,
 *  - focus returns to whatever was focused before it opened.
 */
export function ServerDetailsPanel({ server, incidents, servers, now, onClose }: ServerDetailsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // useEffect runs after the panel appears on screen. The function it returns
  // runs when the panel disappears - a good place to clean up.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden'; // stop the page behind from scrolling

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const titleId = `details-title-${server.id}`;

  const facts: { label: string; value: string }[] = [
    { label: 'Environment', value: server.environment },
    { label: 'Role', value: server.role },
    { label: 'Operating system', value: server.operatingSystem },
    { label: 'Region', value: server.region },
    { label: 'IP address (example range)', value: server.ipAddress },
    { label: 'CPU usage', value: formatPercent(server.cpuUsage) },
    { label: 'Memory usage', value: formatPercent(server.memoryUsage) },
    { label: 'Uptime', value: formatUptime(server.uptimeSeconds) },
    { label: 'Last checked', value: formatDateTime(server.lastChecked) },
  ];

  return (
    // Clicking the dark backdrop closes the panel...
    <div className="details-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className="details-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        // ...but clicks inside the panel itself should not.
        onClick={(event) => event.stopPropagation()}
      >
        <header className="details-panel__header">
          <div>
            <p className="details-panel__eyebrow">Server details</p>
            <h2 id={titleId}>{server.name}</h2>
            <StatusBadge status={server.status} />
          </div>
          <button ref={closeButtonRef} type="button" className="icon-button" onClick={onClose} aria-label="Close server details">
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        <dl className="details-facts">
          {facts.map((fact) => (
            <div key={fact.label} className="details-facts__item">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <section className="details-section">
          <h3>CPU &amp; memory — last 24 hours</h3>
          <UsageChart data={server.history} description={`CPU and memory usage for ${server.name} over the last 24 hours (simulated)`} height={220} />
        </section>

        <section className="details-section">
          <h3>Related incidents</h3>
          <IncidentList incidents={incidents} servers={servers} now={now} hideServer />
        </section>

        <p className="details-panel__note">All values on this panel are simulated for demonstration.</p>
      </div>
    </div>
  );
}
