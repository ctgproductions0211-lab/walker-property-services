'use client'

import { useActionState } from 'react'
import { updateInternalNotes } from '@/lib/actions'

interface Props {
  jobId: string
  currentNotes: string
}

export default function NotesForm({ jobId, currentNotes }: Props) {
  const [state, action, pending] = useActionState(updateInternalNotes, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="job_id" value={jobId} />

      {state?.error && <p className="text-xs" style={{ color: '#fca5a5' }}>{state.error}</p>}
      {state?.success && <p className="text-xs" style={{ color: '#86efac' }}>Notes saved.</p>}

      <textarea
        name="internal_notes"
        rows={5}
        defaultValue={currentNotes}
        placeholder="Add internal notes about this job — crew notes, access info, material lists, etc."
        style={{
          background: '#0d1b2a',
          border: '1px solid #243d60',
          color: '#f5f7fa',
          borderRadius: '8px',
          padding: '12px',
          width: '100%',
          fontSize: '14px',
          resize: 'vertical',
          outline: 'none',
        }}
        onFocus={e => (e.target.style.borderColor = '#c9a558')}
        onBlur={e => (e.target.style.borderColor = '#243d60')}
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50"
        style={{ background: '#c9a558', color: '#0d1b2a' }}
      >
        {pending ? 'Saving...' : 'Save Notes'}
      </button>
    </form>
  )
}
