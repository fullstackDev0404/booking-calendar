import { useState } from 'react'

export function useFilters() {
  const [filters, setFilters] = useState({
    roomType: 'all',
    status:   'all',
    source:   'all',
  })

  function setFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters({ roomType: 'all', status: 'all', source: 'all' })
  }

  // True if any filter is active — used to show a "Clear" button
  const isFiltered = Object.values(filters).some(v => v !== 'all')

  return { filters, setFilter, resetFilters, isFiltered }
}
