'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const NAV = [
  { href: '/services',          label: 'Services' },
  { href: '/locations',         label: 'Service Areas' },
  { href: '/property-managers', label: 'Property Managers' },
  { href: '/about',             label: 'About' },
  { href: '/faq',               label: 'FAQ' },
  { href: '/track',             label: 'Track a Job' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const menuRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur" style={{ background: 'rgba(13,13,13,0.85)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <Image src="/logo.jpg" alt="" aria-hidden={true} width={40} height={40} priority style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
          <span className="font-semibold tracking-wide truncate text-sm sm:text-base" style={{ color: '#f0f0f0' }}>
            Walker Property Services
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-5" aria-label="Main">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className="text-sm transition-colors hover:text-white"
              style={{ color: isActive(href) ? '#9cc23a' : '#a0a0a0' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/dashboard/login"
            className="hidden xl:block text-sm px-3 py-2 rounded-lg border transition-colors hover:bg-white/5"
            style={{ color: '#c8c8c8', borderColor: '#2e2e2e' }}
          >
            Staff Login
          </Link>
          <Link
            href="/submit"
            className="text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110 whitespace-nowrap"
            style={{ background: '#5f7d1f', color: '#fff' }}
          >
            Free Quote
          </Link>
          <details ref={menuRef} className="xl:hidden relative">
            <summary
              className="list-none cursor-pointer p-2 rounded-lg border [&::-webkit-details-marker]:hidden"
              style={{ borderColor: '#2e2e2e', color: '#f0f0f0' }}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-xl p-2 shadow-2xl" style={{ background: '#161616', border: '1px solid #2e2e2e' }}>
              <Link href="/" className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/5" style={{ color: pathname === '/' ? '#9cc23a' : '#e0e0e0' }}>
                Home
              </Link>
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/5"
                  style={{ color: isActive(href) ? '#9cc23a' : '#e0e0e0' }}
                >
                  {label}
                </Link>
              ))}
              <div className="my-1 border-t" style={{ borderColor: '#2e2e2e' }} />
              <Link href="/dashboard/login" className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/5" style={{ color: '#888888' }}>
                Staff Login
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
