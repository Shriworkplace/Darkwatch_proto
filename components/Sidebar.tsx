import Link from 'next/link'
import { ShieldCheck, SquaresFour, Warning, Users, GearSix } from '@phosphor-icons/react/dist/ssr'

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-zinc-200 min-h-[100dvh] flex flex-col p-4">
      <div className="flex items-center gap-2 p-2 mb-8">
        <ShieldCheck weight="fill" className="h-7 w-7 text-zinc-900" />
        <span className="text-lg font-semibold tracking-tight text-zinc-950">DARKWATCH</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-100 text-zinc-900 font-medium transition-colors">
          <SquaresFour className="h-5 w-5" weight="fill" />
          <span className="text-sm">Dashboard</span>
        </Link>
        <Link href="/dashboard/incidents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors font-medium">
          <Warning className="h-5 w-5" weight="bold" />
          <span className="text-sm">Incidents</span>
        </Link>
        <Link href="/dashboard/threats" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors font-medium">
          <Users className="h-5 w-5" weight="bold" />
          <span className="text-sm">Threat Feed</span>
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors font-medium">
          <GearSix className="h-5 w-5" weight="bold" />
          <span className="text-sm">Settings</span>
        </Link>
      </nav>
    </div>
  )
}
