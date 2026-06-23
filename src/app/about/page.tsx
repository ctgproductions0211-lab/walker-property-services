import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Walker Property Services',
  description: "Walker Property Services is Philadelphia's property turnover and readiness company — serving landlords, property managers, developers, and realtors across the tri-state area.",
}

const SERVICES = [
  {
    title: 'Turnovers & Cleanouts',
    desc: 'Full property and unit cleanouts, junk removal, and haul-away for landlords and managers with units to turn between tenants.',
  },
  {
    title: 'Demolition & Site Prep',
    desc: 'Interior demo, selective tear-outs, lot clearance, and pre-construction site preparation for developers and contractors.',
  },
  {
    title: 'Finishing & Prep',
    desc: 'Painting, patching, deep cleaning, and final prep to get properties rent-ready, listing-ready, or construction-ready.',
  },
]

const AUDIENCES = [
  {
    title: 'Property Managers',
    desc: 'Recurring turnover partner with fast response times and documented before/after reporting.',
    href: '/property-managers',
    cta: 'See how we help PMs →',
  },
  {
    title: 'Real Estate Developers',
    desc: 'Site prep, interior demo, and debris removal for every phase of your development project.',
    href: '/developers',
    cta: 'See how we help developers →',
  },
  {
    title: 'Landlords',
    desc: 'Fast cleanouts and turnover prep between tenants — one call covers the whole unit.',
    href: '/submit',
    cta: 'Request a quote →',
  },
  {
    title: 'Realtors & Investors',
    desc: 'Pre-listing cleanouts, estate clearances, and property prep to get listings market-ready fast.',
    href: '/submit',
    cta: 'Request a quote →',
  },
]

const DIFFERENTIATORS = [
  {
    heading: 'One Point of Contact',
    body: 'From cleanout to paint-ready, one company handles every step. One call, one relationship, one invoice — no juggling multiple vendors.',
  },
  {
    heading: 'Documented from Start to Finish',
    body: 'Every job gets a unique tracking code. Clients see real-time status updates from submission through completion, with before-and-after photo documentation.',
  },
  {
    heading: 'Built for Recurring Work',
    body: 'Whether you have one unit to turn or a full portfolio in rotation, we scale with your workload and timeline. Recurring service agreements available.',
  },
]

export default function AboutPage() {
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
        <div className="mb-16">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)' }}
          >
            Philadelphia &amp; Tri-State Area
          </div>
          <h1 className="text-4xl font-bold mb-5 max-w-2xl leading-snug" style={{ color: '#f0f0f0' }}>
            Philadelphia&apos;s Property Turnover &amp;{' '}
            <span style={{ color: '#6B8C23' }}>Readiness Company</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#888888' }}>
            Walker Property Services handles the hardest part of property transitions — cleanouts, demolition,
            turnover prep, and everything in between. We serve landlords, property managers, developers, and
            realtors across Philadelphia and the tri-state area with one goal: get the property ready, fast.
          </p>
        </div>

        {/* What We Handle */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color: '#888888' }}>
            What We Handle
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {SERVICES.map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-xl p-6 flex flex-col gap-3"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <h2 className="font-bold text-base" style={{ color: '#6B8C23' }}>{title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link href="/services" className="underline" style={{ color: '#6B8C23' }}>
              View all services →
            </Link>
          </p>
        </div>

        {/* Who We Serve */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color: '#888888' }}>
            Who We Serve
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AUDIENCES.map(({ title, desc, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="rounded-xl p-6 flex flex-col gap-3 transition-all hover:brightness-110"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <h2 className="font-bold text-base" style={{ color: '#f0f0f0' }}>{title}</h2>
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#888888' }}>{desc}</p>
                <span className="text-sm font-medium" style={{ color: '#6B8C23' }}>{cta}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Walker */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color: '#888888' }}>
            Why Walker
          </p>
          <div className="flex flex-col gap-5">
            {DIFFERENTIATORS.map(({ heading, body }, i) => (
              <div
                key={heading}
                className="rounded-xl p-6 flex gap-5 items-start"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
                  style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)' }}
                >
                  {i + 1}
                </div>
                <div>
                  <h2 className="font-bold text-base mb-1" style={{ color: '#f0f0f0' }}>{heading}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f0f0f0' }}>
            Ready to get started?
          </h2>
          <p className="mb-6 max-w-lg mx-auto" style={{ color: '#888888' }}>
            Describe your project and we&apos;ll respond with a clear quote. Free estimates, fast turnaround.
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

      <footer className="border-t border-white/10 px-6 py-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Link href="/faq" className="text-xs hover:underline" style={{ color: '#888888' }}>FAQ</Link>
          <Link href="/services" className="text-xs hover:underline" style={{ color: '#888888' }}>Services</Link>
          <Link href="/submit" className="text-xs hover:underline" style={{ color: '#888888' }}>Request a Quote</Link>
        </div>
        <p className="text-xs" style={{ color: '#888888' }}>
          © {new Date().getFullYear()} Walker Property Services · Philadelphia &amp; Tri-State Area
        </p>
      </footer>
    </div>
  )
}
