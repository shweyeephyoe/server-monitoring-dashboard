# Server Monitoring Dashboard

> **DEMO — Simulated monitoring data. Not connected to real infrastructure.**
> Every server, metric and incident in this project is fictional and generated in the browser.

A front-end portfolio project showing how an IT operations team might view server health at a glance: summary counts, a filterable server list, usage charts, per-server details and recent incidents.

It was built to demonstrate skills relevant to an entry-level IT infrastructure role: understanding what operations teams monitor (CPU, memory, uptime, health status, incidents), presenting that information clearly, and writing tested, well-organised code.

## Features

- **Summary cards** — total, healthy, warning and critical server counts
- **Server table** — name, environment, status, CPU, memory, uptime and last-checked time
- **Status filters** — All / Healthy / Warning / Critical, with live counts
- **Search** — find servers by name (case-insensitive, partial match)
- **Server details panel** — opens when you select a server; shows system facts, a 24-hour CPU/memory chart and related incidents
- **Fleet usage chart** — average CPU and memory across all servers over 24 hours, with a warning threshold line
- **Recent incidents** — severity, description, timestamp, status and a link to the affected server
- **Responsive layout** — on phones, table rows become stacked cards
- **Accessibility** — status shown with text and a symbol (not colour alone), WCAG AA text contrast, keyboard-friendly dialog (focus management, Tab trapping, Escape to close), labelled form controls and meters

### How status is calculated

Status is derived from the numbers, so the badge and the usage values can never disagree:

| Status   | Rule                                   |
| -------- | -------------------------------------- |
| Healthy  | CPU **and** memory below 75%           |
| Warning  | CPU **or** memory between 75% and 89%  |
| Critical | CPU **or** memory at 90% or above      |

The thresholds live in one place: `src/utils/status.ts`.

## Technology stack

| Tool | Why it was chosen |
| ---- | ----------------- |
| [React 18](https://react.dev/) | Component-based UI library; the most common choice for dashboards |
| [TypeScript](https://www.typescriptlang.org/) | Catches mistakes (wrong field names, wrong types) before the code runs |
| [Vite](https://vite.dev/) | Fast development server and production build with minimal configuration |
| Plain CSS (custom properties) | No extra styling library needed; colours are defined once as variables |
| [Recharts](https://recharts.org/) | Charting library with a React-style API (`<LineChart>`, `<Line>`), which keeps chart code readable for beginners |
| [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) | Unit and component tests that interact with the UI the way a user would |

There are only three runtime dependencies: `react`, `react-dom` and `recharts`.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (includes `npm`). Check with `node -v`.

### Install and run

```bash
# 1. Go into the project folder
cd server-monitoring-dashboard

# 2. Install dependencies (only needed the first time, or after package.json changes)
npm install

# 3. Start the development server
npm run dev
```

Then open the address Vite prints (usually <http://localhost:5173>). The page reloads automatically when you edit a file.

### Available commands

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Start the local development server |
| `npm test` | Run all tests once |
| `npm run test:watch` | Re-run tests automatically when files change |
| `npm run typecheck` | Check TypeScript types without building |
| `npm run build` | Type-check, then create an optimised production build in `dist/` |
| `npm run preview` | Serve the production build locally to check it |

## Project structure

```
server-monitoring-dashboard/
├── index.html                 # HTML page that loads the app
├── public/favicon.svg
├── src/
│   ├── main.tsx               # Entry point: mounts <App /> into the page
│   ├── App.tsx                # Owns the state; arranges the page
│   ├── App.test.tsx           # Component tests (filters, search, details panel)
│   ├── types.ts               # TypeScript shapes for Server, Incident, etc.
│   ├── styles.css             # All styling, including the mobile layout
│   ├── components/
│   │   ├── DemoBanner.tsx     # "Simulated data" notice
│   │   ├── SummaryCards.tsx   # The four headline numbers
│   │   ├── FilterBar.tsx      # Status buttons + search box
│   │   ├── ServerTable.tsx    # Server list (table on desktop, cards on mobile)
│   │   ├── StatusBadge.tsx    # Healthy / Warning / Critical pill
│   │   ├── UsageBar.tsx       # Small CPU/memory bar
│   │   ├── UsageChart.tsx     # CPU & memory line chart (Recharts)
│   │   ├── IncidentList.tsx   # Recent incidents
│   │   └── ServerDetailsPanel.tsx  # Slide-in details dialog
│   ├── data/
│   │   ├── mockServers.ts     # Simulated servers + 24h history generator
│   │   ├── mockIncidents.ts   # Simulated incidents
│   │   └── random.ts          # Seeded random numbers (repeatable "random" data)
│   ├── utils/
│   │   ├── status.ts          # Thresholds, filtering, counting
│   │   ├── format.ts          # Uptime, percentages, relative times
│   │   └── *.test.ts          # Unit tests for the helpers
│   └── test/setup.ts          # Test environment setup
├── vite.config.ts             # Build + test configuration
└── tsconfig.json              # TypeScript settings
```

## How the data flows

1. **Mock data is created once.** When the app loads, `App.tsx` calls `createMockServers()` and `createMockIncidents()`. Times are calculated relative to "now", so the dashboard always looks recent.
2. **`App` holds the state.** It stores three things the user can change: the selected status filter, the search text, and which server (if any) is selected.
3. **Values are derived, not stored.** The visible server list and the summary counts are calculated from the state on each render (`filterServers`, `countByStatus`). This avoids two copies of the same information getting out of sync.
4. **Data flows down, events flow up.** `App` passes data to child components as *props*. Children such as `FilterBar` don't change anything themselves; they call functions App gave them (e.g. `onStatusFilterChange`), App updates its state, and React re-renders the affected parts.

```
mock data ──► App (state: filter, search, selected server)
                │
                ├─► SummaryCards        (counts)
                ├─► FilterBar           (current filter/search ──► calls back on change)
                ├─► ServerTable         (filtered servers ──► calls back on select)
                ├─► UsageChart          (fleet average history)
                ├─► IncidentList        (incidents ──► calls back on select)
                └─► ServerDetailsPanel  (selected server ──► calls back on close)
```

## Testing

```bash
npm test
```

The tests cover:

- **Status rules** — threshold boundaries (74 → healthy, 75 → warning, 90 → critical)
- **Filtering and search** — by status, by name (case-insensitive), and both together
- **Formatting** — uptime, percentages and relative times
- **User flows** — the demo notice is always visible, summary counts match the table, filter buttons and search narrow the table, an empty-search message appears, the details panel opens on click and closes with Escape

## Screenshots

Screenshots are not committed yet. To add them:

1. Run `npm run dev` and open the app in your browser.
2. Take a screenshot of the full dashboard on a desktop-width window.
3. Open your browser's developer tools, switch to a phone-sized device view (Chrome: **Toggle device toolbar**), and take a mobile screenshot.
4. Click a server and capture the details panel.
5. Save the images in a `docs/screenshots/` folder (e.g. `dashboard-desktop.png`, `dashboard-mobile.png`, `server-details.png`).
6. Add them to this README:

   ```markdown
   ![Dashboard on desktop](docs/screenshots/dashboard-desktop.png)
   ```

Make sure the yellow **DEMO** banner is visible in at least the main screenshot.

## Limitations

This is a front-end demonstration, not a monitoring tool.

- **No real monitoring.** No agents, no network checks, no connection to any server, cloud provider or monitoring API. All data is simulated in the browser.
- **No alerting.** Nothing sends emails, pages or notifications.
- **No live updates.** Data is generated once when the page loads; refresh the page for new timestamps (the values stay the same because the generator is seeded).
- **No backend, database, authentication or user accounts.**
- **No persistence.** Filters and search reset on reload.
- **Example IP addresses** use ranges reserved for documentation (RFC 5737) and do not belong to real machines.
- The chart library adds about 110 kB (gzipped) to the download; a hand-drawn SVG chart would be smaller but more code to maintain.

## Possible next steps

- Simulate live updates with `setInterval` to show metrics changing over time
- Add sorting to the table columns
- Add disk and network metrics
- Add a dark theme
- Connect to a real (self-hosted, test) metrics source such as a Prometheus endpoint

## License

Released under the MIT License for portfolio and learning purposes. Add a `LICENSE` file if you publish it.
