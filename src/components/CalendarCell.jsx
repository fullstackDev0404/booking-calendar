import { occupancyToColor } from '../utils/occupancyUtils'

const DARK_COLORS = new Set(['#fb923c', '#ef4444', '#991b1b'])

export default function CalendarCell({
  cell,
  occupancy = 0,
  isSelected = false,
  isToday = false,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onMouseMove,
  onMouseLeave,
}) {
  const bgColor = isSelected ? undefined : occupancyToColor(occupancy)
  const isDark  = DARK_COLORS.has(bgColor)

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
      onMouseMove={e => onMouseMove?.(cell.dateStr, e.clientX, e.clientY)}
      onMouseLeave={() => onMouseLeave?.()}
    >
      <span className={isToday ? 'day-number day-number--today' : 'day-number'}>
        {cell.day}
      </span>
      {occupancy > 0 && cell.isCurrentMonth && (
        <span className="occupancy-count">{occupancy}/10</span>
      )}
    </div>
  )
}
