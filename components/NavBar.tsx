'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-[#0F172A]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/pro" className="text-[#D4AF37] font-bold text-xl">
            Evermore Pro
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-white hover:text-[#D4AF37] transition-colors text-sm"
            >
              Features
            </a>
            <Link
              href="/pro/pricing"
              className="text-white hover:text-[#D4AF37] transition-colors text-sm"
            >
              Pricing
            </Link>
            <Link
              href="/pro/faq"
              className="text-white hover:text-[#D4AF37] transition-colors text-sm"
            >
              FAQ
            </Link>
            <Link
              href="/pro/login"
              className="text-white hover:text-[#D4AF37] transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              href="/pro/signup"
              className="bg-[#D4AF37] text-[#0F172A] px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#E8CC6A] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="block text-white hover:text-[#D4AF37] transition-colors text-sm"
            >
              Features
            </a>
            <Link
              href="/pro/pricing"
              onClick={() => setMobileOpen(false)}
              className="block text-white hover:text-[#D4AF37] transition-colors text-sm"
            >
              Pricing
            </Link>
            <Link
              href="/pro/faq"
              onClick={() => setMobileOpen(false)}
              className="block text-white hover:text-[#D4AF37] transition-colors text-sm"
            >
              FAQ
            </Link>
            <Link
              href="/pro/login"
              onClick={() => setMobileOpen(false)}
              className="block text-white hover:text-[#D4AF37] transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              href="/pro/signup"
              onClick={() => setMobileOpen(false)}
              className="inline-block bg-[#D4AF37] text-[#0F172A] px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#E8CC6A] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
