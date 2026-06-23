import Link from 'next/link'
import type { Metadata } from 'next'
import { SERVICE_CATEGORIES } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services — Walker Property Services',
  description: 'Junk removal, demolition, cleanouts, painting, and property preparation across Philadelphia and the tri-state area.',
}

const CATEGORY_ICONS: Record<string, string> = {
  'property-turnovers-cleanouts': '🏠',
  'demolition':                   '🔨',
  'commercial-office-services':   '🏢',
  'site-exterior-services':       '🌿',
  'painting':                     '🎨',
  'property-preparation':         '✅',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#6B8C23' }}>
              <span className="font-bold text-sm" style={{ color: '#ffffff' }}>W</span>
            </div>
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/track" className="text-sm" style={{ color: '#888888' }}>Track a job</Link>
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
        {/* Page heading */}
        <div className="mb-12">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)' }}
          >
            Philadelphia &amp; Tri-State Area
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#f0f0f0' }}>Our Services</h1>
          <p className="text-lg max-w-2xl" style={{ color: '#888888' }}>
            From single apartment cleanouts to full commercial buildout cleanup — Walker Property Services
            handles the heavy work so you can move forward fast.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.map(category => (
            <Link
              key={category.slug}
              href={`/services/${category.slug}`}
              className="group rounded-xl p-6 flex flex-col gap-4 transition-all hover:brightness-110"
              style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{CATEGORY_ICONS[category.slug]}</span>
                <span
                  className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#6B8C23' }}
                >
                  View services →
                </span>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-2 leading-snug" style={{ color: '#f0f0f0' }}>
                  {category.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>
                  {category.shortDescription}
                </p>
              </div>

              <div className="mt-auto pt-2 border-t" style={{ borderColor: '#2e2e2e' }}>
                <p className="text-xs" style={{ color: '#6B8C23' }}>
                  {category.items.length} service{category.items.length !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="mt-16 rounded-xl p-8 text-center"
          style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f0f0f0' }}>
            Not sure which service you need?
          </h2>
          <p className="mb-6 max-w-lg mx-auto" style={{ color: '#888888' }}>
            Describe your project and we&apos;ll figure it out together. Free estimates, fast response.
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

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center">
        <p className="text-sm" style={{ color: '#888888' }}>
          © {new Date().getFullYear()} Walker Property Services · Philadelphia &amp; Tri-State Area
        </p>
      </footer>
    </div>
  )
}
