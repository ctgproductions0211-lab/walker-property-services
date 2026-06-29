import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { logoutStaff } from '@/lib/actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      {/* Top nav */}
      <header className="border-b border-white/10 px-6 py-3 sticky top-0 z-10" style={{ background: '#111111' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="" aria-hidden="true" style={{ height: '36px', width: '36px', objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
              <span className="font-semibold text-sm" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
            </Link>
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23' }}
            >
              Internal Dashboard
            </span>
            <Link
              href="/dashboard/pricing"
              className="text-xs hover:underline hidden sm:block"
              style={{ color: '#888888' }}
            >
              Pricing Ref
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm hidden sm:block" style={{ color: '#888888' }}>{user.email}</span>
            )}
            <form action={logoutStaff}>
              <button
                type="submit"
                className="text-sm px-3 py-1.5 rounded border transition-colors hover:bg-white/5"
                style={{ color: '#888888', borderColor: '#2e2e2e' }}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  )
}
