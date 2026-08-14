'use client'

import * as React from 'react'
import { Moon, Sun } from '@phosphor-icons/react/dist/ssr'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
      title="Toggle theme"
    >
      {/* We use standard generic icon components, next-themes resolves the state */}
      <Sun className="h-5 w-5 hidden dark:block" weight="bold" />
      <Moon className="h-5 w-5 block dark:hidden" weight="bold" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
