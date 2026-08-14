import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { ShieldCheck, ArrowRight } from '@phosphor-icons/react/dist/ssr'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex-1 w-full flex flex-col items-center justify-center py-32 px-4 md:px-8 max-w-6xl mx-auto overflow-x-hidden">
      <div className="w-full flex flex-col items-center text-center space-y-12">
        {/* Navigation / Header */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-zinc-950 dark:text-zinc-50 font-semibold tracking-tight text-lg">
            <ShieldCheck weight="fill" className="text-zinc-900 dark:text-zinc-100 w-7 h-7" />
            DARKWATCH
          </div>
          <div className="flex gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center max-w-4xl space-y-8 pt-20">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.1] max-w-5xl">
            Clarity and control for modern security teams.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Darkwatch provides a clean, unified view of your organization's threat landscape. Designed for speed, precision, and focus.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-4 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform active:scale-95"
              >
                Enter Workspace <ArrowRight weight="bold" />
              </Link>
            ) : (
              <Link
                href="/register"
                className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-4 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform active:scale-95"
              >
                Register Analyst <ArrowRight weight="bold" />
              </Link>
            )}
            {!user && (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-full font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Analyst Login
              </Link>
            )}
          </div>
        </div>

        {/* Dashboard Preview Image */}
        <div className="w-full max-w-5xl aspect-video rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] mt-16 overflow-hidden border border-zinc-200 dark:border-zinc-800">
           <img 
             src="/preview.png" 
             alt="Darkwatch Dashboard Preview" 
             className="w-full h-full object-cover"
           />
        </div>
      </div>
    </main>
  )
}
