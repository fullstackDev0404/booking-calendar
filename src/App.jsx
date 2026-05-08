// src/App.jsx
import { useState, useMemo } from 'react'
import { useBookings } from './hooks/useBookings'
import { buildOccupancyMap } from './utils/occupancyUtils'
import { getDaysInMonth, minDate, maxDate, bookingOverlapsRange } from './utils/dateUtils'
import CalendarGrid from './components/CalendarGrid'
import BookingPanel from './components/BookingPanel'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const LEGEND = [
  { color: '#f8fafc', label: '0' },
  { color: '#fef9c3', label: '1–3' },
  { color: '#fde68a', label: '4–5' },
  { color: '#fb923c', label: '6–7' },
  { color: '#ef4444', label: '8–9' },
  { color: '#991b1b', label: '10' },
]

export default function App() {
  const { bookings, loading, error } = useBookings()

  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const [selection, setSelection]   = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Occupancy map — recomputes only when bookings or month changes
  const occupancyMap = useMemo(() => {
    if (!bookings.length) return {}
    const m       = String(month + 1).padStart(2, '0')
    const lastDay = String(getDaysInMonth(year, month)).padStart(2, '0')
    return buildOccupancyMap(bookings, `${year}-${m}-01`, `${year}-${m}-${lastDay}`)
  }, [bookings, year, month])

  // Filtered bookings for the selected range — recomputes only when selection or bookings change
  const selectedBookings = useMemo(() => {
    if (!selection) return []
    const start = minDate(selection.start, selection.end)
    const end   = maxDate(selection.start, selection.end)
    return bookings.filter(b => bookingOverlapsRange(b, start, end))
  }, [bookings, selection])

  // --- Month navigation ---
  function goToPrevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function goToNextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function goToToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  // --- Drag selection ---
  function handleDayMouseDown(dateStr) {
    setIsDragging(true)
    setSelection({ start: dateStr, end: dateStr })
  }

  function handleDayMouseEnter(dateStr) {
    if (!isDragging) return
    setSelection(prev => ({ ...prev, end: dateStr }))
  }

  function handleDayMouseUp(dateStr) {
    setIsDragging(false)
    setSelection(prev => ({ ...prev, end: dateStr }))
  }

  // --- Render states ---
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

          {/* Navigation */}
          <div className="calendar-nav">
            <button className="calendar-nav-arrow" onClick={goToPrevMonth}>←</button>
            <h2 className="calendar-title">{MONTH_NAMES[month]} {year}</h2>
            <button className="calendar-nav-arrow" onClick={goToNextMonth}>→</button>
            <button className="calendar-nav-today" onClick={goToToday}>Today</button>
          </div>

          {/* Calendar grid */}
          <CalendarGrid
            year={year}
            month={month}
            occupancyMap={occupancyMap}
            selection={selection}
            onDayMouseDown={handleDayMouseDown}
            onDayMouseEnter={handleDayMouseEnter}
            onDayMouseUp={handleDayMouseUp}
          />

          {/* Heatmap legend */}
          <div className="calendar-legend">
            <span className="legend-label">Occupancy:</span>
            {LEGEND.map(({ color, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="legend-swatch" style={{ background: color }} />
                <span>{label}</span>
              </span>
            ))}
            <span style={{ marginLeft: 4 }}>rooms</span>
          </div>

          {/* Booking detail panel */}
          <BookingPanel
            bookings={selectedBookings}
            selection={selection}
          />

        </div>
      </div>
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
