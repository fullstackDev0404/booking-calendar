import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

const TODAY = new Date()

export function useCalendar() {
  // persist month/year so the user comes back to the same view on reload
  const [year, setYear]   = useLocalStorage('calendar-year',  TODAY.getFullYear())
  const [month, setMonth] = useLocalStorage('calendar-month', TODAY.getMonth())
  const [selection, setSelection]   = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [tooltip, setTooltip]       = useState(null)

  // end drag if mouse is released outside the grid
  useEffect(() => {
    function onMouseUp() { setIsDragging(false) }
    window.addEventListener('mouseup', onMouseUp)
    return () => window.removeEventListener('mouseup', onMouseUp)
  }, [])

  function goToPrevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function goToNextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function goToToday() {
    setYear(TODAY.getFullYear())
    setMonth(TODAY.getMonth())
  }

  function handleDayMouseDown(dateStr) {
    setIsDragging(true)
    setSelection({ start: dateStr, end: dateStr })
  }

  function handleDayMouseEnter(dateStr) {
    if (!isDragging) return
    setSelection(prev => ({ ...prev, end: dateStr }))
  }

  function handleDayMouseUp(dateStr) {
    setIsDragging(false)
    setSelection(prev => ({ ...prev, end: dateStr }))
  }

  function handleDayMouseMove(dateStr, x, y) {
    if (isDragging) return
    setTooltip({ dateStr, x, y })
  }

  function handleDayMouseLeave() {
    setTooltip(null)
  }

  return {
    year, month, selection, isDragging, tooltip,
    goToPrevMonth, goToNextMonth, goToToday,
    handleDayMouseDown, handleDayMouseEnter, handleDayMouseUp,
    handleDayMouseMove, handleDayMouseLeave,
  }
}
