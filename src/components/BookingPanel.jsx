import { MONTH_SHORT } from '../constants'
import { minDate, maxDate } from '../utils/dateUtils'
import BookingCard from './BookingCard'

// "Feb 5, 2026" format for the panel header
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${MONTH_SHORT[m - 1]} ${d}, ${y}`
}

export default function BookingPanel({ bookings, selection }) {
  if (!selection) return null

  const start       = minDate(selection.start, selection.end)
  const end         = maxDate(selection.start, selection.end)
  const isSingleDay = start === end

  const title = isSingleDay
    ? `Bookings on ${formatDate(start)}`
    : `Bookings: ${formatDate(start)} – ${formatDate(end)}`

  return (
    <div className="booking-panel">
      <div className="booking-panel-header">
        <span className="booking-panel-title">{title}</span>
        <span className="booking-panel-count">
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="booking-panel-empty">No bookings for this period.</div>
      ) : (
        <div className="booking-panel-list">
          {bookings.map(b => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  )
}
