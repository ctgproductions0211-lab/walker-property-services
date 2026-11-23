'use client'

import { useActionState, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { submitJob } from '@/lib/actions'

const MAX_PHOTOS = 5
// Vercel rejects request bodies over ~4.5 MB, so phone photos are shrunk before upload.
const MAX_TOTAL_BYTES = 4 * 1024 * 1024

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size < 300_000) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

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
  const [state, dispatch, pending] = useActionState(submitJob, null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoNote, setPhotoNote] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const fields = state?.fields ?? {}
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

  async function handlePhotos(fileList: FileList | null) {
    if (!fileList?.length) return
    setProcessing(true)
    const picked = [...photos, ...Array.from(fileList)].slice(0, MAX_PHOTOS)
    const compressed = await Promise.all(picked.map(compressImage))
    const kept: File[] = []
    let total = 0
    for (const f of compressed) {
      if (total + f.size > MAX_TOTAL_BYTES) continue
      kept.push(f)
      total += f.size
    }
    const dropped = Array.from(fileList).length + photos.length - kept.length
    setPhotos(kept)
    setPhotoNote(dropped > 0 ? `Up to ${MAX_PHOTOS} photos fit in one request — ${dropped} not added.` : null)
    setProcessing(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function formAction(formData: FormData) {
    formData.delete('photos')
    photos.forEach((p) => formData.append('photos', p))
    return dispatch(formData)
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
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
            autoComplete="name"
            defaultValue={fields.customer_name}
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
            autoComplete="email"
            defaultValue={fields.customer_email}
            placeholder="jane@example.com"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#6B8C23')}
            onBlur={e => (e.target.style.borderColor = '#2e2e2e')}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle}>
          Phone Number
          <span style={{ color: '#888888', fontWeight: 400, marginLeft: '6px' }}>(phone or email required)</span>
        </label>
        <input
          name="customer_phone"
          type="tel"
          autoComplete="tel"
          defaultValue={fields.customer_phone}
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
          autoComplete="street-address"
          defaultValue={fields.property_address}
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
          key={fields.job_type ?? 'job_type'}
          defaultValue={fields.job_type ?? ''}
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
          defaultValue={fields.customer_notes}
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
          role="button"
          tabIndex={0}
          className="rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-[#6B8C23]"
          style={{ background: '#1c1c1c', border: '2px dashed #2e2e2e' }}
          onClick={() => fileRef.current?.click()}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm mb-1" style={{ color: '#f0f0f0' }}>
            {processing ? 'Preparing photos…' : photos.length ? `${photos.length} photo${photos.length > 1 ? 's' : ''} ready — tap to add more` : 'Tap to upload photos'}
          </p>
          <p className="text-xs" style={{ color: '#888888' }}>Up to {MAX_PHOTOS} photos — we shrink them automatically</p>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => handlePhotos(e.target.files)}
          />
        </div>
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {photos.map((p, i) => (
              <span key={`${p.name}-${i}`} className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full" style={{ background: '#1c1c1c', border: '1px solid #2e2e2e', color: '#888888' }}>
                <span className="max-w-[140px] truncate">{p.name}</span>
                <button type="button" aria-label={`Remove ${p.name}`} onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ color: '#fca5a5' }}>✕</button>
              </span>
            ))}
          </div>
        )}
        {photoNote && <p className="text-xs mt-2" style={{ color: '#fdba74' }}>{photoNote}</p>}
      </div>

      <button
        type="submit"
        disabled={pending || processing}
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
