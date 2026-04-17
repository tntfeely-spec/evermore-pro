"use client"
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

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const handleNav = (href: string) => {
    window.location.href = href
  }

  return (
    <>
      <aside className="hidden md:block w-56 shrink-0 bg-white border-r border-gray-200">
        <nav className="flex flex-col pt-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={`text-left block w-full px-6 py-3 text-sm font-medium border-l-2 transition-colors cursor-pointer ${
                pathname === item.href
                  ? 'text-[#0F172A] border-[#D4AF37] bg-amber-50'
                  : 'text-gray-500 border-transparent hover:text-[#0F172A] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="mt-8 mx-6 text-sm text-gray-400 hover:text-gray-600 text-left cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.href}
            onClick={() => handleNav(item.href)}
            className={`flex-1 py-3 text-xs text-center font-medium cursor-pointer ${
              pathname === item.href ? 'text-[#D4AF37]' : 'text-gray-500'
            }`}
          >
            {item.label.split(' ')[0]}
          </button>
        ))}
      </div>
    </>
  )
}
