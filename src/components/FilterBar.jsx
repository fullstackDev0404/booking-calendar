import { FILTER_LABELS } from '../constants'

// purely presentational — all state lives in useFilters
export default function FilterBar({ filters, setFilter, resetFilters, isFiltered, options }) {
  return (
    <div className="filter-bar">
      <span className="filter-bar-label">Filter:</span>

      <FilterSelect
        label="Room Type"
        value={filters.roomType}
        options={options.roomTypes}
        onChange={v => setFilter('roomType', v)}
      />

      <FilterSelect
        label="Status"
        value={filters.status}
        options={options.statuses}
        onChange={v => setFilter('status', v)}
        formatLabel={v => FILTER_LABELS.status[v] ?? v}
      />

      <FilterSelect
        label="Source"
        value={filters.source}
        options={options.sources}
        onChange={v => setFilter('source', v)}
      />

      {isFiltered && (
        <button className="filter-clear" onClick={resetFilters}>
          Clear filters
        </button>
      )}
    </div>
  )
}

function FilterSelect({ label, value, options, onChange, formatLabel }) {
  return (
    <select
      className="filter-select"
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={label}
    >
      <option value="all">{label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {formatLabel ? formatLabel(opt) : opt}
        </option>
      ))}
    </select>
  )
}
