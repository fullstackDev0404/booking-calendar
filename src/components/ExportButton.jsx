import { useState } from 'react'
import { generateCsv, generateFilename } from '../utils/csvUtils'

export default function ExportButton({ bookings, filters }) {
  const [status, setStatus] = useState('idle') // idle | success | error

  function handleExport() {
    const csv = generateCsv(bookings)
    if (!csv) return

    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = generateFilename(filters)
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 0)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <button
      className={`export-btn${status === 'success' ? ' export-btn--success' : ''}${status === 'error' ? ' export-btn--error' : ''}`}
      onClick={handleExport}
      disabled={!bookings.length}
      title={!bookings.length ? 'No bookings to export' : 'Export current view as CSV'}
    >
      {status === 'success' ? '✓ Exported' : status === 'error' ? 'Failed' : 'Export CSV'}
    </button>
  )
}
