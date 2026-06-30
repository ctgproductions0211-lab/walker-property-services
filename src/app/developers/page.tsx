import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'For Real Estate Developers | Walker Property Services',
  description: 'Site prep, interior demolition, and debris removal for developers across Philadelphia and the tri-state area. Fast, reliable crews ready for your next project.',
}

const SERVICES = [
  {
    label: 'Interior Demolition',
    desc: 'Selective or full interior tear-outs — walls, flooring, fixtures, and non-structural elements removed cleanly and efficiently.',
  },
  {
    label: 'Lot Clearance',
    desc: 'Clearing overgrowth, debris, abandoned materials, and site obstructions before construction begins.',
  },
  {
    label: 'Construction Debris Removal',
    desc: 'Ongoing haul-away throughout your project. We work around your crew and keep the site clean.',
  },
  {
    label: 'Pre-Construction Site Prep',
    desc: 'Get the site cleared and ready before permits, contractors, and machinery arrive.',
  },
  {
    label: 'Property Acquisition Cleanouts',
    desc: 'Full cleanout of acquired properties — remove contents, junk, and old materials before renovation starts.',
  },
  {
    label: 'Post-Demo Cleanup',
    desc: 'After demolition is done, we handle the debris, dust, and material removal so the next phase can start.',
  },
]

const PHASES = [
  {
    phase: 'Acquisition',
    detail: 'Full property cleanout before renovation planning begins.',
  },
  {
    phase: 'Pre-Construction',
    detail: 'Lot clearance, site prep, and selective interior demo.',
  },
  {
    phase: 'Active Construction',
    detail: 'Ongoing debris removal and haul-away around your crew.',
  },
  {
    phase: 'Pre-Delivery',
    detail: 'Final cleanout and site prep before handoff or listing.',
  },
]

export default function DevelopersPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.jpg" alt="" aria-hidden={true} width={40} height={40} style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/services" className="text-sm" style={{ color: '#888888' }}>Services</Link>
            <Link href="/about" className="text-sm" style={{ color: '#888888' }}>About</Link>
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
        <div className="mb-16 max-w-3xl">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)' }}
          >
            For Real Estate Developers
          </div>
          <h1 className="text-4xl font-bold mb-5 leading-snug" style={{ color: '#f0f0f0' }}>
            Site Prep &amp; Demo for{' '}
            <span style={{ color: '#6B8C23' }}>Philadelphia Development Projects</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: '#888888' }}>
            Walker Property Services handles the pre-construction heavy work — interior demolition,
            lot clearance, debris removal, and site preparation — so your project timeline stays on
            track from day one.
          </p>
        </div>

        {/* Services */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color: '#888888' }}>
            What We Handle
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(({ label, desc }) => (
              <div
                key={label}
                className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(107,140,35,0.2)', border: '1px solid rgba(107,140,35,0.4)' }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#6B8C23" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <h2 className="font-semibold text-sm" style={{ color: '#f0f0f0' }}>{label}</h2>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#888888' }}>{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link href="/services" className="underline" style={{ color: '#6B8C23' }}>
              View full services list →
            </Link>
          </p>
        </div>

        {/* One Vendor, Every Phase */}
        <div
          className="rounded-xl p-6 mb-16"
          style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#888888' }}>
            One Vendor, Every Phase
          </p>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#f0f0f0' }}>
            From acquisition to delivery — we stay on the project.
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#888888' }}>
            Most developers deal with one vendor for the initial cleanout, another for demo, and another
            for ongoing debris removal. Walker Property Services can cover all of it — one call, one
            relationship, one invoice across your entire project timeline.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PHASES.map(({ phase, detail }) => (
              <div
                key={phase}
                className="rounded-lg p-4 flex flex-col gap-1"
                style={{ background: '#111111', border: '1px solid #2e2e2e' }}
              >
                <span className="text-xs font-bold" style={{ color: '#6B8C23' }}>{phase}</span>
                <span className="text-xs leading-snug" style={{ color: '#888888' }}>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why It Matters */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color: '#888888' }}>
            Why It Matters
          </p>
          <div className="flex flex-col gap-4">
            {[
              {
                heading: 'Faster Project Starts',
                body: 'No waiting to coordinate multiple vendors before demo or construction begins. One call gets the site cleared.',
              },
              {
                heading: 'Scope Flexibility',
                body: 'Projects change. We handle scope expansions without having to renegotiate with a new vendor or explain the project from scratch.',
              },
              {
                heading: 'Documented at Every Stage',
                body: 'Before-and-after photos logged to every job. Track job status in real time through your unique tracking code.',
              },
            ].map(({ heading, body }) => (
              <div
                key={heading}
                className="rounded-xl p-5 flex gap-4 items-start"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: 'rgba(107,140,35,0.2)', border: '1px solid rgba(107,140,35,0.4)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6B8C23" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <h2 className="font-bold text-sm mb-1" style={{ color: '#f0f0f0' }}>{heading}</h2>
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
            Tell Us About Your Project
          </h2>
          <p className="mb-6 max-w-lg mx-auto" style={{ color: '#888888' }}>
            Whether it&apos;s a single property acquisition or an ongoing development — describe the
            scope and we&apos;ll get back to you with a clear quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/submit"
              className="px-8 py-4 rounded-lg font-semibold transition-all hover:brightness-110 active:scale-95"
              style={{ background: '#6B8C23', color: '#ffffff' }}
            >
              Submit a Job Request
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 rounded-lg font-semibold border transition-colors hover:bg-white/5"
              style={{ color: '#6B8C23', borderColor: '#6B8C23' }}
            >
              View All Services
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
