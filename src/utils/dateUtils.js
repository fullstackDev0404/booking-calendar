// src/utils/dateUtils.js

// Parses "YYYY-MM-DD" to a local Date. Avoids new Date(str) which parses as
// UTC and shifts the day in timezones behind UTC.
export function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Formats a Date to "YYYY-MM-DD" using local time getters, not toISOString().
export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Day 0 of next month = last day of current month.
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// 0=Sun, 6=Sat — tells us how many blank cells before day 1.
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function getDaysInMonthArray(year, month) {
  const total = getDaysInMonth(year, month)
  const days = []
  for (let d = 1; d <= total; d++) {
    days.push(formatDate(new Date(year, month, d)))
  }
  return days
}

// checkIn inclusive, checkOut exclusive. "2026-02-10" to "2026-02-13" = nights 10,11,12.
// String comparison works because YYYY-MM-DD zero-padded sorts chronologically.
export function bookingOccupiesDate(booking, dateStr) {
  if (booking.status === 'cancelled') return false
  return dateStr >= booking.checkIn && dateStr < booking.checkOut
}

// Overlap: booking touches the range if it starts before range ends AND ends after range starts.
export function bookingOverlapsRange(booking, rangeStart, rangeEnd) {
  if (booking.status === 'cancelled') return false
  return booking.checkIn <= rangeEnd && booking.checkOut > rangeStart
}

// Normalize drag direction — whichever end the user started from.
export function minDate(a, b) { return a <= b ? a : b }
export function maxDate(a, b) { return a >= b ? a : b }

/**
 * Builds the flat array of cell objects for a calendar grid.
 * Includes padding cells from prev/next month to fill complete rows.
 * Each cell: { dateStr, day, isCurrentMonth }
 *
 * Why flat array: CSS Grid with 7 columns handles row wrapping automatically.
 * No need for nested arrays.
 */
export function buildCalendarCells(year, month) {
  const cells = []

  const firstWeekday = getFirstDayOfMonth(year, month)
  const daysInMonth  = getDaysInMonth(year, month)

  // Prev month padding
  const prevMonth  = month === 0 ? 11 : month - 1
  const prevYear   = month === 0 ? year - 1 : year
  const daysInPrev = getDaysInMonth(prevYear, prevMonth)

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrev - i
    const d = String(day).padStart(2, '0')
    const m = String(prevMonth + 1).padStart(2, '0')
    cells.push({ dateStr: `${prevYear}-${m}-${d}`, day, isCurrentMonth: false })
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = String(day).padStart(2, '0')
    const m = String(month + 1).padStart(2, '0')
    cells.push({ dateStr: `${year}-${m}-${d}`, day, isCurrentMonth: true })
  }

  // Next month padding — fill the last incomplete row
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear  = month === 11 ? year + 1 : year
  const remaining = 7 - (cells.length % 7)

  if (remaining < 7) {
    for (let day = 1; day <= remaining; day++) {
      const d = String(day).padStart(2, '0')
      const m = String(nextMonth + 1).padStart(2, '0')
      cells.push({ dateStr: `${nextYear}-${m}-${d}`, day, isCurrentMonth: false })
    }
  }

  return cells
}
