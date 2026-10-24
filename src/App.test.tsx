import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

// A fixed time keeps results the same every time the tests run.
const NOW = new Date('2026-01-01T12:00:00Z');

function renderApp() {
  render(<App now={NOW} />);
  return userEvent.setup();
}

/** All server rows in the table (skipping the header row). */
function getServerRows() {
  const table = screen.getByRole('table');
  return within(table).getAllByRole('row').slice(1);
}

describe('App', () => {
  it('always shows the demo disclaimer', () => {
    renderApp();
    expect(
      screen.getByText(/Simulated monitoring data\. Not connected to real infrastructure\./),
    ).toBeInTheDocument();
  });

  it('shows summary counts that match the table', () => {
    renderApp();
    const total = Number(screen.getByTestId('summary-total').textContent);
    expect(getServerRows()).toHaveLength(total);
  });

  it('filters the table by status', async () => {
    const user = renderApp();
    const criticalCount = Number(screen.getByTestId('summary-critical').textContent);

    await user.click(screen.getByRole('button', { name: /^Critical/ }));

    const rows = getServerRows();
    expect(rows).toHaveLength(criticalCount);
    rows.forEach((row) => expect(within(row).getByText('Critical')).toBeInTheDocument());
  });

  it('searches servers by name', async () => {
    const user = renderApp();
    await user.type(screen.getByRole('searchbox', { name: /search servers/i }), 'stg-');

    const names = getServerRows().map((row) => within(row).getByRole('button').textContent);
    expect(names).toEqual(['stg-web-01', 'stg-api-01', 'stg-db-01']);
  });

  it('shows a message when nothing matches', async () => {
    const user = renderApp();
    await user.type(screen.getByRole('searchbox'), 'does-not-exist');
    expect(screen.getByText(/No servers match/)).toBeInTheDocument();
  });

  it('opens and closes the server details panel', async () => {
    const user = renderApp();
    const table = screen.getByRole('table');

    await user.click(within(table).getByRole('button', { name: 'prod-db-01' }));

    const dialog = screen.getByRole('dialog', { name: 'prod-db-01' });
    expect(within(dialog).getByText('Database (primary)')).toBeInTheDocument();
    expect(within(dialog).getByText(/memory usage above 90%/i)).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('lists recent incidents', () => {
    renderApp();
    const incidents = screen.getByRole('region', { name: 'Recent incidents' });
    expect(within(incidents).getByText('INC-1042')).toBeInTheDocument();
  });
});
