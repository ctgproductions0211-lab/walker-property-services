import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { JOB_TYPE_LABELS, JOB_STATUS_LABELS } from '@/types'
import type { Job } from '@/types'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Job ${code.toUpperCase()} Status | Walker Property Services`,
    description: 'Track your job request status with Walker Property Services.',
    robots: { index: false, follow: false },
  }
}

const STATUS_STEPS = ['received', 'quoted', 'scheduled', 'in_progress', 'complete'] as const

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  received:    { bg: 'rgba(59,130,246,0.15)',   text: '#93c5fd', border: 'rgba(59,130,246,0.4)' },
  quoted:      { bg: 'rgba(107,140,35,0.15)',   text: '#6B8C23', border: 'rgba(107,140,35,0.4)' },
  scheduled:   { bg: 'rgba(139,92,246,0.15)',   text: '#c4b5fd', border: 'rgba(139,92,246,0.4)' },
  in_progress: { bg: 'rgba(249,115,22,0.15)',   text: '#fdba74', border: 'rgba(249,115,22,0.4)' },
  complete:    { bg: 'rgba(34,197,94,0.15)',    text: '#86efac', border: 'rgba(34,197,94,0.4)' },
}

export default async function TrackJobPage({ params }: Props) {
  const { code } = await params
  const supabase = await createClient()

  const { data: rawJob } = await supabase
    .from('jobs')
    .select('*')
    .eq('tracking_code', code.toUpperCase())
    .single()
  const job = rawJob as Job | null

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#111111' }}>
        <div className="max-w-md w-full text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#f0f0f0' }}>Job Not Found</h1>
          <p className="mb-6" style={{ color: '#888888' }}>
            We couldn&apos;t find a job with tracking code <span style={{ color: '#6B8C23', fontFamily: 'monospace' }}>{code.toUpperCase()}</span>.
            Double-check the code and try again.
          </p>
          <Link
            href="/track"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:brightness-110"
            style={{ background: '#6B8C23', color: '#ffffff' }}
          >
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  const currentStepIndex = STATUS_STEPS.indexOf(job.status as typeof STATUS_STEPS[number])
  const colors = STATUS_COLORS[job.status]

  return (
    <div className="min-h-screen" style={{ background: '#111111' }}>
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.jpg" alt="" aria-hidden={true} width={40} height={40} style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
            <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
          </Link>
          <Link href="/track" className="text-sm" style={{ color: '#888888' }}>
            Track another
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Status badge + heading */}
        <div className="mb-8">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            {JOB_STATUS_LABELS[job.status]}
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#f0f0f0' }}>
            {JOB_TYPE_LABELS[job.job_type]}
          </h1>
          <p style={{ color: '#888888' }}>{job.property_address}</p>
        </div>

        {/* Progress tracker */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#888888' }}>
            Job Progress
          </p>
          <div className="relative">
            {/* Progress line */}
            <div
              className="absolute top-4 h-0.5"
              style={{
                left: '10%',
                right: '10%',
                background: '#2e2e2e',
              }}
            />
            <div
              className="absolute top-4 h-0.5 transition-all duration-500"
              style={{
                left: '10%',
                width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 80}%`,
                background: '#6B8C23',
              }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, i) => {
                const isDone    = i <= currentStepIndex
                const isCurrent = i === currentStepIndex
                return (
                  <div key={step} className="flex flex-col items-center gap-2" style={{ width: '20%' }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all"
                      style={{
                        background: isDone ? '#6B8C23' : '#2e2e2e',
                        color:      isDone ? '#ffffff' : '#888888',
                        border:     isCurrent ? '2px solid #7FA027' : '2px solid transparent',
                        boxShadow:  isCurrent ? '0 0 12px rgba(107,140,35,0.4)' : 'none',
                      }}
                    >
                      {i < currentStepIndex ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className="text-xs text-center leading-tight"
                      style={{ color: isDone ? '#6B8C23' : '#888888', fontWeight: isCurrent ? '600' : '400' }}
                    >
                      {JOB_STATUS_LABELS[step]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Job details */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#888888' }}>
            Job Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Detail label="Customer" value={job.customer_name} />
            <Detail label="Tracking Code" value={job.tracking_code} mono />
            <Detail label="Service Type" value={JOB_TYPE_LABELS[job.job_type]} />
            <Detail label="Submitted" value={new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <div className="sm:col-span-2">
              <Detail label="Property Address" value={job.property_address} />
            </div>
          </div>
        </div>

        {/* Quote (only shown if quoted) */}
        {job.quote_amount !== null && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.25)' }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#888888' }}>
              Your Quote
            </p>
            <p className="text-4xl font-bold" style={{ color: '#6B8C23' }}>
              ${job.quote_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm mt-1" style={{ color: '#888888' }}>Contact us to approve and schedule your job.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/submit"
            className="flex-1 py-3 rounded-lg font-semibold text-center border transition-colors hover:bg-white/5"
            style={{ color: '#6B8C23', borderColor: '#6B8C23' }}
          >
            Submit Another Job
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 rounded-lg font-semibold text-center transition-colors hover:bg-white/5"
            style={{ color: '#888888', border: '1px solid #2e2e2e' }}
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#888888' }}>{label}</p>
      <p className="font-medium" style={{ color: '#f0f0f0', fontFamily: mono ? 'monospace' : 'inherit' }}>
        {value}
      </p>
    </div>
  )
}
