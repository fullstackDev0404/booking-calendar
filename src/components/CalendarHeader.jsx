import { WEEKDAYS } from '../constants'

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
