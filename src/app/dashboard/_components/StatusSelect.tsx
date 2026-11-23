'use client'

import { useTransition } from 'react'
import { updateJobStatus } from '@/lib/actions'
import { JOB_STATUS_LABELS } from '@/types'
import type { JobStatus } from '@/types'

const COLORS: Record<string, { bg: string; text: string }> = {
  received:    { bg: 'rgba(59,130,246,0.15)', text: '#93c5fd' },
  quoted:      { bg: 'rgba(107,140,35,0.18)', text: '#9cc23a' },
  scheduled:   { bg: 'rgba(139,92,246,0.15)', text: '#c4b5fd' },
  in_progress: { bg: 'rgba(249,115,22,0.15)', text: '#fdba74' },
  complete:    { bg: 'rgba(34,197,94,0.15)',  text: '#86efac' },
}

export default function StatusSelect({ jobId, status }: { jobId: string; status: string }) {
  const [pending, startTransition] = useTransition()
  const c = COLORS[status] ?? { bg: 'rgba(136,136,136,0.15)', text: '#c8c8c8' }

  return (
    <select
      aria-label="Job status"
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value
        startTransition(() => updateJobStatus(jobId, next))
      }}
      className="text-xs font-semibold rounded-full pl-2.5 pr-6 py-1 cursor-pointer outline-none disabled:opacity-50 appearance-none"
      style={{
        background: `${c.bg} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E") no-repeat right 8px center`,
        color: c.text,
        border: 'none',
      }}
    >
      {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((s) => (
        <option key={s} value={s} style={{ background: '#161616', color: '#f0f0f0' }}>
          {JOB_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  )
}
