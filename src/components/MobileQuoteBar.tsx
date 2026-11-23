'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const HIDDEN_ON = ['/submit', '/confirmation']

export default function MobileQuoteBar() {
  const pathname = usePathname()
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null

  return (
    <div
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 px-4 pt-3 border-t border-white/10 backdrop-blur"
      style={{ background: 'rgba(13,13,13,0.92)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex gap-2">
        <Link
          href="/submit"
          className="flex-1 text-center py-3 rounded-xl font-semibold text-sm"
          style={{ background: '#6B8C23', color: '#fff' }}
        >
          Get a Free Quote
        </Link>
        <Link
          href="/track"
          className="px-4 py-3 rounded-xl font-semibold text-sm border"
          style={{ color: '#e0e0e0', borderColor: '#333' }}
        >
          Track
        </Link>
      </div>
    </div>
  )
}
