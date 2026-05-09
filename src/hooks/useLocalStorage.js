import { useState } from 'react'

// Like useState but syncs to localStorage so state survives page reloads.
// Falls back to defaultValue if nothing is stored or JSON is corrupt.
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  function setAndPersist(next) {
    setValue(prev => {
      const resolved = typeof next === 'function' ? next(prev) : next
      try {
        localStorage.setItem(key, JSON.stringify(resolved))
      } catch {
        // quota exceeded or private browsing — state still updates in memory
      }
      return resolved
    })
  }

  return [value, setAndPersist]
}
