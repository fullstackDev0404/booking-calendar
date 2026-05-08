import { bookingOverlapsRange, getDaysInMonth } from './dateUtils'

export function computeMonthStats(bookings, year, month) {
  const m          = String(month + 1).padStart(2, '0')
  const lastDay    = String(getDaysInMonth(year, month)).padStart(2, '0')
  const monthStart = `${year}-${m}-01`
  const monthEnd   = `${year}-${m}-${lastDay}`

  const active = bookings.filter(b =>
    b.status !== 'cancelled' && bookingOverlapsRange(b, monthStart, monthEnd)
  )

  if (active.length === 0) {
    return { totalRevenue: 0, avgOccupancy: 0, longestStay: 0, topRoomType: '—', totalBookings: 0 }
  }

  const totalRevenue = active.reduce((sum, b) => sum + b.totalAmount, 0)

  // Average nightly occupancy across the month
  const daysCount = getDaysInMonth(year, month)
  let totalRoomNights = 0
  for (let d = 1; d <= daysCount; d++) {
    const dateStr = `${year}-${m}-${String(d).padStart(2, '0')}`
    totalRoomNights += active.filter(b => dateStr >= b.checkIn && dateStr < b.checkOut).length
  }
  const avgOccupancy = totalRoomNights / daysCount

  const longestStay = active.reduce((max, b) => {
    const nights = calcNights(b.checkIn, b.checkOut)
    return nights > max ? nights : max
  }, 0)

  const typeCounts = {}
  active.forEach(b => { typeCounts[b.roomType] = (typeCounts[b.roomType] ?? 0) + 1 })
  const topRoomType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]

  return { totalRevenue, avgOccupancy, longestStay, topRoomType, totalBookings: active.length }
}

function calcNights(checkIn, checkOut) {
  const parse = str => { const [y, m, d] = str.split('-').map(Number); return new Date(y, m - 1, d) }
  return Math.round((parse(checkOut) - parse(checkIn)) / 86400000)
}
