import { useMemo } from 'react'
import { useBookings } from './hooks/useBookings'
import { useCalendar } from './hooks/useCalendar'
import { buildOccupancyMap } from './utils/occupancyUtils'
import { computeMonthStats } from './utils/statsUtils'
import { getDaysInMonth, minDate, maxDate, bookingOverlapsRange, bookingOccupiesDate } from './utils/dateUtils'
import { MONTH_NAMES, OCCUPANCY_LEGEND } from './constants'
import CalendarGrid from './components/CalendarGrid'
import BookingPanel from './components/BookingPanel'
import StatsStrip from './components/StatsStrip'
import DayTooltip from './components/DayTooltip'

export default function App() {
  const { bookings, loading, error } = useBookings()

  const {
    year, month, selection, isDragging, tooltip,
    goToPrevMonth, goToNextMonth, goToToday,
    handleDayMouseDown, handleDayMouseEnter, handleDayMouseUp,
    handleDayMouseMove, handleDayMouseLeave,
  } = useCalendar()

  const occupancyMap = useMemo(() => {
    if (!bookings.length) return {}
    const m       = String(month + 1).padStart(2, '0')
    const lastDay = String(getDaysInMonth(year, month)).padStart(2, '0')
    return buildOccupancyMap(bookings, `${year}-${m}-01`, `${year}-${m}-${lastDay}`)
  }, [bookings, year, month])

  const monthStats = useMemo(() => {
    if (!bookings.length) return null
    return computeMonthStats(bookings, year, month)
  }, [bookings, year, month])

  const selectedBookings = useMemo(() => {
    if (!selection) return []
    const start = minDate(selection.start, selection.end)
    const end   = maxDate(selection.start, selection.end)
    return bookings.filter(b => bookingOverlapsRange(b, start, end))
  }, [bookings, selection])

  const hoveredDateStr  = tooltip?.dateStr ?? null
  const tooltipBookings = useMemo(() => {
    if (!hoveredDateStr) return []
    return bookings.filter(b => bookingOccupiesDate(b, hoveredDateStr))
  }, [bookings, hoveredDateStr])

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

          <div className="calendar-nav">
            <button className="calendar-nav-arrow" onClick={goToPrevMonth}>←</button>
            <h2 className="calendar-title">{MONTH_NAMES[month]} {year}</h2>
            <button className="calendar-nav-arrow" onClick={goToNextMonth}>→</button>
            <button className="calendar-nav-today" onClick={goToToday}>Today</button>
          </div>

          <CalendarGrid
            year={year}
            month={month}
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
