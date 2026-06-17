'use client'

import { useActionState } from 'react'

const inputStyle = {
  background: '#1a2f4a',
  border: '1px solid #243d60',
  color: '#f5f7fa',
  borderRadius: '8px',
  padding: '12px 14px',
  width: '100%',
  fontSize: '15px',
  outline: 'none',
} as const

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>
}

export default function LoginForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{ background: 'rgba(220,38,38,0.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.3)' }}
        >
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9a558' }}>Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@walkerps.com"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#c9a558')}
          onBlur={e => (e.target.style.borderColor = '#243d60')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: '#c9a558' }}>Password</label>
        <input
          name="password"
          type="password"
          required
          placeholder="••••••••"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#c9a558')}
          onBlur={e => (e.target.style.borderColor = '#243d60')}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3.5 rounded-lg font-semibold text-base transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        style={{ background: '#c9a558', color: '#0d1b2a' }}
      >
        {pending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
