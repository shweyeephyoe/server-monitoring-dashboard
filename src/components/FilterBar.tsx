import type { StatusFilter } from '../types';
import type { StatusCounts } from '../utils/status';

interface FilterBarProps {
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  counts: StatusCounts;
}

const FILTERS: { value: StatusFilter; label: string; countKey: keyof StatusCounts }[] = [
  { value: 'all', label: 'All', countKey: 'total' },
  { value: 'healthy', label: 'Healthy', countKey: 'healthy' },
  { value: 'warning', label: 'Warning', countKey: 'warning' },
  { value: 'critical', label: 'Critical', countKey: 'critical' },
];

/**
 * The status buttons and search box.
 *
 * This component does not store the filter itself - it receives the current
 * value from App and calls a function to change it. That pattern is called
 * "lifting state up": App owns the state, so the table and the filters can
 * share it.
 */
export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  searchText,
  onSearchTextChange,
  counts,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__statuses" role="group" aria-label="Filter servers by status">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className="filter-button"
            // aria-pressed tells screen readers which toggle button is active.
            aria-pressed={statusFilter === filter.value}
            onClick={() => onStatusFilterChange(filter.value)}
          >
            {filter.label}
            <span className="filter-button__count">{counts[filter.countKey]}</span>
          </button>
        ))}
      </div>

      <div className="filter-bar__search">
        <label htmlFor="server-search" className="visually-hidden">
          Search servers by name
        </label>
        <input
          id="server-search"
          type="search"
          placeholder="Search by server name…"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
