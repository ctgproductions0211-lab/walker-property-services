import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SERVICE_CATEGORIES, getCategoryBySlug } from '@/lib/services'
import { SERVICE_SEO } from '@/lib/service-seo'
import { NORTHEAST_PHILLY } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'
import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'

interface Props {
  params: Promise<{ category: string }>
}

const GREEN = '#5f7d1f'
const GREEN_TEXT = '#9cc23a'

const AREA_LINKS = [
  { name: 'Northeast Philadelphia', slug: 'northeast-philadelphia' },
  { name: 'Center City', slug: 'center-city' },
  { name: 'South Philadelphia', slug: 'south-philadelphia' },
  { name: 'North Philadelphia', slug: 'north-philadelphia' },
  { name: 'West Philadelphia', slug: 'west-philadelphia' },
  { name: 'Fishtown', slug: 'fishtown' },
  { name: 'Ardmore', slug: 'ardmore' },
  { name: 'Upper Darby', slug: 'upper-darby' },
  { name: 'King of Prussia', slug: 'king-of-prussia' },
  { name: 'Cherry Hill', slug: 'cherry-hill' },
]

const STEPS = [
  { title: 'Send your request', desc: 'Address, a short description, and photos — about two minutes online.' },
  { title: 'Get a free quote', desc: 'We review your photos and come back with a clear price.' },
  { title: 'We get it done', desc: 'Our crew handles the work and hauls everything away. Track it online.' },
]

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map(c => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  const seo = SERVICE_SEO[slug]
  return {
    title: seo?.title ?? `${category.title} | Walker Property Services`,
    description: seo?.description ?? category.shortDescription,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title: seo?.title ?? category.title, url: `/services/${slug}`, type: 'website' },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()
  const seo = SERVICE_SEO[slug]

  const categoryIndex = SERVICE_CATEGORIES.findIndex(c => c.slug === slug)
  const prev = categoryIndex > 0 ? SERVICE_CATEGORIES[categoryIndex - 1] : null
  const next = categoryIndex < SERVICE_CATEGORIES.length - 1 ? SERVICE_CATEGORIES[categoryIndex + 1] : null

  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}/services/${slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: category.title,
        serviceType: seo?.serviceType ?? category.title,
        description: category.intro,
        url: pageUrl,
        provider: {
          '@type': 'HomeAndConstructionBusiness',
          '@id': `${siteUrl}/#business`,
          name: 'Walker Property Services',
          url: siteUrl,
        },
        areaServed: ['Philadelphia', 'Northeast Philadelphia', 'The Main Line', 'Delaware County, PA', 'Montgomery County, PA', 'Bucks County, PA', 'South Jersey', 'Delaware']
          .map((name) => ({ '@type': 'Place', name })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: category.title,
          itemListElement: category.items.map((item) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: item } })),
        },
      },
      ...(seo ? [{
        '@type': 'FAQPage',
        mainEntity: seo.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: category.title, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6" style={{ color: '#a0a0a0' }}>
          <Link href="/" className="hover:underline" style={{ color: GREEN_TEXT }}>Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/services" className="hover:underline" style={{ color: GREEN_TEXT }}>Services</Link>
          <span aria-hidden="true">/</span>
          <span>{category.title}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight" style={{ color: '#f0f0f0' }}>
          {`${category.title} in Philadelphia & the Tri-State Area`}
        </h1>
        <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: '#a8a8a8' }}>
          {category.intro}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link href="/submit" className="px-7 py-3.5 rounded-xl font-semibold text-center transition-all hover:brightness-110" style={{ background: GREEN, color: '#fff' }}>
            Get a Free Quote
          </Link>
          <Link href="/services" className="px-7 py-3.5 rounded-xl font-semibold text-center border hover:bg-white/5" style={{ color: '#f0f0f0', borderColor: '#333' }}>
            All Services
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <section className="rounded-2xl p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#f0f0f0' }}>What&apos;s included</h2>
            <ul className="flex flex-col gap-2.5">
              {category.items.map(item => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#e0e0e0' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN_TEXT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>
          {seo && (
            <section className="rounded-2xl p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: '#f0f0f0' }}>Who it&apos;s for</h2>
              <ul className="flex flex-col gap-2.5">
                {seo.whoFor.map(w => (
                  <li key={w} className="flex items-center gap-3 text-sm" style={{ color: '#e0e0e0' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GREEN_TEXT }} aria-hidden="true" />
                    {w}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5" style={{ color: '#f0f0f0' }}>How it works</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3" style={{ background: 'rgba(107,140,35,0.2)', color: GREEN_TEXT }}>{i + 1}</span>
                <h3 className="font-semibold mb-1" style={{ color: '#f0f0f0' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#a0a0a0' }}>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-2" style={{ color: '#f0f0f0' }}>{`${category.title} near you`}</h2>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#a0a0a0' }}>
            {`We provide ${category.title.toLowerCase()} across Philadelphia — including Northeast Philadelphia neighborhoods like ${NORTHEAST_PHILLY.neighborhoods.slice(0, 6).join(', ')} — plus the Main Line, Delaware, Montgomery, and Bucks Counties, South Jersey, and northern Delaware.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {AREA_LINKS.map(a => (
              <Link key={a.slug} href={`/locations/${a.slug}`} className="text-sm px-3.5 py-2 rounded-lg hover:bg-white/5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#d0d0d0' }}>
                {a.name}
              </Link>
            ))}
            <Link href="/locations" className="text-sm px-3.5 py-2 rounded-lg" style={{ border: '1px solid rgba(107,140,35,0.4)', color: GREEN_TEXT }}>
              All service areas →
            </Link>
          </div>
        </section>

        {seo && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-5" style={{ color: '#f0f0f0' }}>{`${category.title} FAQ`}</h2>
            <div className="flex flex-col gap-3">
              {seo.faqs.map(f => (
                <details key={f.q} className="rounded-xl px-5 py-4 group" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                  <summary className="cursor-pointer font-medium text-sm list-none flex justify-between gap-4" style={{ color: '#f0f0f0' }}>
                    {f.q}
                    <span className="transition-transform group-open:rotate-45" style={{ color: GREEN_TEXT }} aria-hidden="true">+</span>
                  </summary>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: '#a8a8a8' }}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="rounded-2xl p-8 text-center mb-10" style={{ background: 'rgba(107,140,35,0.1)', border: '1px solid rgba(107,140,35,0.3)' }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f0f0f0' }}>{`Need ${category.title.toLowerCase()}?`}</h2>
          <p className="mb-6 text-sm" style={{ color: '#a8a8a8' }}>Send photos and the address — your quote is free.</p>
          <Link href="/submit" className="inline-block px-8 py-4 rounded-xl font-semibold transition-all hover:brightness-110" style={{ background: GREEN, color: '#fff' }}>
            Request a Free Quote
          </Link>
        </div>

        {(prev || next) && (
          <div className="grid grid-cols-2 gap-4">
            {prev ? (
              <Link href={`/services/${prev.slug}`} className="rounded-xl p-4 transition-all hover:brightness-110" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <p className="text-xs mb-1" style={{ color: GREEN_TEXT }}>← Previous</p>
                <p className="text-sm font-medium" style={{ color: '#f0f0f0' }}>{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/services/${next.slug}`} className="rounded-xl p-4 text-right transition-all hover:brightness-110" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <p className="text-xs mb-1" style={{ color: GREEN_TEXT }}>Next →</p>
                <p className="text-sm font-medium" style={{ color: '#f0f0f0' }}>{next.title}</p>
              </Link>
            ) : <div />}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
