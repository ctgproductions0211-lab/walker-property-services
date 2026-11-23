'use client'

import { useState, useTransition } from 'react'
import { deleteJob } from '@/lib/actions'

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const [armed, setArmed] = useState(false)
  const [pending, startTransition] = useTransition()

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="text-xs px-3 py-1.5 rounded-lg border hover:bg-white/5"
        style={{ color: '#fca5a5', borderColor: 'rgba(220,38,38,0.35)' }}
      >
        Delete job
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: '#fca5a5' }}>Delete this job and its photos?</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteJob(jobId))}
        className="text-xs px-3 py-1.5 rounded-lg font-semibold disabled:opacity-50"
        style={{ background: '#b91c1c', color: '#fff' }}
      >
        {pending ? 'Deleting…' : 'Yes, delete'}
      </button>
      <button type="button" onClick={() => setArmed(false)} className="text-xs px-2 py-1.5" style={{ color: '#a0a0a0' }}>
        Cancel
      </button>
    </div>
  )
}
