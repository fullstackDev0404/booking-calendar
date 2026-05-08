// src/components/CalendarHeader.jsx

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Renders the 7 weekday label cells at the top of the calendar grid.
// Purely presentational — no logic, no state.
export default function CalendarHeader() {
  return (
    <>
      {WEEKDAYS.map(day => (
        <div key={day} className="calendar-header-cell">
          {day}
        </div>
      ))}
    </>
  )
}
