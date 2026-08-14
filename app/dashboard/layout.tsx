import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { LiveUpdatesProvider } from '@/components/LiveUpdatesProvider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <Header />
        <LiveUpdatesProvider>
          <main className="flex-1 p-8">
            {children}
          </main>
        </LiveUpdatesProvider>
      </div>
    </div>
  )
}
