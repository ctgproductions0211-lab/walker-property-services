import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { ALL_LOCATIONS, getLocationBySlug, getNearbyLocations } from '@/lib/locations'

interface Props {
  params: Promise<{ neighborhood: string }>
}

export async function generateStaticParams() {
  return ALL_LOCATIONS.map(l => ({ neighborhood: l.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood } = await params
  const location = getLocationBySlug(neighborhood)
  if (!location) return {}
  return {
    title: `Junk Removal & Property Cleanouts in ${location.name} | Walker Property Services`,
    description: `Walker Property Services provides junk removal, property cleanouts, and demolition in ${location.name}, ${location.region}. Fast scheduling, clear pricing, and before/after documentation.`,
  }
}

const REGION_INTRO: Record<string, string> = {
  'Philadelphia': 'Philadelphia is our home market. We know the rowhouses, the multi-unit buildings, and the neighborhoods — and we show up on time.',
  'The Main Line': 'We serve the Main Line with the same speed and professionalism expected in this market. Estate cleanouts, renovation debris, and rental turnovers handled cleanly.',
  'Delaware County': 'Delaware County is a core part of our service area. Fast scheduling and clear pricing for homeowners, landlords, and investors throughout DelCo.',
  'Montgomery County': 'From Norristown to King of Prussia, we handle cleanouts, light demolition, and property prep throughout Montgomery County.',
  'Bucks County': 'We serve Bucks County with direct scheduling and reliable crews. Some outer Bucks locations may have limited availability — contact us to confirm.',
  'South Jersey': 'Walker Property Services crosses the bridge for South Jersey jobs. Cherry Hill, Camden, Voorhees, and surrounding communities are in regular rotation.',
  'Delaware': 'We take select projects in Delaware. Wilmington and Newark are our primary Delaware markets — contact us to discuss availability for your project.',
}

export default async function NeighborhoodPage({ params }: Props) {
  const { neighborhood } = await params
  const location = getLocationBySlug(neighborhood)
  if (!location) notFound()

  const nearby = getNearbyLocations(location)
  const regionIntro = REGION_INTRO[location.region] ?? `Walker Property Services serves ${location.name} and the surrounding ${location.region} area.`

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.jpg" alt="" aria-hidden={true} width={40} height={40} priority style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/locations" className="text-sm" style={{ color: '#888888' }}>All Areas</Link>
            <Link href="/submit" className="text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110" style={{ background: '#6B8C23', color: '#ffffff' }}>Get a Quote</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <div className="mb-4">
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#6B8C23' }}>{location.region}</span>
        </div>

        <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ color: '#f0f0f0' }}>
          Junk Removal &amp; Property Services<br />
          <span style={{ color: '#6B8C23' }}>in {location.name}</span>
        </h1>

        <p className="text-lg mb-10 leading-relaxed max-w-2xl" style={{ color: '#888888' }}>
          {regionIntro}
        </p>

        {/* Services */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: '#888888' }}>What We Do</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Property Cleanouts', desc: 'Full residential and commercial cleanouts — furniture, junk, debris, everything.' },
              { title: 'Junk Removal', desc: 'Bulk items, appliances, construction debris. One truck covers it all.' },
              { title: 'Light Demolition', desc: 'Interior teardowns, drywall, flooring — gutting a space for renovation.' },
              { title: 'Turnover Prep', desc: 'Get a vacant unit rental-ready: clean, cleared, and move-in condition.' },
              { title: 'Estate Cleanouts', desc: 'Compassionate, efficient handling of estate and inherited property clearances.' },
              { title: 'Site Preparation', desc: 'Pre-construction clearing, lot cleanup, and exterior removal.' },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-xl p-5" style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}>
                <h2 className="font-semibold text-sm mb-1" style={{ color: '#f0f0f0' }}>{title}</h2>
                <p className="text-xs leading-relaxed" style={{ color: '#888888' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl p-8 mb-12 text-center" style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f0f0f0' }}>Need service in {location.name}?</h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: '#888888' }}>
            Submit a request and we&apos;ll respond with a clear quote, fast.
          </p>
          <Link href="/submit" className="inline-block px-8 py-4 rounded-lg font-semibold transition-all hover:brightness-110" style={{ background: '#6B8C23', color: '#ffffff' }}>
            Get a Free Quote
          </Link>
        </div>

        {/* Nearby areas */}
        {nearby.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#888888' }}>Also Serving Nearby</p>
            <div className="flex flex-wrap gap-2">
              {nearby.map(l => (
                <Link key={l.slug} href={`/locations/${l.slug}`} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:bg-white/5" style={{ border: '1px solid #2e2e2e', color: '#888888' }}>
                  {l.name}
                </Link>
              ))}
              <Link href="/locations" className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ border: '1px solid rgba(107,140,35,0.3)', color: '#6B8C23' }}>
                All areas →
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
