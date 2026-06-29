'use client'

import { useActionState, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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

type ServicePath = 'dumpster' | 'truck' | null

const DUMPSTER_OPTIONS = [
  { value: '10yd', label: '10 Yard' },
  { value: '15yd', label: '15 Yard' },
  { value: '20yd', label: '20 Yard' },
  { value: '30yd', label: '30 Yard' },
]

const TRUCK_OPTIONS = [
  { value: 'half', label: 'Half Load' },
  { value: 'full', label: 'Full Load' },
]

export default function SubmitForm() {
  const [state, action, pending] = useActionState(submitJob, null)
  const fileRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const [servicePath, setServicePath] = useState<ServicePath>(null)
  const [serviceDetail, setServiceDetail] = useState<string | null>(null)

  const utmSource   = searchParams.get('utm_source')   ?? ''
  const utmMedium   = searchParams.get('utm_medium')   ?? ''
  const utmCampaign = searchParams.get('utm_campaign') ?? ''

  function handlePathChange(path: ServicePath) {
    setServicePath(path)
    setServiceDetail(null)
  }

  const serviceSelectionValue = servicePath && serviceDetail ? `${servicePath}_${serviceDetail}` : ''

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="utm_source"   value={utmSource} />
      <input type="hidden" name="utm_medium"   value={utmMedium} />
      <input type="hidden" name="utm_campaign" value={utmCampaign} />
      <input type="hidden" name="service_selection" value={serviceSelectionValue} />
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

      {/* Service selection */}
      <div className="flex flex-col gap-3">
        <label style={labelStyle}>Service Type</label>
        <p className="text-xs -mt-2" style={{ color: '#888888' }}>
          This helps us understand your project size — we&apos;ll follow up with a tailored quote.
        </p>

        {/* Path buttons */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { path: 'dumpster' as const, label: 'Dumpster Rental', icon: '🗑️' },
            { path: 'truck' as const,    label: 'Truck Removal',   icon: '🚚' },
          ].map(({ path, label, icon }) => (
            <button
              key={path}
              type="button"
              onClick={() => handlePathChange(path)}
              className="rounded-lg p-4 text-center transition-all"
              style={{
                background: servicePath === path ? 'rgba(107,140,35,0.15)' : '#1c1c1c',
                border: servicePath === path ? '1px solid #6B8C23' : '1px solid #2e2e2e',
                color: servicePath === path ? '#6B8C23' : '#888888',
                cursor: 'pointer',
              }}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs font-semibold">{label}</div>
            </button>
          ))}
        </div>

        {/* Sub-options */}
        {servicePath === 'dumpster' && (
          <div className="grid grid-cols-4 gap-2">
            {DUMPSTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setServiceDetail(value)}
                className="rounded-lg py-2.5 text-xs font-semibold transition-all"
                style={{
                  background: serviceDetail === value ? 'rgba(107,140,35,0.15)' : '#1c1c1c',
                  border: serviceDetail === value ? '1px solid #6B8C23' : '1px solid #2e2e2e',
                  color: serviceDetail === value ? '#6B8C23' : '#888888',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {servicePath === 'truck' && (
          <div className="grid grid-cols-2 gap-2">
            {TRUCK_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setServiceDetail(value)}
                className="rounded-lg py-2.5 text-xs font-semibold transition-all"
                style={{
                  background: serviceDetail === value ? 'rgba(107,140,35,0.15)' : '#1c1c1c',
                  border: serviceDetail === value ? '1px solid #6B8C23' : '1px solid #2e2e2e',
                  color: serviceDetail === value ? '#6B8C23' : '#888888',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
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
