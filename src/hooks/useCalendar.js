import { useState } from 'react'

export function useCalendar() {
  const today = new Date()

  const [year, setYear]     = useState(today.getFullYear())
  const [month, setMonth]   = useState(today.getMonth())
  const [selection, setSelection]   = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [tooltip, setTooltip]       = useState(null)

  function goToPrevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function goToNextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function goToToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
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
