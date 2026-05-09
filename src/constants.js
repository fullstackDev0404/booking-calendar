export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Must stay in sync with occupancyToColor() thresholds in occupancyUtils.js
export const OCCUPANCY_LEGEND = [
  { color: '#f8fafc', label: '0'   },
  { color: '#fef9c3', label: '1–3' },
  { color: '#fde68a', label: '4–5' },
  { color: '#fb923c', label: '6–7' },
  { color: '#ef4444', label: '8–9' },
  { color: '#991b1b', label: '10'  },
]

export const TOTAL_ROOMS = 10

export const FILTER_LABELS = {
  status: {
    confirmed:   'Confirmed',
    checked_in:  'Checked In',
    checked_out: 'Checked Out',
    cancelled:   'Cancelled',
  },
}
