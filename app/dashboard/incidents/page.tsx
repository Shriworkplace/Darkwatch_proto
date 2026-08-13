import { MagnifyingGlass, Funnel, DotsThree, ShieldWarning, WarningCircle, CheckCircle } from '@phosphor-icons/react/dist/ssr'

const mockIncidents = [
  { id: 'INC-2091', title: 'Unauthorized Access Attempt', severity: 'Critical', status: 'Investigating', time: '10 mins ago' },
  { id: 'INC-2090', title: 'Multiple Failed Logins', severity: 'High', status: 'Open', time: '1 hour ago' },
  { id: 'INC-2089', title: 'Unusual Data Exfiltration', severity: 'Critical', status: 'Resolved', time: '2 hours ago' },
  { id: 'INC-2088', title: 'Suspicious API Requests', severity: 'Medium', status: 'Resolved', time: '5 hours ago' },
  { id: 'INC-2087', title: 'Malware Signature Detected', severity: 'High', status: 'Open', time: '1 day ago' },
]

export default function IncidentsPage() {
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
          <button className="text-sm font-medium bg-zinc-950 text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition-colors">
            New Incident
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
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Severity</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {mockIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="py-4 px-6 text-sm font-medium text-zinc-900">{incident.id}</td>
                  <td className="py-4 px-6 text-sm text-zinc-600">{incident.title}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      incident.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                      incident.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {incident.severity === 'Critical' && <ShieldWarning weight="fill" />}
                      {incident.severity === 'High' && <WarningCircle weight="fill" />}
                      {incident.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      incident.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                      incident.status === 'Investigating' ? 'bg-amber-50 text-amber-700' :
                      'bg-zinc-100 text-zinc-700'
                    }`}>
                      {incident.status === 'Resolved' && <CheckCircle weight="fill" />}
                      {incident.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-500">{incident.time}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-zinc-400 hover:text-zinc-900 transition-colors opacity-0 group-hover:opacity-100">
                      <DotsThree size={24} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-sm text-zinc-500 bg-zinc-50/50">
          <span>Showing 1 to 5 of 24 incidents</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-100 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
