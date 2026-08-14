import { signout } from '@/app/login/actions'
import { UserCircle, Bell } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/utils/supabase/server'

export default async function Header() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-10">
      <div></div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          <Bell className="w-5 h-5" weight="bold" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
        </button>
        
        <div className="flex items-center gap-2 pl-4 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
            <UserCircle className="w-5 h-5" weight="fill" />
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">{user?.user_metadata?.name || user?.email}</span>
        </div>
      </div>
    </header>
  )
}
