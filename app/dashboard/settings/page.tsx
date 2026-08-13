import { User, BellRing, ShieldCheck, Key } from '@phosphor-icons/react/dist/ssr'

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your account and workspace preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation / Tabs (Desktop Left Column) */}
        <div className="md:col-span-3 flex flex-col space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-white shadow-sm border border-zinc-200 text-zinc-900">
             <User weight="fill" className="h-4 w-4" /> Profile
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
             <BellRing weight="bold" className="h-4 w-4" /> Notifications
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
             <ShieldCheck weight="bold" className="h-4 w-4" /> Security
          </button>
        </div>

        {/* Content Area (Desktop Right Column) */}
        <div className="md:col-span-9 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-950">Profile Information</h2>
              <p className="text-sm text-zinc-500">Update your personal details and public profile.</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700">Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Analyst Alpha"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-400 focus:ring-0 transition-colors text-zinc-900"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="analyst@darkwatch.local"
                  disabled
                  className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-sm text-zinc-500 cursor-not-allowed"
                />
                <p className="text-xs text-zinc-500 mt-1">Contact your administrator to change your email address.</p>
              </div>
            </div>
            <div className="px-8 py-4 bg-zinc-50/50 border-t border-zinc-100 flex justify-end">
              <button className="text-sm font-medium bg-zinc-950 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-zinc-100">
              <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                <Key weight="bold" /> Danger Zone
              </h2>
            </div>
            <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-900">Deactivate Account</p>
                <p className="text-sm text-zinc-500 mt-1">Permanently remove your access to this workspace.</p>
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
