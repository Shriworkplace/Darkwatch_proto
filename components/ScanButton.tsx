'use client'

import { useState } from 'react'
import { runScan } from '@/app/actions/engine'

export function ScanButton() {
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    setLoading(true)
    try {
      const res = await runScan()
      if (res.success) {
        alert(res.message)
      } else {
        alert('Error: ' + res.error)
      }
    } catch (err) {
      console.error(err)
      alert('An unexpected error occurred during the scan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleScan}
      disabled={loading}
      className="text-sm font-medium bg-zinc-950 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Scanning...' : 'Run Manual Scan'}
    </button>
  )
}
