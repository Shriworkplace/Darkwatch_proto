import { User, BellRinging, ShieldCheck, Key, Buildings } from '@phosphor-icons/react/dist/ssr'
import { addOrganization } from '@/app/actions/organization'
import { createClient } from '@/utils/supabase/server'
import { Organization } from '@/lib/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  const { data: orgsData } = await supabase.from('organizations').select('*').eq('user_id', user?.id)
  const organizations: Organization[] = orgsData || []

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account and workspace preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation / Tabs (Desktop Left Column) */}
        <div className="md:col-span-3 flex flex-col space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-white dark:bg-zinc-950 shadow-sm border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
             <User weight="fill" className="h-4 w-4" /> Profile
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-100 transition-colors">
             <Buildings weight="bold" className="h-4 w-4" /> Organizations
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-100 transition-colors">
             <BellRinging weight="bold" className="h-4 w-4" /> Notifications
          </button>
        </div>

        {/* Content Area (Desktop Right Column) */}
        <div className="md:col-span-9 space-y-6">
          
          {/* Organization Settings */}
          <div className="bg-white dark:bg-zinc-950 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800/50">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Monitored Organizations</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Domains and assets to track in the threat feed.</p>
            </div>
            
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800/50">
              {organizations.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No organizations configured. Add one below.</p>
              ) : (
                <ul className="space-y-3">
                  {organizations.map(org => (
                    <li key={org.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{org.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{org.domain}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form action={async (formData) => {
              'use server';
              await addOrganization(formData);
            }} className="p-8 space-y-6">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Add New Organization</h3>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Company Name</label>
                  <input 
                    name="name"
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-zinc-400 focus:ring-0 transition-colors text-zinc-900 dark:text-zinc-100"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Primary Domain</label>
                  <input 
                    name="domain"
                    placeholder="e.g. acme.com"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-zinc-400 focus:ring-0 transition-colors text-zinc-900 dark:text-zinc-100"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="text-sm font-medium bg-zinc-950 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors">
                  Add Organization
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-zinc-950 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800/50">
              <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                <Key weight="bold" /> Danger Zone
              </h2>
            </div>
            <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Deactivate Account</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Permanently remove your access to this workspace.</p>
              </div>
              <button className="text-sm font-medium bg-red-50 text-red-600 px-6 py-2.5 rounded-full hover:bg-red-100 transition-colors whitespace-nowrap">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
