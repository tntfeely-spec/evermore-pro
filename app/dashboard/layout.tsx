'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'grid' },
  { label: 'My Listing', href: '/dashboard/listing', icon: 'doc' },
  { label: 'Inquiries', href: '/dashboard/inquiries', icon: 'inbox' },
  { label: 'Arrangements', href: '/dashboard/arrangements', icon: 'folder' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: 'chart' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'gear' },
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
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#0F172A] min-h-screen flex-shrink-0">
        <div className="py-6 px-6">
          <span className="text-xl font-bold text-[#D4AF37]">Evermore Pro</span>
        </div>

        <nav className="flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center py-3 px-6 text-sm transition-colors ${
                isActive(item.href)
                  ? 'text-[#D4AF37] bg-white/5 border-l-2 border-[#D4AF37]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pb-6 px-6">
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-white text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden overflow-x-auto bg-[#0F172A] px-4 py-3 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-xs whitespace-nowrap transition-colors ${
              isActive(item.href)
                ? 'text-[#D4AF37]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 min-h-screen p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
