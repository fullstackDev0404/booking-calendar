// src/components/BookingPanel.jsx
import BookingCard from './BookingCard'
import { minDate, maxDate } from '../utils/dateUtils'

/**
 * Shows all bookings overlapping the selected date range.
 * Handles empty state and single-day vs range selection.
 *
 * Props:
 *   bookings   array — pre-filtered overlapping bookings from App
 *   selection  { start, end } | null
 */
export default function BookingPanel({ bookings, selection }) {
  if (!selection) return null

  const start       = minDate(selection.start, selection.end)
  const end         = maxDate(selection.start, selection.end)
  const isSingleDay = start === end

  const title = isSingleDay
    ? `Bookings on ${formatDisplayDate(start)}`
    : `Bookings: ${formatDisplayDate(start)} – ${formatDisplayDate(end)}`

  return (
    <div className="booking-panel">
      <div className="booking-panel-header">
        <span className="booking-panel-title">{title}</span>
        <span className="booking-panel-count">
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="booking-panel-empty">
          No bookings found for this period.
        </div>
      ) : (
        <div className="booking-panel-list">
          {bookings.map(b => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  )
}

// "2026-02-10" → "Feb 10, 2026"
function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[m - 1]} ${d}, ${y}`
}
