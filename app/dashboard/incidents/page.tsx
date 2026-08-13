import { MagnifyingGlass, Funnel, DotsThree, ShieldWarning, WarningCircle, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/utils/supabase/server'
import { Incident } from '@/lib/types'

export default async function IncidentsPage() {
  const supabase = await createClient()
  
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  // Fetch incidents related to the user's organizations
  const { data: orgs } = await supabase.from('organizations').select('id').eq('user_id', user?.id)
  const orgIds = orgs?.map(o => o.id) || []

  let incidents: Incident[] = []
  if (orgIds.length > 0) {
    const { data } = await supabase
      .from('incidents')
      .select('*, threats(*), organizations(*)')
      .in('organization_id', orgIds)
      .order('created_at', { ascending: false })
    incidents = data as unknown as Incident[] || []
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Incidents</h1>
          <p className="text-zinc-500 mt-1">Manage and respond to security events.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 text-sm font-medium bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-full hover:bg-zinc-50 transition-colors">
            <Funnel weight="bold" /> Filter
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
           <div className="relative w-full max-w-md">
             <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
             <input 
               type="text" 
               placeholder="Search incidents by ID or title..." 
               className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 focus:ring-0 transition-colors"
             />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Asset / Org</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Severity</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-zinc-500">
                    No incidents found. Run a scan from the dashboard to detect threats.
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-zinc-50/50 transition-colors group cursor-pointer">
                    <td className="py-4 px-6 text-sm font-medium text-zinc-900">{incident.id.split('-')[0]}</td>
                    <td className="py-4 px-6 text-sm text-zinc-600">
                      <div>{incident.threats?.email || 'Unknown Asset'}</div>
                      <div className="text-xs text-zinc-400">{incident.organizations?.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        incident.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-100' :
                        incident.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {incident.severity === 'CRITICAL' && <ShieldWarning weight="fill" />}
                        {incident.severity === 'HIGH' && <WarningCircle weight="fill" />}
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        incident.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' :
                        incident.status === 'INVESTIGATING' ? 'bg-amber-50 text-amber-700' :
                        'bg-zinc-100 text-zinc-700'
                      }`}>
                        {incident.status === 'RESOLVED' && <CheckCircle weight="fill" />}
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-zinc-500">{new Date(incident.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-zinc-400 hover:text-zinc-900 transition-colors opacity-0 group-hover:opacity-100">
                        <DotsThree size={24} weight="bold" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
          <span>Showing {incidents.length} incident(s)</span>
        </div>
      </div>
    </div>
  )
}
