"use client"

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
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        <aside className="hidden md:flex flex-col w-56 min-h-[calc(100vh-52px)] bg-white border-r border-gray-200 pt-4">
          <nav className="flex flex-col">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-6 py-3 text-sm font-medium border-l-2 transition-colors ${
                    isActive
                      ? 'bg-gray-50 text-[#0F172A] border-[#D4AF37]'
                      : 'text-gray-500 hover:text-[#0F172A] hover:bg-gray-50 border-transparent'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-3 text-xs text-center font-medium transition-colors ${
                  isActive ? 'text-[#D4AF37]' : 'text-gray-500'
                }`}
              >
                {item.label.split(' ')[0]}
              </Link>
            )
          })}
        </div>

        <main className="flex-1 p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
