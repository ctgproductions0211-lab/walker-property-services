'use client'

import { useState, useTransition } from 'react'
import { updateJobStatus } from '@/lib/actions'
import { JOB_STATUS_LABELS } from '@/types'
import type { JobStatus } from '@/types'

const STATUSES: JobStatus[] = ['received', 'quoted', 'scheduled', 'in_progress', 'complete']

interface Props {
  jobId: string
  currentStatus: string
}

export default function StatusForm({ jobId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleChange(newStatus: string) {
    setStatus(newStatus)
    setSaved(false)
  }

  function handleSave() {
    startTransition(async () => {
      await updateJobStatus(jobId, status)
      setSaved(true)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <select
        value={status}
        onChange={e => handleChange(e.target.value)}
        style={{
          background: '#111111',
          border: '1px solid #2e2e2e',
          color: '#f0f0f0',
          borderRadius: '8px',
          padding: '10px 12px',
          width: '100%',
          fontSize: '14px',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {STATUSES.map(s => (
          <option key={s} value={s}>{JOB_STATUS_LABELS[s]}</option>
        ))}
      </select>

      <button
        onClick={handleSave}
        disabled={pending || status === currentStatus}
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: '#6B8C23', color: '#ffffff' }}
      >
        {pending ? 'Saving...' : saved ? 'Saved!' : 'Update Status'}
      </button>
    </div>
  )
}
