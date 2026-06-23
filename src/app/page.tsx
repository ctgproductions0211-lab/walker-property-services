import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #111111 0%, #1c1c1c 100%)' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" aria-hidden="true" style={{ height: '40px', width: '40px', objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold text-lg tracking-wide" style={{ color: '#f0f0f0' }}>
              Walker Property Services
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/services" className="text-sm" style={{ color: '#888888' }}>
              Services
            </Link>
            <Link href="/about" className="text-sm" style={{ color: '#888888' }}>
              About
            </Link>
            <Link href="/faq" className="text-sm" style={{ color: '#888888' }}>
              FAQ
            </Link>
            <Link
              href="/dashboard/login"
              className="text-sm px-3 py-1.5 rounded border transition-colors hover:bg-white/5"
              style={{ color: '#888888', borderColor: '#2e2e2e' }}
            >
              Staff Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpg" alt="Walker Property Services" style={{ height: '150px', width: '150px', objectFit: 'contain', marginBottom: '24px', mixBlendMode: 'screen' }} />
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)' }}
        >
          Philadelphia &amp; Surrounding Areas
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-4 max-w-3xl" style={{ color: '#f0f0f0' }}>
          Property Turnovers, Cleanouts &amp; Demolition{' '}
          <span style={{ color: '#6B8C23' }}>in Philadelphia.</span>
        </h1>

        <p className="text-xl font-semibold mb-12 max-w-md" style={{ color: '#f0f0f0' }}>
          One call. One invoice. One vendor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link
            href="/submit"
            className="flex-1 px-8 py-4 rounded-lg font-semibold text-center text-base transition-all hover:brightness-110 active:scale-95"
            style={{ background: '#6B8C23', color: '#ffffff' }}
          >
            Request a Job
          </Link>
          <Link
            href="/track"
            className="flex-1 px-8 py-4 rounded-lg font-semibold text-center text-base border transition-colors hover:bg-white/5"
            style={{ color: '#6B8C23', borderColor: '#6B8C23' }}
          >
            Track My Job
          </Link>
        </div>
      </main>

      {/* Who We Serve */}
      <section className="border-t border-white/10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest font-semibold mb-6 text-center" style={{ color: '#888888' }}>
            Who We Serve
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Property Managers',
                desc: 'Recurring turnover partner with documented before/after reporting and fast scheduling.',
                href: '/property-managers',
              },
              {
                title: 'Real Estate Developers',
                desc: 'Site prep, interior demolition, and debris removal across every phase of development.',
                href: '/developers',
              },
              {
                title: 'Landlords & Realtors',
                desc: 'Fast cleanouts, turnover prep, and painting between tenants and listings.',
                href: '/about',
              },
            ].map(({ title, desc, href }) => (
              <Link
                key={title}
                href={href}
                className="rounded-xl p-5 flex flex-col gap-2 transition-all hover:brightness-110"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <span className="font-semibold text-sm" style={{ color: '#6B8C23' }}>{title}</span>
                <span className="text-xs leading-relaxed" style={{ color: '#888888' }}>{desc}</span>
                <span className="text-xs mt-2" style={{ color: '#6B8C23' }}>Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="border-t border-white/10 px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Cleanout',      desc: 'Full property cleanouts' },
            { label: 'Light Demo',    desc: 'Interior demolition' },
            { label: 'Turnover Prep', desc: 'Rental-ready preparation' },
            { label: 'Site Prep',     desc: 'Pre-construction clearing' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-semibold text-sm" style={{ color: '#6B8C23' }}>{label}</span>
              <span className="text-xs" style={{ color: '#888888' }}>{desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
