import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { JOB_TYPE_LABELS, JOB_STATUS_LABELS } from '@/types'
import type { Job, JobStatus } from '@/types'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  received:    { bg: 'rgba(59,130,246,0.15)',  text: '#93c5fd' },
  quoted:      { bg: 'rgba(201,165,88,0.15)',  text: '#c9a558' },
  scheduled:   { bg: 'rgba(139,92,246,0.15)',  text: '#c4b5fd' },
  in_progress: { bg: 'rgba(249,115,22,0.15)',  text: '#fdba74' },
  complete:    { bg: 'rgba(34,197,94,0.15)',   text: '#86efac' },
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: jobs } = await query as { data: Job[] | null }
  const allJobs = jobs ?? []

  // Count by status for the filter tabs
  const { data: counts } = await supabase.from('jobs').select('status')
  const statusCounts = (counts ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1
    return acc
  }, {})

  const filters = [
    { key: '',            label: 'All Jobs' },
    { key: 'received',    label: 'Received' },
    { key: 'quoted',      label: 'Quoted' },
    { key: 'scheduled',   label: 'Scheduled' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'complete',    label: 'Complete' },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f5f7fa' }}>Job Requests</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8a9bb0' }}>
            {allJobs.length} job{allJobs.length !== 1 ? 's' : ''} {status ? `with status "${JOB_STATUS_LABELS[status as JobStatus]}"` : 'total'}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(({ key, label }) => {
          const isActive = (key === '' && !status) || key === status
          const count = key === '' ? (counts?.length ?? 0) : (statusCounts[key] ?? 0)
          return (
            <Link
              key={key}
              href={key ? `?status=${key}` : '/dashboard'}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isActive ? '#c9a558' : '#1a2f4a',
                color:      isActive ? '#0d1b2a' : '#8a9bb0',
                border:     isActive ? '1px solid #c9a558' : '1px solid #243d60',
              }}
            >
              {label} {count > 0 && <span className="ml-1 opacity-70">{count}</span>}
            </Link>
          )
        })}
      </div>

      {/* Jobs table */}
      {allJobs.length === 0 ? (
        <div
          className="rounded-xl p-16 text-center"
          style={{ background: '#1a2f4a', border: '1px solid #243d60' }}
        >
          <p className="text-lg font-medium mb-1" style={{ color: '#f5f7fa' }}>No jobs found</p>
          <p style={{ color: '#8a9bb0' }}>
            {status ? 'No jobs match this filter.' : 'Job requests will appear here once customers submit them.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #243d60' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1a2f4a', borderBottom: '1px solid #243d60' }}>
                {['Customer', 'Address', 'Service', 'Status', 'Quote', 'Submitted'].map(col => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#8a9bb0' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allJobs.map((job, i) => {
                const colors = STATUS_COLORS[job.status]
                return (
                  <tr
                    key={job.id}
                    style={{
                      background:   i % 2 === 0 ? '#0d1b2a' : 'rgba(26,47,74,0.4)',
                      borderBottom: '1px solid #243d60',
                    }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/jobs/${job.id}`} className="block hover:underline font-medium" style={{ color: '#f5f7fa' }}>
                        {job.customer_name}
                      </Link>
                      {job.customer_email && (
                        <span className="text-xs" style={{ color: '#8a9bb0' }}>{job.customer_email}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate" style={{ color: '#8a9bb0' }}>
                      {job.property_address}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#f5f7fa' }}>
                      {JOB_TYPE_LABELS[job.job_type]}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: colors.bg, color: colors.text }}
                      >
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: job.quote_amount ? '#c9a558' : '#8a9bb0' }}>
                      {job.quote_amount ? `$${job.quote_amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#8a9bb0' }}>
                      {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
