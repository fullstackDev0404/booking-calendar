import { useState, useEffect } from 'react'
import { formatDate } from '../utils/dateUtils'

// Captured once at module load — stable reference, never recreated on re-render.
const TODAY = new Date()

export function useCalendar() {
  const [year, setYear]             = useState(TODAY.getFullYear())
  const [month, setMonth]           = useState(TODAY.getMonth())
  const [selection, setSelection]   = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [tooltip, setTooltip]       = useState(null)

  // If the user releases the mouse outside the grid, end the drag cleanly.
  // Without this, isDragging stays true and the next hover continues the selection.
  useEffect(() => {
    function onWindowMouseUp() {
      setIsDragging(false)
    }
    window.addEventListener('mouseup', onWindowMouseUp)
    return () => window.removeEventListener('mouseup', onWindowMouseUp)
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
