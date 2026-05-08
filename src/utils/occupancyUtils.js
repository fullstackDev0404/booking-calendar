import { bookingOccupiesDate, parseLocalDate, formatDate } from './dateUtils'

export function buildOccupancyMap(bookings, startDate, endDate) {
  const map = {}
  const current = parseLocalDate(startDate)
  const end = parseLocalDate(endDate)

  while (current <= end) {
    const dateStr = formatDate(current)
    map[dateStr] = bookings.filter(b => bookingOccupiesDate(b, dateStr)).length
    current.setDate(current.getDate() + 1)
  }

  return map
}

export function occupancyToColor(count, total = 10) {
  if (count === 0) return '#f8fafc'
  const ratio = count / total
  if (ratio <= 0.3) return '#fef9c3'
  if (ratio <= 0.5) return '#fde68a'
  if (ratio <= 0.7) return '#fb923c'
  if (ratio <= 0.9) return '#ef4444'
  return '#991b1b'
}
