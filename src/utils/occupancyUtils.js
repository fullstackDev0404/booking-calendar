// src/utils/occupancyUtils.js
import { bookingOccupiesDate, parseLocalDate, formatDate } from './dateUtils'

/**
 * Builds a map of { "YYYY-MM-DD": occupiedRoomCount } for a date range.
 * O(bookings × days) — acceptable for 200 bookings × ~120 days.
 *
 * @param {Array}  bookings   - full bookings array from useBookings
 * @param {string} startDate  - "YYYY-MM-DD" first day to include
 * @param {string} endDate    - "YYYY-MM-DD" last day to include
 * @returns {Object}          - { "YYYY-MM-DD": number }
 */
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

/**
 * Converts an occupancy count (0–10) to a CSS background color.
 * Uses a warm scale: white → soft yellow → amber → orange → deep red.
 * 10 rooms total — scale is relative to that.
 *
 * @param {number} count - number of occupied rooms
 * @param {number} total - total rooms (default 10)
 * @returns {string}     - CSS color string
 */
export function occupancyToColor(count, total = 10) {
  if (count === 0) return '#f8fafc'

  const ratio = count / total

  if (ratio <= 0.3) return '#fef9c3'  // 1–3 rooms: soft yellow
  if (ratio <= 0.5) return '#fde68a'  // 4–5 rooms: amber
  if (ratio <= 0.7) return '#fb923c'  // 6–7 rooms: orange
  if (ratio <= 0.9) return '#ef4444'  // 8–9 rooms: red
  return '#991b1b'                    // 10 rooms: dark red
}
