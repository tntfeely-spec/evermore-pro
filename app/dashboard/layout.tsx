'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Listing', href: '/dashboard/listing' },
  { label: 'Inquiries', href: '/dashboard/inquiries' },
  { label: 'Arrangements', href: '/dashboard/arrangements' },
  { label: 'Analytics', href: '/dashboard/analytics' },
  { label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top nav bar */}
      <header className="bg-[#0F172A] text-white px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-[#D4AF37] font-bold text-lg">
          Evermore Pro
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="flex">

        {/* Sidebar - desktop */}
        <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-200 pt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0F172A] text-[#D4AF37] border-r-2 border-[#D4AF37]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0F172A]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-3 text-xs text-center font-medium transition-colors ${
                  isActive
                    ? 'text-[#D4AF37]'
                    : 'text-gray-500'
                }`}
              >
                {item.label.split(' ')[0]}
              </Link>
            )
          })}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
