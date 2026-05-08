// src/components/CalendarCell.jsx
import { occupancyToColor } from '../utils/occupancyUtils'

// Cells with these colors are dark — badge needs light styling
const DARK_COLORS = new Set(['#fb923c', '#ef4444', '#991b1b'])

/**
 * A single day cell in the calendar grid.
 *
 * Props:
 *   cell          { dateStr, day, isCurrentMonth }
 *   occupancy     number — how many rooms occupied this night (0–10)
 *   isSelected    boolean — is this cell inside the current drag selection
 *   onMouseDown   fn(dateStr)
 *   onMouseEnter  fn(dateStr)
 *   onMouseUp     fn(dateStr)
 */
export default function CalendarCell({
  cell,
  occupancy = 0,
  isSelected = false,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  const bgColor  = isSelected ? undefined : occupancyToColor(occupancy)
  const isDark   = DARK_COLORS.has(bgColor)

  const classes = [
    'calendar-cell',
    !cell.isCurrentMonth && 'calendar-cell--outside',
    isSelected           && 'calendar-cell--selected',
    isDark               && 'calendar-cell--dark',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      onMouseDown={() => onMouseDown?.(cell.dateStr)}
      onMouseEnter={() => onMouseEnter?.(cell.dateStr)}
      onMouseUp={() => onMouseUp?.(cell.dateStr)}
    >
      <span className="day-number">{cell.day}</span>
      {occupancy > 0 && cell.isCurrentMonth && (
        <span className="occupancy-count">{occupancy}/10</span>
      )}
    </div>
  )
}
