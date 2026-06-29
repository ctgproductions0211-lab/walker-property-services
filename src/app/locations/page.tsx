import Link from 'next/link'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Service Areas — Walker Property Services',
  description: 'Walker Property Services proudly serves Philadelphia and the Main Line, with extended service throughout the Pennsylvania, New Jersey, and Delaware tri-state area.',
}

const AREAS = [
  {
    region: 'Philadelphia',
    locations: [
      'Center City', 'North Philadelphia', 'South Philadelphia', 'West Philadelphia',
      'Northeast Philadelphia', 'Germantown', 'Kensington', 'Fishtown',
      'Manayunk', 'Chestnut Hill', 'Roxborough',
    ],
  },
  {
    region: 'The Main Line',
    locations: [
      'Ardmore', 'Haverford', 'Bryn Mawr', 'Wayne', 'Paoli',
      'Malvern', 'Berwyn', 'Devon', 'Radnor', 'Villanova',
    ],
  },
  {
    region: 'Delaware County',
    locations: [
      'Media', 'Upper Darby', 'Chester', 'Springfield', 'Ridley Park',
      'Drexel Hill', 'Swarthmore', 'Brookhaven',
    ],
  },
  {
    region: 'Montgomery County',
    locations: [
      'Norristown', 'King of Prussia', 'Lansdale', 'Horsham', 'Ambler',
      'Jenkintown', 'Abington', 'Conshohocken', 'Plymouth Meeting',
    ],
  },
  {
    region: 'Bucks County',
    locations: [
      'Doylestown', 'Bensalem', 'Bristol', 'Levittown', 'Langhorne',
      'Newtown', 'Yardley', 'Warminster',
    ],
  },
  {
    region: 'South Jersey',
    locations: [
      'Camden', 'Cherry Hill', 'Voorhees', 'Moorestown', 'Mount Laurel',
      'Marlton', 'Haddonfield', 'Collingswood',
    ],
  },
  {
    region: 'Delaware',
    locations: [
      'Wilmington', 'Newark', 'New Castle', 'Middletown',
    ],
  },
]

export default function LocationsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" aria-hidden="true" style={{ height: '40px', width: '40px', objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/services" className="text-sm" style={{ color: '#888888' }}>Services</Link>
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">

        {/* Hero */}
        <div className="mb-12">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)' }}
          >
            Service Areas
          </div>
          <h1 className="text-4xl font-bold mb-5 leading-snug" style={{ color: '#f0f0f0' }}>
            Where We Work
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#888888' }}>
            Walker Property Services proudly serves Philadelphia and the Main Line, with extended service throughout the Pennsylvania, New Jersey, and Delaware tri-state area.
          </p>
        </div>

        {/* Area grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {AREAS.map(({ region, locations }) => (
            <div
              key={region}
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
            >
              <h2 className="font-bold text-sm" style={{ color: '#6B8C23' }}>{region}</h2>
              <ul className="flex flex-col gap-1.5">
                {locations.map(loc => (
                  <li key={loc} className="flex items-center gap-2">
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: '#6B8C23' }}
                    />
                    <span className="text-xs" style={{ color: '#888888' }}>{loc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Not listed callout */}
        <div
          className="rounded-xl p-6 mb-16 text-center"
          style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
        >
          <p className="text-sm mb-1" style={{ color: '#f0f0f0' }}>Don&apos;t see your city?</p>
          <p className="text-sm mb-4" style={{ color: '#888888' }}>
            Submit a request with your address — we&apos;ll confirm availability and get you a quote.
          </p>
          <Link
            href="/submit"
            className="inline-block text-sm underline"
            style={{ color: '#6B8C23' }}
          >
            Submit a job request →
          </Link>
        </div>

        {/* CTA */}
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f0f0f0' }}>
            Ready to Schedule?
          </h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: '#888888' }}>
            Free estimates across all service areas. Tell us about your property and we&apos;ll respond fast.
          </p>
          <Link
            href="/submit"
            className="inline-block px-8 py-4 rounded-lg font-semibold transition-all hover:brightness-110 active:scale-95"
            style={{ background: '#6B8C23', color: '#ffffff' }}
          >
            Request a Free Quote
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
