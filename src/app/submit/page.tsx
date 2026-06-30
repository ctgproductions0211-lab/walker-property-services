import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import SubmitForm from './_components/SubmitForm'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Request a Free Quote | Walker Property Services',
  description: 'Get a fast, free estimate for property cleanouts, demolition, and turnovers in Philadelphia. Submit photos and details for a personalized quote.',
}

export default function SubmitPage() {
  return (
    <div className="min-h-screen" style={{ background: '#111111' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="" aria-hidden="true" style={{ height: '40px', width: '40px', objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
          <Link href="/track" className="text-sm" style={{ color: '#888888' }}>
            Track a job
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#f0f0f0' }}>Request a Job</h1>
          <p style={{ color: '#888888' }}>
            Fill in the details below and we&apos;ll get back to you with a quote.
          </p>
        </div>

        <Suspense fallback={null}>
          <SubmitForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
