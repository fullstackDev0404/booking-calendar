// src/hooks/useBookings.js
import { useState, useEffect } from 'react'

export function useBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // fetch from /bookings.json — Vite serves everything in /public at root
    fetch('/bookings.json')
      .then(res => {
        // fetch only rejects on network failure, not HTTP errors (404, 500)
        // so we check res.ok manually
        if (!res.ok) throw new Error(`Failed to load bookings: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setBookings(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, []) // empty array = run once on mount, never again

  return { bookings, loading, error }
}
