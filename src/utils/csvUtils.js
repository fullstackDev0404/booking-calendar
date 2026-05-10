// wraps a field in quotes if it contains a comma, quote, or newline
// doubles any internal quotes per RFC 4180
function escapeField(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const HEADERS = ['id', 'guestName', 'roomNumber', 'roomType', 'checkIn', 'checkOut', 'guests', 'totalAmount', 'currency', 'status', 'source']

export function generateCsv(bookings) {
  if (!bookings.length) return null
  const rows = bookings.map(b =>
    HEADERS.map(key => escapeField(b[key])).join(',')
  )
  return [HEADERS.join(','), ...rows].join('\n')
}

export function generateFilename(filters) {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '')
  const segments = Object.values(filters)
    .filter(v => v !== 'all')
    .map(v => v.toLowerCase().replace(/[^a-z0-9]/g, ''))
  return ['bookings', ...segments, `${date}-${time}`].join('-') + '.csv'
}
