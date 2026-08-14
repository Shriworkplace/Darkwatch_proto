'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { WarningCircle } from '@phosphor-icons/react'

export function LiveUpdatesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; severity: string } | null>(null)
  
  useEffect(() => {
    const supabase = createClient()
    
    // Subscribe to INSERT events on the incidents table
    const channel = supabase
      .channel('incidents-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incidents',
        },
        (payload) => {
          console.log('New incident detected!', payload)
          const newIncident = payload.new
          
          // Show a toast
          setToast({
            message: 'New Threat Detected!',
            severity: newIncident.severity
          })
          
          // Auto-hide toast after 5s
          setTimeout(() => setToast(null), 5000)
          
          // Refresh the Next.js router to fetch new server component data
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  return (
    <>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-sm w-full">
            <div className={`p-3 rounded-xl flex items-center justify-center ${
              toast.severity === 'CRITICAL' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
              toast.severity === 'HIGH' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
              toast.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              <WarningCircle weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-zinc-950 dark:text-zinc-50">{toast.message}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Severity: {toast.severity}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
