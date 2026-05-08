// src/components/CalendarCell.jsx
import { occupancyToColor } from '../utils/occupancyUtils'

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
  // When selected, CSS class handles the highlight color.
  // Otherwise, inline style applies the heatmap color.
  const bgColor = isSelected ? undefined : occupancyToColor(occupancy)

  const classes = [
    'calendar-cell',
    !cell.isCurrentMonth && 'calendar-cell--outside',
    isSelected          && 'calendar-cell--selected',
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
