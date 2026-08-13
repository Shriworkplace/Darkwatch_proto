import { Radar, WarningCircle, ShieldWarning, ArrowsLeftRight, ShareNetwork } from '@phosphor-icons/react/dist/ssr'

const mockFeeds = [
  { id: 1, type: 'Anomaly', source: 'Firewall Log - Edge Node 04', desc: 'Outbound traffic spike to known malicious IP block.', severity: 'Critical', time: 'Just now', icon: ArrowsLeftRight },
  { id: 2, type: 'Intel', source: 'CISA Alert AA23-xxxA', desc: 'New ransomware campaign targeting healthcare infrastructure.', severity: 'High', time: '12 mins ago', icon: ShieldWarning },
  { id: 3, type: 'System', source: 'Active Directory', desc: 'Multiple lockouts detected in marketing department.', severity: 'Medium', time: '1 hr ago', icon: WarningCircle },
  { id: 4, type: 'Network', source: 'VPC Flow Logs', desc: 'Unusual port scanning activity from internal subnet.', severity: 'Medium', time: '3 hrs ago', icon: ShareNetwork },
]

export default function ThreatsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Threat Feed</h1>
          <p className="text-zinc-500 mt-1">Real-time intelligence and anomaly detection stream.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium text-zinc-600">
          <Radar className="h-5 w-5 animate-spin-slow text-zinc-500" /> Live Updates Active
        </div>
      </header>

      <div className="space-y-4">
        {mockFeeds.map((feed) => (
          <div key={feed.id} className="group relative bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 flex gap-6 hover:shadow-md transition-shadow">
            {/* Severity Accent Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
              feed.severity === 'Critical' ? 'bg-red-500' :
              feed.severity === 'High' ? 'bg-orange-500' : 'bg-blue-400'
            }`} />
            
            <div className={`p-3 rounded-xl shrink-0 h-fit ${
              feed.severity === 'Critical' ? 'bg-red-50 text-red-600' :
              feed.severity === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <feed.icon className="h-6 w-6" weight="duotone" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900">{feed.source}</span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md uppercase tracking-wider">{feed.type}</span>
                </div>
                <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">{feed.time}</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-sm pt-1">{feed.desc}</p>
            </div>
            
            <div className="shrink-0 flex items-center justify-center border-l border-zinc-100 pl-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="text-sm font-medium text-zinc-900 hover:underline">Investigate</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="py-8 flex justify-center">
        <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
          Load older events...
        </button>
      </div>
    </div>
  )
}
