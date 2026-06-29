'use client'

import { useState, useTransition } from 'react'
import { savePricingNotes } from '@/lib/actions'

export default function PricingEditor({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await savePricingNotes(content)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } catch {
        setError('Failed to save. Please try again.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={28}
        placeholder={`Paste pricing structures, load tiers, material upcharges, and item rates here.\n\nExample:\n— Dumpster 10yd: $350 drop, $75/ton over 2t\n— Half truck load: $280\n— Appliance surcharge: $50 each\n— Stair carry (per flight): $40`}
        className="w-full rounded-xl font-mono text-sm resize-y"
        style={{
          background: '#1c1c1c',
          border: '1px solid #2e2e2e',
          color: '#f0f0f0',
          padding: '16px',
          outline: 'none',
          lineHeight: '1.6',
        }}
        onFocus={e => (e.target.style.borderColor = '#6B8C23')}
        onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: '#6B8C23', color: '#ffffff' }}
        >
          {isPending ? 'Saving...' : 'Save Notes'}
        </button>

        {saved && (
          <span className="text-sm" style={{ color: '#86efac' }}>Saved</span>
        )}
        {error && (
          <span className="text-sm" style={{ color: '#f87171' }}>{error}</span>
        )}
      </div>
    </div>
  )
}
