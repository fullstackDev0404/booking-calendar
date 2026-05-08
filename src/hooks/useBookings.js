import { useState, useEffect } from 'react'

export function useBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetch('/bookings.json')
      .then(res => {
        // fetch doesn't throw on HTTP errors — check manually
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
        return res.json()
      })
      .then(data => { setBookings(data); setLoading(false) })
      .catch(err  => { setError(err.message); setLoading(false) })
  }, [])

  return { bookings, loading, error }
}
