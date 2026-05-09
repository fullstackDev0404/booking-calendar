import { useLocalStorage } from './useLocalStorage'

const DEFAULT_FILTERS = { roomType: 'all', status: 'all', source: 'all' }

export function useFilters() {
  const [filters, setFilters] = useLocalStorage('calendar-filters', DEFAULT_FILTERS)

  function setFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const isFiltered = Object.values(filters).some(v => v !== 'all')

  return { filters, setFilter, resetFilters, isFiltered }
}
