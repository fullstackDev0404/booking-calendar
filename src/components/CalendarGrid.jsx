import { buildCalendarCells, minDate, maxDate } from '../utils/dateUtils'
import CalendarHeader from './CalendarHeader'
import CalendarCell from './CalendarCell'

export default function CalendarGrid({
  year,
  month,
  occupancyMap = {},
  selection = null,
  onDayMouseDown,
  onDayMouseEnter,
  onDayMouseUp,
  onDayMouseMove,
  onDayMouseLeave,
}) {
  const cells = buildCalendarCells(year, month)

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
          onMouseMove={onDayMouseMove}
          onMouseLeave={onDayMouseLeave}
        />
      ))}
    </div>
  )
}
