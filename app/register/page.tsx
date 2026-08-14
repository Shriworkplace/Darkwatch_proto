import Link from 'next/link'
import { signup } from '../login/actions'
import { ShieldPlus, ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft weight="bold" /> Back
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-10 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center space-y-2 mb-2">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl mb-2 text-zinc-900 dark:text-zinc-100">
            <ShieldPlus weight="fill" className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Register Analyst</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Create a new SOC operator account</p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="name">
              Full Name
            </label>
            <input
              className="rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none transition-colors text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              name="name"
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="email">
              Email Address
            </label>
            <input
              className="rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none transition-colors text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none transition-colors text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            formAction={signup}
            className="mt-2 bg-zinc-950 dark:bg-zinc-50 rounded-xl px-4 py-3 text-white dark:text-zinc-950 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors active:scale-[0.98]"
          >
            Create Account
          </button>

          {message && (
            <p className="mt-2 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm text-center font-medium border border-red-100 dark:border-red-900/50">
              {message}
            </p>
          )}
        </form>

        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
