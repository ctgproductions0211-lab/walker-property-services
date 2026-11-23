import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import JunkTruckAnimation from '@/components/JunkTruckAnimation'
import { SERVICE_CATEGORIES } from '@/lib/services'
import { LOCATION_REGIONS } from '@/lib/locations'
import { businessJsonLd, NORTHEAST_PHILLY } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Walker Property Services | Philadelphia Junk Removal & Property Cleanouts',
  description: 'Junk removal, property cleanouts, demolition, and dumpster rentals across Philadelphia, Northeast Philadelphia, and the tri-state area. Free estimates — fast response for landlords, investors, and homeowners.',
  alternates: { canonical: '/' },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  ...businessJsonLd([
    'Philadelphia', 'Northeast Philadelphia', ...NORTHEAST_PHILLY.neighborhoods,
    'Center City Philadelphia', 'The Main Line', 'Delaware County, PA', 'Montgomery County, PA',
    'Bucks County, PA', 'Camden County, NJ', 'New Castle County, DE',
  ]),
}

const GREEN = '#6B8C23'
const GREEN_LIGHT = '#9cc23a'

const NAV = [
  { href: '/services',  label: 'Services' },
  { href: '/locations', label: 'Service Areas' },
  { href: '/about',     label: 'About' },
  { href: '/faq',       label: 'FAQ' },
  { href: '/track',     label: 'Track a Job' },
]

const STEPS = [
  { title: 'Tell us about the job', desc: 'Send the address, a quick description, and a few photos. Takes about two minutes.' },
  { title: 'Get your quote fast',   desc: 'Photos get you an instant estimate range, then we confirm a firm price with you.' },
  { title: 'We clear it out',       desc: 'Our crew shows up, does the work, and leaves the space clean. Track progress online anytime.' },
]

const REASONS = [
  { title: 'One vendor for everything', desc: 'Cleanouts, demo, painting, and prep — one call, one invoice, one crew to manage.' },
  { title: 'Free estimates',            desc: 'No cost to get a quote. Send photos for the fastest, most accurate number.' },
  { title: 'Before & after documentation', desc: 'Photo records of every job — useful for property managers, owners, and insurers.' },
  { title: 'Online job tracking',       desc: 'Every request gets a tracking code so you always know where your job stands.' },
]

const AUDIENCES = [
  { title: 'Property Managers',     desc: 'A recurring turnover partner with documented before/after reporting and fast scheduling.', href: '/property-managers' },
  { title: 'Real Estate Developers', desc: 'Site prep, interior demolition, and debris removal across every phase of development.', href: '/developers' },
  { title: 'Landlords & Homeowners', desc: 'Fast cleanouts, turnover prep, and painting between tenants, listings, or a move.', href: '/about' },
]

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#0d0d0d' }}>

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur" style={{ background: 'rgba(13,13,13,0.85)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2.5 min-w-0">
              <Image src="/logo.jpg" alt="" aria-hidden={true} width={40} height={40} priority style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
              <span className="font-semibold tracking-wide truncate text-sm sm:text-base" style={{ color: '#f0f0f0' }}>
                Walker Property Services
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm transition-colors hover:text-white" style={{ color: '#a0a0a0' }}>
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/dashboard/login"
                className="hidden lg:block text-sm px-3 py-2 rounded-lg border transition-colors hover:bg-white/5"
                style={{ color: '#c8c8c8', borderColor: '#2e2e2e' }}
              >
                Staff Login
              </Link>
              <Link
                href="/submit"
                className="text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110"
                style={{ background: GREEN, color: '#fff' }}
              >
                Free Quote
              </Link>
              <details className="lg:hidden relative">
                <summary
                  className="list-none cursor-pointer p-2 rounded-lg border [&::-webkit-details-marker]:hidden"
                  style={{ borderColor: '#2e2e2e', color: '#f0f0f0' }}
                  aria-label="Open menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-56 rounded-xl p-2 shadow-2xl" style={{ background: '#161616', border: '1px solid #2e2e2e' }}>
                  {NAV.map(({ href, label }) => (
                    <Link key={href} href={href} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-white/5" style={{ color: '#e0e0e0' }}>
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

        {/* Hero */}
        <section className="relative px-4 sm:px-6 pt-6 pb-8 lg:py-8 overflow-hidden lg:min-h-[calc(100svh-65px)] lg:flex lg:items-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 75% 30%, rgba(107,140,35,0.20), transparent 70%)' }}
          />
          <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div
                className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 lg:mb-5"
                style={{ background: 'rgba(107,140,35,0.15)', color: GREEN_LIGHT, border: '1px solid rgba(107,140,35,0.35)' }}
              >
                Philadelphia · Main Line · PA · NJ · DE
              </div>

              <h1 className="text-[28px] sm:text-4xl lg:text-[42px] xl:text-5xl font-bold leading-[1.12] tracking-tight mb-3 lg:mb-4" style={{ color: '#f5f5f5' }}>
                Cleanouts, demolition &amp; property prep —{' '}
                <span style={{ color: GREEN_LIGHT }}>done right, done fast.</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-4 lg:mb-6" style={{ color: '#a8a8a8' }}>
                <span className="hidden sm:inline">Walker Property Services clears, guts, and preps properties across Philadelphia and the tri-state area. </span>
                <span className="sm:hidden">Philadelphia &amp; tri-state cleanouts, demo, and prep. </span>
                One call. One invoice. One vendor.
              </p>

              <div className="grid grid-cols-2 sm:flex gap-2.5 sm:gap-3 justify-center lg:justify-start max-w-md sm:max-w-none mx-auto lg:mx-0">
                <Link
                  href="/submit"
                  className="px-4 sm:px-7 py-3 lg:py-3.5 rounded-xl font-semibold text-sm sm:text-base text-center whitespace-nowrap transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: GREEN, color: '#fff', boxShadow: '0 10px 30px -10px rgba(107,140,35,0.6)' }}
                >
                  Get a Free Quote<span className="hidden sm:inline"> →</span>
                </Link>
                <Link
                  href="/services"
                  className="px-4 sm:px-7 py-3 lg:py-3.5 rounded-xl font-semibold text-sm sm:text-base text-center whitespace-nowrap border transition-colors hover:bg-white/5"
                  style={{ color: '#f0f0f0', borderColor: '#333' }}
                >
                  View Services
                </Link>
              </div>

              <ul className="hidden sm:grid mt-5 lg:mt-6 grid-cols-2 gap-x-4 gap-y-1.5 text-sm max-w-md mx-auto lg:mx-0 text-left" style={{ color: '#a0a0a0' }}>
                {['Free estimates', 'Instant photo quotes', 'Before & after photos', 'Track your job online'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN_LIGHT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="relative rounded-2xl lg:rounded-3xl p-4 sm:p-6 overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #161616 0%, #121212 100%)', border: '1px solid #2a2a2a', boxShadow: '0 30px 80px -30px rgba(107,140,35,0.35)' }}
            >
              <div className="flex flex-row lg:flex-col items-center justify-center gap-4 lg:gap-0 text-left lg:text-center">
                <div className="relative flex-shrink-0">
                  <div aria-hidden="true" className="absolute inset-0 rounded-full blur-2xl" style={{ background: 'rgba(107,140,35,0.25)' }} />
                  <Image
                    src="/logo.jpg"
                    alt="Walker Property Services logo"
                    width={200}
                    height={200}
                    priority
                    className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 xl:w-40 xl:h-40"
                    style={{ objectFit: 'contain', mixBlendMode: 'screen' }}
                  />
                </div>
                <div className="lg:mt-2">
                  <p className="text-xs uppercase tracking-[0.25em] font-semibold" style={{ color: '#8a8a8a' }}>
                    Junk out. Space back.
                  </p>
                  <p className="lg:hidden text-xs mt-1" style={{ color: '#6f6f6f' }}>Free estimates · Track your job online</p>
                </div>
              </div>
              <div className="mt-2 lg:mt-3 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6">
                <JunkTruckAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="What we do" title="Services built for property owners" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICE_CATEGORIES.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  className="group rounded-2xl p-6 flex flex-col gap-3 transition-all hover:-translate-y-0.5"
                  style={{ background: '#161616', border: '1px solid #2a2a2a' }}
                >
                  <span className="text-xs font-mono" style={{ color: GREEN_LIGHT }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-lg font-semibold" style={{ color: '#f0f0f0' }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#9a9a9a' }}>{c.shortDescription}</p>
                  <span className="text-sm font-medium transition-transform group-hover:translate-x-1" style={{ color: GREEN_LIGHT }}>
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 border-t border-white/10" style={{ background: '#111111' }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="How it works" title="From request to cleared out in three steps" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="rounded-2xl p-6" style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4"
                    style={{ background: 'rgba(107,140,35,0.18)', color: GREEN_LIGHT, border: '1px solid rgba(107,140,35,0.4)' }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: '#f0f0f0' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9a9a9a' }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/submit" className="inline-block px-7 py-3.5 rounded-xl font-semibold transition-all hover:brightness-110" style={{ background: GREEN, color: '#fff' }}>
                Start your request
              </Link>
            </div>
          </div>
        </section>

        {/* Why Walker */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 border-t border-white/10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2">
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: GREEN_LIGHT }}>Why Walker</p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4" style={{ color: '#f0f0f0' }}>
                Less coordinating. More getting it done.
              </h2>
              <p className="leading-relaxed" style={{ color: '#9a9a9a' }}>
                Juggling a junk hauler, a demo crew, and a painter slows every project down. We handle the whole
                job so your unit, listing, or renovation stays on schedule.
              </p>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REASONS.map((r) => (
                <div key={r.title} className="rounded-2xl p-5" style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
                  <h3 className="font-semibold mb-1.5" style={{ color: '#f0f0f0' }}>{r.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9a9a9a' }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who we serve */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 border-t border-white/10" style={{ background: '#111111' }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeading eyebrow="Who we serve" title="Trusted by the people who keep properties moving" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AUDIENCES.map(({ title, desc, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="group rounded-2xl p-6 flex flex-col gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: '#161616', border: '1px solid #2a2a2a' }}
                >
                  <h3 className="font-semibold" style={{ color: GREEN_LIGHT }}>{title}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#9a9a9a' }}>{desc}</p>
                  <span className="text-sm mt-2 transition-transform group-hover:translate-x-1" style={{ color: '#f0f0f0' }}>Learn more →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Service area */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeading eyebrow="Service area" title="Philadelphia and the tri-state area" />
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {LOCATION_REGIONS.map(({ region }) => (
                <span key={region} className="px-4 py-2 rounded-full text-sm" style={{ background: '#161616', border: '1px solid #2a2a2a', color: '#d0d0d0' }}>
                  {region}
                </span>
              ))}
            </div>
            <div className="rounded-2xl p-6 mb-8 text-left" style={{ background: '#161616', border: '1px solid rgba(107,140,35,0.35)' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#f0f0f0' }}>Junk removal &amp; cleanouts in Northeast Philadelphia</h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#9a9a9a' }}>
                We work all over the Northeast — {NORTHEAST_PHILLY.neighborhoods.slice(0, 10).join(', ')}, and more.
              </p>
              <Link href={`/locations/${NORTHEAST_PHILLY.slug}`} className="text-sm font-medium hover:underline" style={{ color: GREEN_LIGHT }}>
                Northeast Philadelphia services →
              </Link>
            </div>
            <Link href="/locations" className="text-sm font-medium hover:underline" style={{ color: GREEN_LIGHT }}>
              Find your neighborhood →
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 pb-20">
          <div
            className="max-w-5xl mx-auto rounded-3xl px-6 py-12 sm:p-14 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(107,140,35,0.25), rgba(107,140,35,0.06))', border: '1px solid rgba(107,140,35,0.35)' }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#f5f5f5' }}>Ready to clear the space?</h2>
            <p className="max-w-xl mx-auto mb-8" style={{ color: '#b0b0b0' }}>
              Send a few photos and the address — we&apos;ll get back to you with a clear, free quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/submit" className="px-8 py-4 rounded-xl font-semibold transition-all hover:brightness-110" style={{ background: GREEN, color: '#fff' }}>
                Request a Job
              </Link>
              <Link href="/track" className="px-8 py-4 rounded-xl font-semibold border transition-colors hover:bg-white/5" style={{ color: '#f0f0f0', borderColor: 'rgba(255,255,255,0.2)' }}>
                Track My Job
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center mb-10">
      <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: GREEN_LIGHT }}>{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: '#f0f0f0' }}>{title}</h2>
    </div>
  )
}
