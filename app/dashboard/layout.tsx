import DashboardNav from './DashboardNav'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0F172A] text-white px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-[#D4AF37] font-bold text-lg">
          Evermore Pro
        </Link>
      </header>
      <div className="flex min-h-[calc(100vh-52px)]">
        <DashboardNav />
        <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
