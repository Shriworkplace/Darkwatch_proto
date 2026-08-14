import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DARKWATCH | Cyber Intelligence',
  description: 'AI-Powered Data Breach Intelligence & Real-Time Alert System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 antialiased min-h-screen flex flex-col selection:bg-zinc-200 dark:selection:bg-zinc-800`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
