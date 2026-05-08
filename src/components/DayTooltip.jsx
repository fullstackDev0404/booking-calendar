import { MONTH_SHORT } from '../constants'

export default function DayTooltip({ dateStr, occupancy, bookings, x, y }) {
  if (!dateStr) return null

  const [, m, d] = dateStr.split('-').map(Number)
  const label = `${MONTH_SHORT[m - 1]} ${d}`

  return (
    <div
      className="day-tooltip"
      style={{ position: 'fixed', top: y + 14, left: x + 14, zIndex: 1000, pointerEvents: 'none' }}
    >
      <div className="day-tooltip-header">
        <span className="day-tooltip-date">{label}</span>
        <span className="day-tooltip-occ">{occupancy}/10 rooms</span>
      </div>

      {bookings.length === 0 ? (
        <div className="day-tooltip-empty">No bookings</div>
      ) : (
        <ul className="day-tooltip-list">
          {bookings.slice(0, 5).map(b => (
            <li key={b.id} className="day-tooltip-item">
              <span className="day-tooltip-room">Rm {b.roomNumber}</span>
              <span className="day-tooltip-guest">{b.guestName}</span>
            </li>
          ))}
          {bookings.length > 5 && (
            <li className="day-tooltip-more">+{bookings.length - 5} more</li>
          )}
        </ul>
      )}
    </div>
  )
}
