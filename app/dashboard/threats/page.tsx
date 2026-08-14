import { Broadcast, WarningCircle, ShieldWarning, ArrowsLeftRight, ShareNetwork, Key } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/utils/supabase/server'
import { Threat } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ThreatsPage() {
  const supabase = await createClient()

  // Fetch the latest 50 threats globally
  const { data } = await supabase
    .from('threats')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const threats = (data as unknown as Threat[]) || []

  // Helper to determine visual representation of raw threat
  const getVisuals = (threat: Threat) => {
    if (threat.password) {
      return { severity: 'Critical', icon: Key, color: 'red' }
    }
    if (threat.source.toLowerCase().includes('network') || threat.source.toLowerCase().includes('vpc')) {
      return { severity: 'Medium', icon: ShareNetwork, color: 'blue' }
    }
    if (threat.source.toLowerCase().includes('alert') || threat.source.toLowerCase().includes('cisa')) {
      return { severity: 'High', icon: ShieldWarning, color: 'orange' }
    }
    return { severity: 'Low', icon: ArrowsLeftRight, color: 'zinc' }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Threat Feed</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Real-time intelligence and anomaly detection stream.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Broadcast className="h-5 w-5 animate-spin-slow text-zinc-500 dark:text-zinc-400" /> Live Updates Active
        </div>
      </header>

      <div className="space-y-4">
        {threats.length === 0 ? (
           <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/50">
             <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No threats ingested yet.</p>
             <p className="text-xs text-zinc-400 mt-1">Use the API to send simulated threat payloads.</p>
           </div>
        ) : (
          threats.map((feed) => {
            const visual = getVisuals(feed)
            const Icon = visual.icon
            
            return (
              <div key={feed.id} className="group relative bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/50 p-6 flex gap-6 hover:shadow-md transition-shadow">
                {/* Severity Accent Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                  visual.color === 'red' ? 'bg-red-500' :
                  visual.color === 'orange' ? 'bg-orange-500' : 
                  visual.color === 'blue' ? 'bg-blue-400' : 'bg-zinc-300'
                }`} />
                
                <div className={`p-3 rounded-xl shrink-0 h-fit ${
                  visual.color === 'red' ? 'bg-red-50 text-red-600' :
                  visual.color === 'orange' ? 'bg-orange-50 text-orange-600' : 
                  visual.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}>
                  <Icon className="h-6 w-6" weight="duotone" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{feed.source}</span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md uppercase tracking-wider">
                        {feed.email ? 'Credential Leak' : 'Anomaly'}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">
                      {new Date(feed.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm pt-1">
                    {feed.email ? `Exposed record for: ${feed.email}` : 'General anomaly detected in feed.'}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
      
      {threats.length > 0 && (
        <div className="py-8 flex justify-center">
          <button className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 transition-colors">
            Load older events...
          </button>
        </div>
      )}
    </div>
  )
}
