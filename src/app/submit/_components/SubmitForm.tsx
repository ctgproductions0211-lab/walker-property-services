'use client'

import { useActionState, useRef } from 'react'
import { submitJob } from '@/lib/actions'

const inputStyle = {
  background: '#1c1c1c',
  border: '1px solid #2e2e2e',
  color: '#f0f0f0',
  borderRadius: '8px',
  padding: '12px 14px',
  width: '100%',
  fontSize: '15px',
  outline: 'none',
} as const

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#6B8C23',
} as const

export default function SubmitForm() {
  const [state, action, pending] = useActionState(submitJob, null)
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <div className="p-4 rounded-lg text-sm" style={{ background: 'rgba(220,38,38,0.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.3)' }}>
          {state.error}
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Full Name <span style={{ color: '#fca5a5' }}>*</span></label>
          <input
            name="customer_name"
            required
            placeholder="Jane Smith"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#6B8C23')}
            onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
          />
        </div>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            name="customer_email"
            type="email"
            placeholder="jane@example.com"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#6B8C23')}
            onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle}>Phone Number</label>
        <input
          name="customer_phone"
          type="tel"
          placeholder="(215) 555-1234"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#6B8C23')}
          onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
        />
      </div>

      {/* Address */}
      <div>
        <label style={labelStyle}>Property Address <span style={{ color: '#fca5a5' }}>*</span></label>
        <input
          name="property_address"
          required
          placeholder="1234 Main St, Philadelphia, PA 19103"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#6B8C23')}
          onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
        />
      </div>

      {/* Job Type */}
      <div>
        <label style={labelStyle}>Job Type <span style={{ color: '#fca5a5' }}>*</span></label>
        <select
          name="job_type"
          required
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={e => (e.target.style.borderColor = '#6B8C23')}
          onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
        >
          <option value="">Select a service...</option>
          <option value="cleanout">Cleanout</option>
          <option value="light_demo">Light Demo</option>
          <option value="turnover_prep">Turnover Prep</option>
          <option value="site_prep">Site Prep</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>
          Describe the Job
          <span style={{ color: '#888888', fontWeight: 400, marginLeft: '6px' }}>(optional)</span>
        </label>
        <textarea
          name="customer_notes"
          rows={4}
          placeholder="What needs to be removed or done? How many rooms? Any stairs, large appliances, or heavy debris? The more detail you give, the more accurate your estimate."
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e => (e.target.style.borderColor = '#6B8C23')}
          onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
        />
      </div>

      {/* Estimate tip */}
      <div
        className="rounded-lg px-4 py-3 text-sm"
        style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)', color: '#888888' }}
      >
        <span style={{ color: '#6B8C23', fontWeight: 600 }}>Get an instant estimate —</span>{' '}
        add a written description, upload photos, or both. Either one works. The more you share, the more accurate your quote.
      </div>

      {/* Photos */}
      <div>
        <label style={labelStyle}>
          Property Photos
          <span style={{ color: '#888888', fontWeight: 400, marginLeft: '6px' }}>(optional)</span>
        </label>
        <div
          className="rounded-lg p-6 text-center cursor-pointer transition-colors"
          style={{ background: '#1c1c1c', border: '2px dashed #2e2e2e' }}
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm mb-1" style={{ color: '#f0f0f0' }}>Click to upload photos</p>
          <p className="text-xs" style={{ color: '#888888' }}>JPG, PNG, HEIC — up to 5 photos (10 MB each)</p>
          <input
            ref={fileRef}
            name="photos"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => {
              const label = e.target.closest('div')?.querySelector('p')
              if (label && e.target.files?.length) {
                label.textContent = `${e.target.files.length} photo${e.target.files.length > 1 ? 's' : ''} selected`
              }
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 rounded-lg font-semibold text-base transition-all hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: '#6B8C23', color: '#ffffff' }}
      >
        {pending ? 'Submitting...' : 'Submit Job Request'}
      </button>

      <p className="text-center text-sm" style={{ color: '#888888' }}>
        After submitting, you&apos;ll receive a tracking code to check your job&apos;s status anytime.
      </p>
    </form>
  )
}
