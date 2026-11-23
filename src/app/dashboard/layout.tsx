import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import { logoutStaff } from '@/lib/actions'

async function getSession() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { user: null, newCount: 0, admin: 'no' as const }
    const { data, error } = await supabase.rpc('is_admin')
    const { count } = await supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'received')
    // is_admin() missing means supabase/setup.sql has not been run yet
    return { user, newCount: count ?? 0, admin: error ? ('unknown' as const) : data ? ('yes' as const) : ('no' as const) }
  } catch {
    return { user: null, newCount: 0, admin: 'no' as const }
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, admin, newCount } = await getSession()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0d0d0d' }}>
      {user && (
        <header className="border-b border-white/10 px-4 sm:px-6 py-3 sticky top-0 z-20 backdrop-blur" style={{ background: 'rgba(13,13,13,0.9)' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0">
                <Image src="/logo.jpg" alt="" aria-hidden={true} width={34} height={34} style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
                <span className="font-semibold text-sm truncate" style={{ color: '#f0f0f0' }}>
                  <span className="hidden sm:inline">Walker Property Services · </span>Admin
                </span>
              </Link>
              <nav className="flex items-center gap-1">
                <Link href="/dashboard" className="text-xs px-2.5 py-1.5 rounded-md hover:bg-white/5 flex items-center gap-1.5" style={{ color: '#c8c8c8' }}>
                  Jobs
                  {newCount > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: '#3b82f6', color: '#fff' }}>
                      {newCount}
                    </span>
                  )}
                </Link>
                <Link href="/dashboard/pricing" className="text-xs px-2.5 py-1.5 rounded-md hover:bg-white/5" style={{ color: '#c8c8c8' }}>Pricing</Link>
                <Link href="/" target="_blank" className="hidden sm:block text-xs px-2.5 py-1.5 rounded-md hover:bg-white/5" style={{ color: '#888888' }}>View site ↗</Link>
              </nav>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs hidden md:block" style={{ color: '#888888' }}>{user.email}</span>
              <form action={logoutStaff}>
                <button
                  type="submit"
                  className="text-xs px-3 py-1.5 rounded-md border transition-colors hover:bg-white/5"
                  style={{ color: '#c8c8c8', borderColor: '#2e2e2e' }}
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {user && admin === 'unknown' && (
          <div className="mb-6 rounded-xl p-4 text-sm" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.35)', color: '#fdba74' }}>
            <strong>Database setup not finished.</strong> Run <code>supabase/setup.sql</code> in Supabase → SQL Editor so job requests are saved privately and show up here.
          </div>
        )}
        {user && admin === 'no' ? (
          <div className="max-w-md mx-auto text-center py-24">
            <h1 className="text-xl font-bold mb-2" style={{ color: '#f0f0f0' }}>No admin access</h1>
            <p className="text-sm mb-6" style={{ color: '#888888' }}>
              {user.email} is signed in but isn&apos;t on the admin list. Add it to the <code>admin_users</code> table in Supabase.
            </p>
            <form action={logoutStaff}>
              <button type="submit" className="text-sm px-4 py-2 rounded-lg" style={{ background: '#5f7d1f', color: '#fff' }}>Sign out</button>
            </form>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
