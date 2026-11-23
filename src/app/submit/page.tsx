import { Suspense } from 'react'
import type { Metadata } from 'next'
import SubmitForm from './_components/SubmitForm'
import { AI_ESTIMATES_ENABLED } from '@/lib/features'
import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'
import JsonLd from '@/components/JsonLd'
import { getSiteUrl } from '@/lib/site-url'
import { breadcrumbJsonLd, pageJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Request a Free Quote | Walker Property Services',
  description: 'Get a free quote for junk removal, cleanouts, demolition, or a dumpster rental in Philadelphia. Send photos and details — it takes two minutes.',
  alternates: { canonical: '/submit' },
}

export default function SubmitPage() {
  return (
    <div className="min-h-screen" style={{ background: '#111111' }}>
      <SiteHeader />
      <JsonLd data={pageJsonLd([
    breadcrumbJsonLd([{ name: 'Request a Quote', path: '/submit' }]),
    { '@type': 'ContactPage', name: 'Request a free quote', url: `${getSiteUrl()}/submit` },
  ])} />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#f0f0f0' }}>Request a Job</h1>
          <p style={{ color: '#888888' }}>
            Fill in the details below and we&apos;ll get back to you with a quote.
          </p>
        </div>

        <Suspense fallback={null}>
          <SubmitForm instantEstimates={AI_ESTIMATES_ENABLED} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
