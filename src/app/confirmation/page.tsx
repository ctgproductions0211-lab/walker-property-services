import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { Job } from '@/types'

interface Props {
  searchParams: Promise<{ code?: string }>
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { code } = await searchParams

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1b2a' }}>
        <div className="text-center">
          <p style={{ color: '#8a9bb0' }}>No confirmation code found.</p>
          <Link href="/submit" className="underline mt-4 block" style={{ color: '#c9a558' }}>Submit a job</Link>
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: '#0d1b2a' }}>
      <div className="max-w-md w-full text-center">
        {/* Checkmark */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(201,165,88,0.15)', border: '2px solid #c9a558' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c9a558" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3" style={{ color: '#f5f7fa' }}>Request Received!</h1>
        <p className="mb-8" style={{ color: '#8a9bb0' }}>
          We&apos;ve got your job request and will be in touch soon to confirm your quote.
          Save your tracking code below — you&apos;ll need it to check your job status.
        </p>

        {/* Tracking code display */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: '#1a2f4a', border: '1px solid #243d60' }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: '#8a9bb0' }}>
            Your Tracking Code
          </p>
          <div
            className="text-4xl font-bold tracking-widest py-3 px-6 rounded-lg inline-block"
            style={{ background: 'rgba(201,165,88,0.1)', color: '#c9a558', border: '1px solid rgba(201,165,88,0.3)', fontFamily: 'monospace' }}
          >
            {code}
          </div>
          <p className="text-xs mt-3" style={{ color: '#8a9bb0' }}>
            Screenshot or write this down — you&apos;ll use it to track your job
          </p>
        </div>

        {/* AI Quote Estimate */}
        {hasAIQuote && (
          <div
            className="rounded-xl p-6 mb-6 text-left"
            style={{ background: '#1a2f4a', border: '1px solid rgba(201,165,88,0.35)' }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#8a9bb0' }}>
              Estimated Quote Range
            </p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold" style={{ color: '#c9a558' }}>
                ${job!.ai_quote_low!.toLocaleString()} – ${job!.ai_quote_high!.toLocaleString()}
              </span>
            </div>
            {job?.ai_analysis?.reasoning && (
              <p className="text-sm leading-relaxed" style={{ color: '#8a9bb0' }}>
                {job.ai_analysis.reasoning}
              </p>
            )}
            <p className="text-xs mt-3 pt-3" style={{ color: '#8a9bb0', borderTop: '1px solid #243d60' }}>
              ✦ This is an AI-generated estimate based on your photos and description.
              Your final quote may vary after our team reviews your request.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href={`/track/${code}`}
            className="w-full py-3 rounded-lg font-semibold text-center transition-all hover:brightness-110"
            style={{ background: '#c9a558', color: '#0d1b2a' }}
          >
            Track This Job
          </Link>
          <Link
            href="/"
            className="w-full py-3 rounded-lg font-semibold text-center border transition-colors hover:bg-white/5"
            style={{ color: '#c9a558', borderColor: '#c9a558' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
