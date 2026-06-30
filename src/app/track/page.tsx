import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Track Your Job | Walker Property Services',
  description: 'Look up the status of your Walker Property Services job request using your tracking code.',
  robots: { index: false, follow: false },
}

async function handleLookup(formData: FormData) {
  'use server'
  const code = (formData.get('code') as string)?.trim().toUpperCase()
  if (code) redirect(`/track/${code}`)
}

export default function TrackPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.jpg" alt="" aria-hidden={true} width={40} height={40} style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(107,140,35,0.15)', border: '1px solid rgba(107,140,35,0.3)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8C23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#f0f0f0' }}>Track Your Job</h1>
            <p style={{ color: '#888888' }}>Enter the tracking code from your confirmation.</p>
          </div>

          <form action={handleLookup} className="flex flex-col gap-4">
            <input
              name="code"
              required
              placeholder="e.g. WPS-ABC123"
              autoComplete="off"
              style={{
                background: '#1c1c1c',
                border: '1px solid #2e2e2e',
                color: '#f0f0f0',
                borderRadius: '8px',
                padding: '14px 16px',
                width: '100%',
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '0.1em',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="w-full py-4 rounded-lg font-semibold text-base transition-all hover:brightness-110"
              style={{ background: '#6B8C23', color: '#ffffff' }}
            >
              Look Up Job
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            <Link href="/submit" style={{ color: '#6B8C23' }} className="underline">
              Submit a new job request
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
