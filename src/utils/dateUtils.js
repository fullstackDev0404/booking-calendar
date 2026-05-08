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

// checkIn inclusive, checkOut exclusive: Feb 10 – Feb 13 = nights 10, 11, 12.
// String comparison works because YYYY-MM-DD zero-padded sorts chronologically.
export function bookingOccupiesDate(booking, dateStr) {
  if (booking.status === 'cancelled') return false
  return dateStr >= booking.checkIn && dateStr < booking.checkOut
}

// A booking overlaps a range if it starts before the range ends AND ends after it starts.
export function bookingOverlapsRange(booking, rangeStart, rangeEnd) {
  if (booking.status === 'cancelled') return false
  return booking.checkIn <= rangeEnd && booking.checkOut > rangeStart
}

export function minDate(a, b) { return a <= b ? a : b }
export function maxDate(a, b) { return a >= b ? a : b }

export function buildCalendarCells(year, month) {
  const cells = []

  const firstWeekday = getFirstDayOfMonth(year, month)
  const daysInMonth  = getDaysInMonth(year, month)

  const prevMonth  = month === 0 ? 11 : month - 1
  const prevYear   = month === 0 ? year - 1 : year
  const daysInPrev = getDaysInMonth(prevYear, prevMonth)

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrev - i
    const d = String(day).padStart(2, '0')
    const m = String(prevMonth + 1).padStart(2, '0')
    cells.push({ dateStr: `${prevYear}-${m}-${d}`, day, isCurrentMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = String(day).padStart(2, '0')
    const m = String(month + 1).padStart(2, '0')
    cells.push({ dateStr: `${year}-${m}-${d}`, day, isCurrentMonth: true })
  }

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
