import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SERVICE_CATEGORIES, getCategoryBySlug } from '@/lib/services'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map(c => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.title} — Walker Property Services`,
    description: category.shortDescription,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const categoryIndex = SERVICE_CATEGORIES.findIndex(c => c.slug === slug)
  const prev = categoryIndex > 0 ? SERVICE_CATEGORIES[categoryIndex - 1] : null
  const next = categoryIndex < SERVICE_CATEGORIES.length - 1 ? SERVICE_CATEGORIES[categoryIndex + 1] : null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" aria-hidden="true" style={{ height: '40px', width: '40px', objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
          <Link
            href="/submit"
            className="text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110"
            style={{ background: '#6B8C23', color: '#ffffff' }}
          >
            Get a Quote
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#888888' }}>
          <Link href="/services" className="hover:underline" style={{ color: '#6B8C23' }}>Services</Link>
          <span>/</span>
          <span>{category.title}</span>
        </div>

        {/* Page content */}
        <div
          className="rounded-xl p-8 mb-8"
          style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
        >
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#f0f0f0' }}>
            {category.title}
          </h1>

          <p className="text-base leading-relaxed mb-8" style={{ color: '#888888' }}>
            {category.intro}
          </p>

          {/* Services list */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#888888' }}>
              Services Include
            </p>
            <ul className="flex flex-col gap-3">
              {category.items.map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(107,140,35,0.2)', border: '1px solid rgba(107,140,35,0.4)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6B8C23" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-base" style={{ color: '#f0f0f0' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-6 border-t" style={{ borderColor: '#2e2e2e' }}>
            <p className="text-sm mb-4" style={{ color: '#888888' }}>
              Ready to get started? Request a free estimate — we respond fast.
            </p>
            <Link
              href="/submit"
              className="inline-block px-8 py-4 rounded-lg font-semibold transition-all hover:brightness-110 active:scale-95"
              style={{ background: '#6B8C23', color: '#ffffff' }}
            >
              Request a Quote
            </Link>
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <div className="grid grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/services/${prev.slug}`}
                className="rounded-xl p-4 transition-all hover:brightness-110"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <p className="text-xs mb-1" style={{ color: '#6B8C23' }}>← Previous</p>
                <p className="text-sm font-medium" style={{ color: '#f0f0f0' }}>{prev.title}</p>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                href={`/services/${next.slug}`}
                className="rounded-xl p-4 text-right transition-all hover:brightness-110"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <p className="text-xs mb-1" style={{ color: '#6B8C23' }}>Next →</p>
                <p className="text-sm font-medium" style={{ color: '#f0f0f0' }}>{next.title}</p>
              </Link>
            ) : <div />}
          </div>
        )}

        {/* Back to all services */}
        <div className="mt-6 text-center">
          <Link href="/services" className="text-sm underline" style={{ color: '#888888' }}>
            ← All Services
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
