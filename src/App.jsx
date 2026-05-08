// src/App.jsx
import { useState, useMemo } from 'react'
import { useBookings } from './hooks/useBookings'
import { buildOccupancyMap } from './utils/occupancyUtils'
import { getDaysInMonth } from './utils/dateUtils'
import CalendarGrid from './components/CalendarGrid'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function App() {
  const { bookings, loading, error } = useBookings()

  // Current viewed month — defaults to today
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  // Drag selection state: { start, end } both "YYYY-MM-DD", or null
  const [selection, setSelection] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Build occupancy map only when bookings or viewed month changes
  const occupancyMap = useMemo(() => {
    if (!bookings.length) return {}
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay   = getDaysInMonth(year, month)
    const endDate   = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    return buildOccupancyMap(bookings, startDate, endDate)
  }, [bookings, year, month])

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

  // --- Drag selection handlers ---
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
  if (loading) return <div className="app-status">Loading bookings...</div>
  if (error)   return <div className="app-status app-status--error">Error: {error}</div>

  return (
    <div className="app">
      {/* Calendar header: navigation controls */}
      <div className="calendar-nav">
        <button onClick={goToPrevMonth}>←</button>
        <h2 className="calendar-title">{MONTH_NAMES[month]} {year}</h2>
        <button onClick={goToNextMonth}>→</button>
        <button onClick={goToToday} className="today-btn">Today</button>
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

      {/* Selection info — placeholder for the detail panel (Step 6) */}
      {selection && (
        <div className="selection-info">
          Selected: {selection.start} → {selection.end}
        </div>
      )}
    </div>
  )
}
