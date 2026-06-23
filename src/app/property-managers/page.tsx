import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Property Managers — Walker Property Services',
  description: 'Walker Property Services is the recurring turnover partner for Philadelphia property managers — fast scheduling, reliable cleanouts, and before/after documentation on every job.',
}

const SERVICES = [
  {
    label: 'Unit Cleanouts',
    desc: 'Remove everything left behind by outgoing tenants — furniture, junk, debris. We haul it all.',
  },
  {
    label: 'Turnover Prep',
    desc: 'Patching, cleaning, and light paint touch-ups to get the unit ready for the next tenant.',
  },
  {
    label: 'Junk & Bulk Removal',
    desc: 'Appliances, furniture, construction debris — one call covers it regardless of volume.',
  },
  {
    label: 'Before & After Documentation',
    desc: 'Photos logged to every job from start to finish. Share with owners or use for accounting.',
  },
  {
    label: 'Fast Scheduling',
    desc: 'We know vacancy costs money. Quick turnarounds are standard, not an upsell.',
  },
  {
    label: 'Recurring Service',
    desc: 'Consistent vendor across your portfolio. No re-vetting, no re-explaining — we know the work.',
  },
]

const STEPS = [
  {
    step: '01',
    heading: 'Submit',
    body: 'Describe the unit and upload photos if you have them. Takes two minutes.',
  },
  {
    step: '02',
    heading: 'Get a Clear Quote',
    body: "We respond fast with a firm price — no surprise charges when we show up.",
  },
  {
    step: '03',
    heading: 'Schedule It',
    body: 'Pick a time that works. We show up on time and get it done.',
  },
  {
    step: '04',
    heading: 'Documented & Done',
    body: 'Before-and-after photos on every job. Your tracking code shows status in real time.',
  },
]

export default function PropertyManagersPage() {
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
            For Property Managers
          </div>
          <h1 className="text-4xl font-bold mb-5 leading-snug" style={{ color: '#f0f0f0' }}>
            Your Recurring Turnover Partner{' '}
            <span style={{ color: '#6B8C23' }}>in Philadelphia</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: '#888888' }}>
            Vacancy costs money. Walker Property Services keeps your units moving — fast cleanouts,
            turnover prep, and complete documentation so you can close the gap between tenants and
            get back to managing, not coordinating.
          </p>
        </div>

        {/* The Problem */}
        <div
          className="rounded-xl p-6 mb-16"
          style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#888888' }}>
            Sound Familiar?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Calling three different vendors to handle one vacant unit',
              'Chasing contractors for photo documentation owners are asking for',
              'Unpredictable pricing that changes when they see the job',
              'Cleanout crews that show up late — or not at all',
              'No real-time way to know if a job is done before you drive over',
              'Starting over with a new vendor every time yours falls through',
            ].map(pain => (
              <div key={pain} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 9-6 6" /><path d="m9 9 6 6" />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>{pain}</p>
              </div>
            ))}
          </div>
          <p className="text-sm mt-5 font-medium" style={{ color: '#f0f0f0' }}>
            Walker Property Services is the single vendor that handles all of it — so you don&apos;t have to.
          </p>
        </div>

        {/* Services */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color: '#888888' }}>
            What We Do for Property Managers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(({ label, desc }) => (
              <div
                key={label}
                className="rounded-xl p-5 flex flex-col gap-2"
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
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color: '#888888' }}>
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map(({ step, heading, body }) => (
              <div
                key={step}
                className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <span className="text-xs font-bold tracking-widest" style={{ color: '#6B8C23' }}>{step}</span>
                <h2 className="font-bold text-sm" style={{ color: '#f0f0f0' }}>{heading}</h2>
                <p className="text-xs leading-relaxed" style={{ color: '#888888' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation callout */}
        <div
          className="rounded-xl p-6 mb-16 flex flex-col sm:flex-row gap-6 items-start"
          style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(107,140,35,0.15)', border: '1px solid rgba(107,140,35,0.3)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B8C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-base mb-2" style={{ color: '#f0f0f0' }}>
              Before &amp; After Documentation on Every Job
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>
              Photos are attached to every job and accessible through your tracking code. Share condition
              reports with property owners, use them for security deposit disputes, or keep them for
              your own records. No requesting files after the fact — they&apos;re already there.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f0f0f0' }}>
            Ready for a Reliable Turnover Partner?
          </h2>
          <p className="mb-6 max-w-lg mx-auto" style={{ color: '#888888' }}>
            Tell us about your property — or your portfolio. We&apos;ll respond with a clear quote, fast.
            No commitment, no obligation.
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
              href="/track"
              className="px-8 py-4 rounded-lg font-semibold border transition-colors hover:bg-white/5"
              style={{ color: '#6B8C23', borderColor: '#6B8C23' }}
            >
              Track an Existing Job
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center">
        <p className="text-sm" style={{ color: '#888888' }}>
          © {new Date().getFullYear()} Walker Property Services · Philadelphia &amp; Tri-State Area
        </p>
      </footer>
    </div>
  )
}
