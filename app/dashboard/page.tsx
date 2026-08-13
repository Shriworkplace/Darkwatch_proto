import { ShieldWarning, Monitor, TrendUp, ShieldCheck, Crosshair } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/utils/supabase/server'
import { ScanButton } from '@/components/ScanButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  // Fetch metrics
  const { count: criticalCount } = await supabase
    .from('incidents')
    .select('*', { count: 'exact', head: true })
    .eq('severity', 'CRITICAL')
    .neq('status', 'RESOLVED')
    .in('organization_id', (await supabase.from('organizations').select('id').eq('user_id', user?.id)).data?.map(o => o.id) || [])

  const { count: activeCount } = await supabase
    .from('incidents')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'RESOLVED')
    .in('organization_id', (await supabase.from('organizations').select('id').eq('user_id', user?.id)).data?.map(o => o.id) || [])

  const { count: resolvedCount } = await supabase
    .from('incidents')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'RESOLVED')
    .in('organization_id', (await supabase.from('organizations').select('id').eq('user_id', user?.id)).data?.map(o => o.id) || [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Overview</h1>
        <p className="text-zinc-500 mt-1">Real-time telemetry and active alerts for your infrastructure.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 grid-flow-dense">
        
        {/* Critical Alerts Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-50 p-2.5 rounded-xl text-red-500">
              <ShieldWarning className="h-6 w-6" weight="duotone" />
            </div>
            {criticalCount && criticalCount > 0 ? (
              <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 rounded-full">Requires Action</span>
            ) : null}
          </div>
          <div>
            <p className="text-[3rem] leading-none font-medium text-zinc-950 tracking-tighter mb-1">{criticalCount || 0}</p>
            <p className="text-sm font-medium text-zinc-500">Critical Alerts</p>
          </div>
        </div>

        {/* Monitored Assets Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500">
              <Monitor className="h-6 w-6" weight="duotone" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full">+12 today</span>
          </div>
          <div>
            <p className="text-[3rem] leading-none font-medium text-zinc-950 tracking-tighter mb-1">1,402</p>
            <p className="text-sm font-medium text-zinc-500">Monitored Assets (Simulated)</p>
          </div>
        </div>

        {/* Open Incidents Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 p-2.5 rounded-xl text-amber-500">
              <TrendUp className="h-6 w-6" weight="duotone" />
            </div>
          </div>
          <div>
            <p className="text-[3rem] leading-none font-medium text-zinc-950 tracking-tighter mb-1">{activeCount || 0}</p>
            <p className="text-sm font-medium text-zinc-500">Active Incidents</p>
          </div>
        </div>

        {/* Resolved Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-500">
              <ShieldCheck className="h-6 w-6" weight="duotone" />
            </div>
          </div>
          <div>
            <p className="text-[3rem] leading-none font-medium text-zinc-950 tracking-tighter mb-1">{resolvedCount || 0}</p>
            <p className="text-sm font-medium text-zinc-500">Resolved (30d)</p>
          </div>
        </div>

        {/* Main Threat Feed Area (Takes up 2 rows, wide span) */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-8 col-span-1 md:col-span-2 lg:col-span-4 row-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-zinc-950">Recent Threat Feed</h2>
            <ScanButton />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-zinc-200 rounded-[1.5rem] bg-zinc-50/50">
            <Crosshair className="h-12 w-12 mx-auto mb-4 text-zinc-300" weight="duotone" />
            <p className="text-lg font-medium text-zinc-900 mb-1">Feed Stream Active</p>
            <p className="text-zinc-500 text-sm">Monitoring simulated feeds for organizational matches.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
