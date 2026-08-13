import { signout } from '@/app/login/actions'
import { SignOut, Bell } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/utils/supabase/server'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-8">
      <div className="font-medium text-zinc-900 text-sm tracking-wide">
        Overview
      </div>
      <div className="flex items-center gap-6">
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <Bell className="h-5 w-5" weight="bold" />
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-zinc-600">{user?.user_metadata?.name || user?.email}</span>
          <form action={signout}>
            <button type="submit" className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center" title="Sign out">
              <SignOut className="h-5 w-5" weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
