'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, SquaresFour, Warning, Broadcast, Gear, SignOut } from '@phosphor-icons/react/dist/ssr'
import { signout } from '@/app/login/actions'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: SquaresFour },
  { href: '/dashboard/incidents', label: 'Incidents', icon: Warning },
  { href: '/dashboard/threats', label: 'Threat Feed', icon: Broadcast },
  { href: '/dashboard/settings', label: 'Settings', icon: Gear },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col hidden md:flex min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Shield weight="duotone" className="w-6 h-6 text-zinc-900 dark:text-zinc-100 group-hover:scale-110 transition-transform" />
          <span className="font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">DARKWATCH</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <item.icon weight={isActive ? 'fill' : 'regular'} className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
        <ThemeToggle />
        <form action={signout} className="flex-1">
          <button type="submit" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
            <SignOut weight="bold" className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
