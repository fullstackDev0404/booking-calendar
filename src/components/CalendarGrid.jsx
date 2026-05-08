// src/components/CalendarGrid.jsx
import { buildCalendarCells, minDate, maxDate } from '../utils/dateUtils'
import CalendarHeader from './CalendarHeader'
import CalendarCell from './CalendarCell'

/**
 * Assembles the full calendar grid for a given year/month.
 * Owns the cell layout — delegates individual cell rendering to CalendarCell.
 *
 * Props:
 *   year             number
 *   month            number  (0-indexed: 0=Jan, 11=Dec)
 *   occupancyMap     { "YYYY-MM-DD": number }
 *   selection        { start: "YYYY-MM-DD", end: "YYYY-MM-DD" } | null
 *   onDayMouseDown   fn(dateStr)
 *   onDayMouseEnter  fn(dateStr)
 *   onDayMouseUp     fn(dateStr)
 */
export default function CalendarGrid({
  year,
  month,
  occupancyMap = {},
  selection = null,
  onDayMouseDown,
  onDayMouseEnter,
  onDayMouseUp,
}) {
  const cells = buildCalendarCells(year, month)

  // Normalize selection so start is always the earlier date.
  // This handles backward drags (user dragged right-to-left).
  const selStart = selection ? minDate(selection.start, selection.end) : null
  const selEnd   = selection ? maxDate(selection.start, selection.end) : null

  return (
    <div className="calendar-grid">
      <CalendarHeader />
      {cells.map(cell => (
        <CalendarCell
          key={cell.dateStr}
          cell={cell}
          occupancy={occupancyMap[cell.dateStr] ?? 0}
          isSelected={
            selStart !== null &&
            cell.dateStr >= selStart &&
            cell.dateStr <= selEnd
          }
          onMouseDown={onDayMouseDown}
          onMouseEnter={onDayMouseEnter}
          onMouseUp={onDayMouseUp}
        />
      ))}
    </div>
  )
}
