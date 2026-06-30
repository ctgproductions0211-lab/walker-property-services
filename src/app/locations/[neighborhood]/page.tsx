import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { ALL_LOCATIONS, getLocationBySlug, getNearbyLocations } from '@/lib/locations'

interface Props {
  params: Promise<{ neighborhood: string }>
}

export function generateStaticParams() {
  return ALL_LOCATIONS.map(l => ({ neighborhood: l.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood: slug } = await params
  const location = getLocationBySlug(slug)
  if (!location) return {}

  const description = location.distanceNote
    ? `Walker Property Services covers ${location.name} for larger projects — full cleanouts, demolition, and dumpster rentals. Contact us to confirm scope and availability.`
    : `Cleanouts, demolition, and property turnovers in ${location.name}, ${location.region}. Fast service for landlords, investors, and homeowners. Free estimates.`

  return {
    title: `${location.name} Property Cleanouts & Demolition | Walker Property Services`,
    description,
  }
}

const SERVICES = [
  'Junk Removal & Property Cleanouts',
  'Interior & Selective Demolition',
  'Apartment & Tenant Turnovers',
  'Estate Cleanouts',
  'Dumpster Rentals',
  'Commercial & Office Cleanouts',
]

const REGION_INTRO: Record<string, string> = {
  'Philadelphia':      'the dense row homes, apartments, and mixed-use properties of',
  'The Main Line':     'the established estates and single-family homes throughout',
  'Delaware County':   'the residential neighborhoods and commercial corridors of',
  'Montgomery County': 'the suburban homes and commercial properties throughout',
  'Bucks County':      'the residential communities and properties across',
  'South Jersey':      'homes and commercial properties throughout',
  'Delaware':          'properties throughout',
}

export default async function NeighborhoodPage({ params }: Props) {
  const { neighborhood: slug } = await params
  const location = getLocationBySlug(slug)
  if (!location) notFound()

  const nearby = getNearbyLocations(location)
  const intro = REGION_INTRO[location.region] ?? 'properties in'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.jpg" alt="" aria-hidden={true} width={40} height={40} style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/services" className="text-sm hidden sm:block" style={{ color: '#888888' }}>Services</Link>
            <Link
              href="/submit"
              className="text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110"
              style={{ background: '#6B8C23', color: '#ffffff' }}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#888888' }}>
          <Link href="/locations" className="hover:underline" style={{ color: '#6B8C23' }}>Service Areas</Link>
          <span>/</span>
          <span>{location.region}</span>
          <span>/</span>
          <span>{location.name}</span>
        </div>

        {/* Hero */}
        <div className="mb-12">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)' }}
          >
            {location.region}
          </div>
          <h1 className="text-4xl font-bold mb-5 leading-snug" style={{ color: '#f0f0f0' }}>
            {location.name} Property Cleanouts &amp; Demolition
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#888888' }}>
            Walker Property Services handles cleanouts, demolition, and property turnovers across{' '}
            {intro} {location.name}. We work with landlords, property managers, investors, and
            homeowners — and we respond fast.
          </p>
        </div>

        {/* Services */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6" style={{ color: '#f0f0f0' }}>
            Services in {location.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICES.map(service => (
              <div
                key={service}
                className="flex items-center gap-3 rounded-lg px-4 py-3"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#6B8C23' }} />
                <span className="text-sm" style={{ color: '#f0f0f0' }}>{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distance note */}
        {location.distanceNote && (
          <div
            className="rounded-xl p-5 mb-12"
            style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>
              <span className="font-semibold" style={{ color: '#6B8C23' }}>Service note: </span>
              {location.distanceNote}
            </p>
          </div>
        )}

        {/* Nearby areas */}
        {nearby.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-5" style={{ color: '#f0f0f0' }}>
              Nearby Areas We Also Serve
            </h2>
            <div className="flex flex-wrap gap-2">
              {nearby.map(n => (
                <Link
                  key={n.slug}
                  href={`/locations/${n.slug}`}
                  className="text-sm px-4 py-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ background: '#1c1c1c', border: '1px solid #2e2e2e', color: '#888888' }}
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f0f0f0' }}>
            Need a Cleanout or Demo in {location.name}?
          </h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: '#888888' }}>
            Free estimates across all service areas. Tell us about your property and we&apos;ll
            get back to you fast.
          </p>
          <Link
            href="/submit"
            className="inline-block px-8 py-4 rounded-lg font-semibold transition-all hover:brightness-110 active:scale-95"
            style={{ background: '#6B8C23', color: '#ffffff' }}
          >
            Request a Free Estimate
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
