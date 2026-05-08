import { MONTH_SHORT } from '../constants'

const STATUS_STYLES = {
  confirmed:   { bg: '#dcfce7', color: '#166534', label: 'Confirmed' },
  checked_in:  { bg: '#dbeafe', color: '#1e40af', label: 'Checked In' },
  checked_out: { bg: '#f3f4f6', color: '#374151', label: 'Checked Out' },
  cancelled:   { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
}

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
        <span>{formatDate(booking.checkIn)}</span>
        <span className="booking-card-arrow">→</span>
        <span>{formatDate(booking.checkOut)}</span>
        <span className="booking-card-nights">{nights}n</span>
      </div>

      <div className="booking-card-status" style={{ background: status.bg, color: status.color }}>
        {status.label}
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number)
  return `${MONTH_SHORT[m - 1]} ${d}`
}

function calcNights(checkIn, checkOut) {
  const parse = str => { const [y, m, d] = str.split('-').map(Number); return new Date(y, m - 1, d) }
  return Math.round((parse(checkOut) - parse(checkIn)) / 86400000)
}
