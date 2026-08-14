import { createClient } from '@/utils/supabase/server'
import { Incident } from '@/lib/types'
import { notFound } from 'next/navigation'
import { ShieldWarning, WarningCircle, CheckCircle, Robot, Briefcase, Lightning, CaretLeft } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('incidents')
    .select('*, threats(*), organizations(*)')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !data) {
    notFound()
  }

  const incident = data as unknown as Incident
  const ai = incident.ai_analysis

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <header className="flex items-center gap-4">
        <Link href="/dashboard/incidents" className="p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:bg-zinc-900 transition-colors">
          <CaretLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-3">
            Incident Details
            <span className="text-sm font-normal text-zinc-400">#{incident.id.split('-')[0]}</span>
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: AI Analysis */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-zinc-950 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 dark:border-zinc-800/50 p-8">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 flex items-center gap-2 mb-6">
              <Robot className="h-6 w-6 text-indigo-500" weight="duotone" /> 
              AI Analyst Report
            </h2>
            
            {ai ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Executive Summary</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm bg-zinc-50/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50">{ai.executiveSummary}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-zinc-400" /> Business Impact
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm bg-zinc-50/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50">{ai.businessImpact}</p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                    <Lightning className="h-4 w-4 text-zinc-400" /> Recommended Actions
                  </h3>
                  <ul className="space-y-3">
                    {ai.recommendedActions.map((action, i) => (
                      <li key={i} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">No AI analysis available for this incident.</p>
            )}
          </div>
        </div>

        {/* Right Column: Metadata */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-950 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 dark:border-zinc-800/50 p-8 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-2">Metadata</h2>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Severity</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                  incident.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-100' :
                  incident.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                  'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {incident.severity === 'CRITICAL' && <ShieldWarning weight="fill" />}
                  {incident.severity === 'HIGH' && <WarningCircle weight="fill" />}
                  {incident.severity}
                </span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Score: {incident.risk_score}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                incident.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' :
                incident.status === 'INVESTIGATING' ? 'bg-amber-50 text-amber-700' :
                'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}>
                {incident.status === 'RESOLVED' && <CheckCircle weight="fill" />}
                {incident.status}
              </span>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800/50" />

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Organization</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-1">{incident.organizations?.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{incident.organizations?.domain}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Affected Asset</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-1 break-all">{incident.threats?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Source Feed</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-1">{incident.threats?.source}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Detection Time</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-1">{new Date(incident.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
