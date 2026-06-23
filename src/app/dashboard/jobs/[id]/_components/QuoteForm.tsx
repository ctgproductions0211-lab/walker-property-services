'use client'

import { useActionState } from 'react'
import { updateJobQuote } from '@/lib/actions'

interface Props {
  jobId: string
  currentAmount: number | null
}

export default function QuoteForm({ jobId, currentAmount }: Props) {
  const [state, action, pending] = useActionState(updateJobQuote, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="job_id" value={jobId} />

      {state?.error && (
        <p className="text-xs" style={{ color: '#fca5a5' }}>{state.error}</p>
      )}
      {state?.success && (
        <p className="text-xs" style={{ color: '#86efac' }}>Quote saved and status set to Quoted.</p>
      )}

      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 font-medium"
          style={{ color: '#888888' }}
        >$</span>
        <input
          name="quote_amount"
          type="number"
          min="0"
          step="0.01"
          defaultValue={currentAmount ?? ''}
          placeholder="0.00"
          style={{
            background: '#111111',
            border: '1px solid #2e2e2e',
            color: '#f0f0f0',
            borderRadius: '8px',
            padding: '10px 12px 10px 24px',
            width: '100%',
            fontSize: '14px',
            outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = '#6B8C23')}
          onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50"
        style={{ background: '#6B8C23', color: '#ffffff' }}
      >
        {pending ? 'Saving...' : 'Save Quote'}
      </button>
      <p className="text-xs" style={{ color: '#888888' }}>Saving a quote will also set the status to &ldquo;Quoted&rdquo;.</p>
    </form>
  )
}
