import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import type { Job } from '@/types'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Request Received | Walker Property Services',
  description: "Your job request has been submitted. We'll follow up with a free estimate shortly.",
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ code?: string }>
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { code } = await searchParams

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#111111' }}>
        <div className="text-center">
          <p style={{ color: '#888888' }}>No confirmation code found.</p>
          <Link href="/submit" className="underline mt-4 block" style={{ color: '#6B8C23' }}>Submit a job</Link>
        </div>
      </div>
    )
  }

  // Fetch the job to get AI quote data
  const supabase = await createClient()
  const { data } = await supabase.from('jobs').select('*').eq('tracking_code', code).single()
  const job = data as Job | null

  const hasAIQuote = job?.ai_quote_low && job?.ai_quote_high

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        {/* Checkmark */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(107,140,35,0.15)', border: '2px solid #6B8C23' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6B8C23" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3" style={{ color: '#f0f0f0' }}>Request Received!</h1>
        <p className="mb-8" style={{ color: '#888888' }}>
          We&apos;ve got your job request and will be in touch soon to confirm your quote.
          Save your tracking code below — you&apos;ll need it to check your job status.
        </p>

        {/* Tracking code display */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: '#888888' }}>
            Your Tracking Code
          </p>
          <div
            className="text-4xl font-bold tracking-widest py-3 px-6 rounded-lg inline-block"
            style={{ background: 'rgba(107,140,35,0.1)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)', fontFamily: 'monospace' }}
          >
            {code}
          </div>
          <p className="text-xs mt-3" style={{ color: '#888888' }}>
            Screenshot or write this down — you&apos;ll use it to track your job
          </p>
        </div>

        {/* AI Quote Estimate */}
        {hasAIQuote && (
          <div
            className="rounded-xl p-6 mb-6 text-left"
            style={{ background: '#1c1c1c', border: '1px solid rgba(107,140,35,0.35)' }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#888888' }}>
              Estimated Quote Range
            </p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold" style={{ color: '#6B8C23' }}>
                ${job!.ai_quote_low!.toLocaleString()} – ${job!.ai_quote_high!.toLocaleString()}
              </span>
            </div>
            {job?.ai_analysis?.reasoning && (
              <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>
                {job.ai_analysis.reasoning}
              </p>
            )}
            <p className="text-xs mt-3 pt-3" style={{ color: '#888888', borderTop: '1px solid #2e2e2e' }}>
              ✦ This is an AI-generated estimate based on your photos and description.
              Your final quote may vary after our team reviews your request.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href={`/track/${code}`}
            className="w-full py-3 rounded-lg font-semibold text-center transition-all hover:brightness-110"
            style={{ background: '#6B8C23', color: '#ffffff' }}
          >
            Track This Job
          </Link>
          <Link
            href="/"
            className="w-full py-3 rounded-lg font-semibold text-center border transition-colors hover:bg-white/5"
            style={{ color: '#6B8C23', borderColor: '#6B8C23' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}
