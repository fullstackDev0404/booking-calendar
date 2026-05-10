import { useMemo } from 'react'
import { useBookings } from './hooks/useBookings'
import { useCalendar } from './hooks/useCalendar'
import { useFilters } from './hooks/useFilters'
import { buildOccupancyMap } from './utils/occupancyUtils'
import { computeMonthStats } from './utils/statsUtils'
import { buildCalendarCells, minDate, maxDate, bookingOverlapsRange, bookingOccupiesDate, formatDate } from './utils/dateUtils'
import { MONTH_NAMES, OCCUPANCY_LEGEND } from './constants'
import CalendarGrid from './components/CalendarGrid'
import BookingPanel from './components/BookingPanel'
import StatsStrip from './components/StatsStrip'
import DayTooltip from './components/DayTooltip'
import FilterBar from './components/FilterBar'

export default function App() {
  const { bookings, loading, error } = useBookings()

  const today    = new Date()
  const todayStr = formatDate(today)

  const {
    year, month, selection, isDragging, tooltip,
    goToPrevMonth, goToNextMonth, goToToday,
    handleDayMouseDown, handleDayMouseEnter, handleDayMouseUp,
    handleDayMouseMove, handleDayMouseLeave,
  } = useCalendar()

  const { filters, setFilter, resetFilters, isFiltered } = useFilters()

  // filter options come from the actual data so new room types appear automatically
  const filterOptions = useMemo(() => ({
    roomTypes: [...new Set(bookings.map(b => b.roomType))].sort(),
    statuses:  [...new Set(bookings.map(b => b.status))].sort(),
    sources:   [...new Set(bookings.map(b => b.source))].sort(),
  }), [bookings])

  // single filtered source — occupancy map, stats, panel and tooltip all derive from this
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (filters.roomType !== 'all' && b.roomType !== filters.roomType) return false
      if (filters.status   !== 'all' && b.status   !== filters.status)   return false
      if (filters.source   !== 'all' && b.source   !== filters.source)   return false
      return true
    })
  }, [bookings, filters])

  // cover the full grid range so outside-month padding cells get real colors too
  const occupancyMap = useMemo(() => {
    if (!filteredBookings.length) return {}
    const cells = buildCalendarCells(year, month)
    const gridStart = cells[0].dateStr
    const gridEnd   = cells[cells.length - 1].dateStr
    return buildOccupancyMap(filteredBookings, gridStart, gridEnd)
  }, [filteredBookings, year, month])

  const monthStats = useMemo(() => {
    if (!filteredBookings.length) return null
    return computeMonthStats(filteredBookings, year, month)
  }, [filteredBookings, year, month])

  const selectedBookings = useMemo(() => {
    if (!selection) return []
    const start = minDate(selection.start, selection.end)
    const end   = maxDate(selection.start, selection.end)
    return filteredBookings.filter(b => bookingOverlapsRange(b, start, end))
  }, [filteredBookings, selection])

  const hoveredDateStr  = tooltip?.dateStr ?? null
  const tooltipBookings = useMemo(() => {
    if (!hoveredDateStr) return []
    return filteredBookings.filter(b => bookingOccupiesDate(b, hoveredDateStr))
  }, [filteredBookings, hoveredDateStr])

  if (loading) {
    return (
      <>
        <TopBar />
        <div className="app-status">
          <div className="app-status-spinner" />
          Loading bookings…
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <TopBar />
        <div className="app-status app-status--error">
          Failed to load data: {error}
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar />
      <div className="app">
        <div className="calendar-section">

          <StatsStrip stats={monthStats} />

          <FilterBar
            filters={filters}
            setFilter={setFilter}
            resetFilters={resetFilters}
            isFiltered={isFiltered}
            options={filterOptions}
            filteredBookings={filteredBookings}
          />

          <div className="calendar-nav">
            <button className="calendar-nav-arrow" onClick={goToPrevMonth}>←</button>
            <h2 className="calendar-title">{MONTH_NAMES[month]} {year}</h2>
            <button className="calendar-nav-arrow" onClick={goToNextMonth}>→</button>
            <button className="calendar-nav-today" onClick={goToToday}>Today</button>
          </div>

          <CalendarGrid
            year={year}
            month={month}
            todayStr={todayStr}
            occupancyMap={occupancyMap}
            selection={selection}
            onDayMouseDown={handleDayMouseDown}
            onDayMouseEnter={handleDayMouseEnter}
            onDayMouseUp={handleDayMouseUp}
            onDayMouseMove={handleDayMouseMove}
            onDayMouseLeave={handleDayMouseLeave}
          />

          <div className="calendar-legend">
            <span className="legend-label">Occupancy:</span>
            {OCCUPANCY_LEGEND.map(({ color, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="legend-swatch" style={{ background: color }} />
                <span>{label}</span>
              </span>
            ))}
            <span style={{ marginLeft: 4 }}>rooms</span>
          </div>

          <BookingPanel bookings={selectedBookings} selection={selection} />

        </div>
      </div>

      {tooltip && !isDragging && (
        <DayTooltip
          dateStr={tooltip.dateStr}
          occupancy={occupancyMap[tooltip.dateStr] ?? 0}
          bookings={tooltipBookings}
          x={tooltip.x}
          y={tooltip.y}
        />
      )}
    </>
  )
}

function TopBar() {
  return (
    <div className="app-topbar">
      <div className="app-topbar-brand">
        <div className="app-topbar-brand-dot" />
        Guestara
      </div>
      <span className="app-topbar-sub">Occupancy Calendar</span>
    </div>
  )
}
