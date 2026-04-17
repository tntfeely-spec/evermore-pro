'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Listing', href: '/dashboard/listing' },
  { label: 'Inquiries', href: '/dashboard/inquiries' },
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

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#0F172A] text-white flex-shrink-0">
        <div className="p-6">
          <span className="text-xl font-bold text-[#D4AF37]">Evermore Pro</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-[#D4AF37] border-l-4 border-[#D4AF37] bg-white/5'
                  : 'text-white hover:text-[#D4AF37] hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="md:hidden bg-[#0F172A] overflow-x-auto">
        <div className="flex px-2 py-2 space-x-1 min-w-max">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                isActive(item.href)
                  ? 'text-[#D4AF37] bg-white/10'
                  : 'text-white hover:text-[#D4AF37]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
