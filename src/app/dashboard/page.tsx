import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { JOB_TYPE_LABELS, SERVICE_SELECTION_LABELS } from '@/types'
import type { Job } from '@/types'
import StatusSelect from './_components/StatusSelect'
import AutoRefresh from './_components/AutoRefresh'

export const metadata: Metadata = {
  title: 'Dashboard | Walker Property Services',
  robots: { index: false, follow: false },
}

const FILTERS: { key: string; label: string }[] = [
  { key: '',            label: 'All' },
  { key: 'received',    label: 'New' },
  { key: 'quoted',      label: 'Quoted' },
  { key: 'scheduled',   label: 'Scheduled' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'complete',    label: 'Complete' },
]

const money = (n: number) => `$${Math.round(n).toLocaleString()}`

function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isWithinDays(iso: string, days: number) {
  return Date.now() - new Date(iso).getTime() < days * 24 * 3600 * 1000
}

function isFresh(job: Job) {
  return job.status === 'received' && Date.now() - new Date(job.created_at).getTime() < 48 * 3600 * 1000
}

function serviceLabel(job: Job) {
  return JOB_TYPE_LABELS[job.job_type] ?? job.job_type
}

function quoteCell(job: Job) {
  if (job.quote_amount) return { text: money(job.quote_amount), sub: 'quoted', strong: true }
  if (job.ai_quote_low && job.ai_quote_high) return { text: `${money(job.ai_quote_low)}–${money(job.ai_quote_high)}`, sub: 'AI estimate', strong: false }
  return { text: '—', sub: '', strong: false }
}

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const { status = '', q = '' } = await searchParams
  const search = q.trim().toLowerCase()

  let jobs: Job[] = []
  let loadError: string | null = null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000)
    if (error) loadError = error.message
    jobs = (data as Job[] | null) ?? []
  } catch (err) {
    loadError = err instanceof Error ? err.message : String(err)
  }

  const counts = jobs.reduce<Record<string, number>>((acc, j) => {
    acc[j.status] = (acc[j.status] ?? 0) + 1
    return acc
  }, {})

  const thisWeek = jobs.filter((j) => isWithinDays(j.created_at, 7)).length
  const pipeline = jobs
    .filter((j) => ['quoted', 'scheduled', 'in_progress'].includes(j.status))
    .reduce((sum, j) => sum + (j.quote_amount ?? 0), 0)
  const completedValue = jobs
    .filter((j) => j.status === 'complete')
    .reduce((sum, j) => sum + (j.quote_amount ?? 0), 0)

  const visible = jobs.filter((j) => {
    if (status && j.status !== status) return false
    if (!search) return true
    return [j.customer_name, j.customer_email, j.customer_phone, j.property_address, j.tracking_code]
      .some((v) => v?.toLowerCase().includes(search))
  })

  const filterHref = (key: string) => {
    const params = new URLSearchParams()
    if (key) params.set('status', key)
    if (q) params.set('q', q)
    const qs = params.toString()
    return qs ? `/dashboard?${qs}` : '/dashboard'
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#f0f0f0' }}>Job Requests</h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>
            Every “Request a Job” form submission lands here.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/dashboard/export" className="text-xs px-3 py-2 rounded-md border hover:bg-white/5" style={{ color: '#c8c8c8', borderColor: '#2e2e2e' }}>
            ⤓ Export CSV
          </a>
          <Link href={filterHref(status)} className="text-xs px-3 py-2 rounded-md border hover:bg-white/5" style={{ color: '#c8c8c8', borderColor: '#2e2e2e' }}>
            ↻ Refresh
          </Link>
        </div>
        <AutoRefresh />
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl p-4 text-sm" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.35)', color: '#fca5a5' }}>
          Couldn&apos;t load jobs: {loadError}. Open <a href="/api/health" className="underline">/api/health</a> to see what&apos;s wrong.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Stat label="New requests" value={String(counts.received ?? 0)} hint="waiting for a quote" accent="#93c5fd" href={filterHref('received')} />
        <Stat label="This week" value={String(thisWeek)} hint="requests in last 7 days" accent="#f0f0f0" />
        <Stat label="Open pipeline" value={money(pipeline)} hint="quoted + scheduled + active" accent="#9cc23a" />
        <Stat label="Completed" value={money(completedValue)} hint={`${counts.complete ?? 0} jobs done`} accent="#86efac" />
      </div>

      {/* Search + filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <form action="/dashboard" className="flex-1 flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, email, address, or tracking code"
            className="flex-1 min-w-0 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#6B8C23]"
            style={{ background: '#161616', border: '1px solid #2e2e2e', color: '#f0f0f0' }}
          />
          <button type="submit" className="px-4 rounded-lg text-sm font-semibold" style={{ background: '#6B8C23', color: '#fff' }}>
            Search
          </button>
        </form>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTERS.map(({ key, label }) => {
            const active = key === status
            const count = key ? counts[key] ?? 0 : jobs.length
            return (
              <Link
                key={key}
                href={filterHref(key)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  background: active ? '#6B8C23' : '#161616',
                  color:      active ? '#ffffff' : '#a0a0a0',
                  border:     `1px solid ${active ? '#6B8C23' : '#2e2e2e'}`,
                }}
              >
                {label} <span className="ml-1 opacity-70">{count}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl p-12 sm:p-16 text-center" style={{ background: '#161616', border: '1px solid #2e2e2e' }}>
          <p className="text-lg font-medium mb-1" style={{ color: '#f0f0f0' }}>
            {jobs.length === 0 ? 'No job requests yet' : 'Nothing matches'}
          </p>
          <p className="text-sm" style={{ color: '#888888' }}>
            {jobs.length === 0
              ? 'When a customer submits the Request a Job form, it shows up here instantly.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: '1px solid #2e2e2e' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: '#161616', borderBottom: '1px solid #2e2e2e' }}>
                  {['Customer', 'Property', 'Service', 'Status', 'Quote', 'Received'].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((job) => {
                  const quote = quoteCell(job)
                  return (
                    <tr key={job.id} className="hover:bg-white/[0.03] transition-colors" style={{ borderBottom: '1px solid #222' }}>
                      <td className="px-4 py-3.5">
                        <Link href={`/dashboard/jobs/${job.id}`} className="font-medium hover:underline flex items-center gap-2" style={{ color: '#f0f0f0' }}>
                          {isFresh(job) && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#3b82f6' }} title="New" />}
                          {job.customer_name}
                        </Link>
                        <div className="text-xs mt-0.5 flex flex-wrap gap-x-3" style={{ color: '#888888' }}>
                          {job.customer_phone && <a href={`tel:${job.customer_phone}`} className="hover:underline">{job.customer_phone}</a>}
                          {job.customer_email && <a href={`mailto:${job.customer_email}`} className="hover:underline truncate max-w-[200px]">{job.customer_email}</a>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm max-w-[240px]" style={{ color: '#b0b0b0' }}>
                        <span className="line-clamp-2">{job.property_address}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm" style={{ color: '#f0f0f0' }}>
                        {serviceLabel(job)}
                        {job.service_selection && (
                          <div className="text-xs mt-0.5" style={{ color: '#888888' }}>
                            {SERVICE_SELECTION_LABELS[job.service_selection] ?? job.service_selection}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusSelect jobId={job.id} status={job.status} />
                      </td>
                      <td className="px-4 py-3.5 text-sm whitespace-nowrap">
                        <div style={{ color: quote.strong ? '#9cc23a' : '#b0b0b0', fontWeight: quote.strong ? 600 : 400 }}>{quote.text}</div>
                        {quote.sub && <div className="text-xs" style={{ color: '#666' }}>{quote.sub}</div>}
                      </td>
                      <td className="px-4 py-3.5 text-sm whitespace-nowrap" style={{ color: '#888888' }}>
                        {timeAgo(job.created_at)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {visible.map((job) => {
              const quote = quoteCell(job)
              return (
                <div key={job.id} className="rounded-xl p-4" style={{ background: '#161616', border: '1px solid #2e2e2e' }}>
                  <Link href={`/dashboard/jobs/${job.id}`} className="block">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <span className="font-semibold flex items-center gap-2" style={{ color: '#f0f0f0' }}>
                        {isFresh(job) && <span className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />}
                        {job.customer_name}
                      </span>
                      {isFresh(job) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }}>New</span>
                      )}
                    </div>
                    <p className="text-sm mb-2" style={{ color: '#b0b0b0' }}>{job.property_address}</p>
                    <div className="flex items-center justify-between text-xs" style={{ color: '#888888' }}>
                      <span>{serviceLabel(job)} · {timeAgo(job.created_at)}</span>
                      <span style={{ color: quote.strong ? '#9cc23a' : '#b0b0b0', fontWeight: quote.strong ? 600 : 400 }}>{quote.text}</span>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #2e2e2e' }}>
                    <StatusSelect jobId={job.id} status={job.status} />
                    <span className="text-xs font-mono" style={{ color: '#666' }}>{job.tracking_code}</span>
                  </div>
                  {(job.customer_phone || job.customer_email) && (
                    <div className="flex gap-2 mt-3">
                      {job.customer_phone && (
                        <a href={`tel:${job.customer_phone}`} className="flex-1 text-center text-sm py-2 rounded-lg font-medium" style={{ background: 'rgba(107,140,35,0.15)', color: '#9cc23a' }}>Call</a>
                      )}
                      {job.customer_phone && (
                        <a href={`sms:${job.customer_phone}`} className="flex-1 text-center text-sm py-2 rounded-lg font-medium" style={{ background: '#1f1f1f', color: '#c8c8c8' }}>Text</a>
                      )}
                      {job.customer_email && (
                        <a href={`mailto:${job.customer_email}`} className="flex-1 text-center text-sm py-2 rounded-lg font-medium" style={{ background: '#1f1f1f', color: '#c8c8c8' }}>Email</a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function Stat({ label, value, hint, accent, href }: { label: string; value: string; hint: string; accent: string; href?: string }) {
  const body = (
    <div className="rounded-xl p-4 sm:p-5 h-full transition-colors hover:bg-white/[0.02]" style={{ background: '#161616', border: '1px solid #2e2e2e' }}>
      <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#888888' }}>{label}</p>
      <p className="text-2xl sm:text-3xl font-bold" style={{ color: accent }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: '#666' }}>{hint}</p>
    </div>
  )
  return href ? <Link href={href}>{body}</Link> : body
}
