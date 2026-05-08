// src/components/BookingCard.jsx

// Maps booking status to badge colors
const STATUS_STYLES = {
  confirmed:   { bg: '#dcfce7', color: '#166534', label: 'Confirmed' },
  checked_in:  { bg: '#dbeafe', color: '#1e40af', label: 'Checked In' },
  checked_out: { bg: '#f3f4f6', color: '#374151', label: 'Checked Out' },
  cancelled:   { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
}

/**
 * Renders a single booking as a card row.
 * Pure presentational — receives a booking object, renders it.
 */
export default function BookingCard({ booking }) {
  const nights = calcNights(booking.checkIn, booking.checkOut)
  const status = STATUS_STYLES[booking.status] ?? STATUS_STYLES.confirmed

  return (
    <div className="booking-card">
      <div className="booking-card-main">
        <div className="booking-card-guest">{booking.guestName}</div>
        <div className="booking-card-meta">
          Room {booking.roomNumber}
          <span className="booking-card-dot">·</span>
          {booking.roomType}
          <span className="booking-card-dot">·</span>
          {booking.source}
        </div>
      </div>

      <div className="booking-card-dates">
        <span>{formatDisplayDate(booking.checkIn)}</span>
        <span className="booking-card-arrow">→</span>
        <span>{formatDisplayDate(booking.checkOut)}</span>
        <span className="booking-card-nights">{nights}n</span>
      </div>

      <div
        className="booking-card-status"
        style={{ background: status.bg, color: status.color }}
      >
        {status.label}
      </div>
    </div>
  )
}

// "2026-02-10" → "Feb 10"
function formatDisplayDate(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number)
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[m - 1]} ${d}`
}

// Nights = checkOut - checkIn in days (uses parseLocalDate pattern)
function calcNights(checkIn, checkOut) {
  const parse = str => {
    const [y, m, d] = str.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((parse(checkOut) - parse(checkIn)) / msPerDay)
}
