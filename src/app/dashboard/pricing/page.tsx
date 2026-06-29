import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PricingEditor from './_components/PricingEditor'

export const metadata: Metadata = {
  title: 'Pricing Reference — Walker Dashboard',
  robots: { index: false, follow: false },
}

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/dashboard/login')

  const { data } = await supabase
    .from('pricing_notes')
    .select('content')
    .eq('id', 'main')
    .single()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#f0f0f0' }}>Pricing Reference</h1>
        <p className="text-sm" style={{ color: '#888888' }}>
          Internal notes — paste pricing structures, load tiers, material upcharges, and item rates here.
          This page is never visible to customers and is not indexed by search engines.
        </p>
      </div>

      <PricingEditor initialContent={data?.content ?? ''} />
    </div>
  )
}
