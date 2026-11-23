'use server'

import { createClient } from '@/lib/supabase-server'
import { sendJobNotificationEmail } from '@/lib/email'
import { generateAIQuote } from '@/lib/ai-quote'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { JobType, AIAnalysis } from '@/types'

function generateTrackingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'WPS-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// ── Customer: Submit a new job request ────────────────────────────────────────

export type SubmitJobState = {
  error?: string
  fields?: Record<string, string>
} | null

const SUBMIT_FIELDS = [
  'customer_name', 'customer_email', 'customer_phone', 'property_address',
  'job_type', 'customer_notes', 'service_selection',
] as const

const MAX_PHOTOS = 5

function describeError(err: unknown): string {
  if (!err) return 'unknown error'
  if (err instanceof Error) {
    const cause = err.cause as { code?: string; message?: string } | undefined
    return cause ? `${err.message} (cause: ${cause.code ?? cause.message})` : err.message
  }
  const e = err as { message?: string; code?: string; details?: string; hint?: string }
  return [e.message, e.code && `code ${e.code}`, e.hint].filter(Boolean).join(' | ')
}

export async function submitJob(prevState: SubmitJobState, formData: FormData): Promise<SubmitJobState> {
  const fields = Object.fromEntries(
    SUBMIT_FIELDS.map((name) => [name, ((formData.get(name) as string | null) ?? '').trim()])
  ) as Record<(typeof SUBMIT_FIELDS)[number], string>

  const customerName     = fields.customer_name
  const customerEmail    = fields.customer_email || null
  const customerPhone    = fields.customer_phone || null
  const propertyAddress  = fields.property_address
  const jobType          = fields.job_type
  const customerNotes    = fields.customer_notes || null
  const serviceSelection = fields.service_selection || null
  const utmSource   = (formData.get('utm_source')   as string) || null
  const utmMedium   = (formData.get('utm_medium')   as string) || null
  const utmCampaign = (formData.get('utm_campaign') as string) || null

  if (!customerName || !propertyAddress || !jobType) {
    return { error: 'Please fill in your name, property address, and job type.', fields }
  }
  if (!customerEmail && !customerPhone) {
    return { error: 'Please add a phone number or email so we can send your quote.', fields }
  }

  const jobId        = crypto.randomUUID()
  const trackingCode = generateTrackingCode()

  const validPhotos = (formData.getAll('photos') as File[]).filter((p) => p.size > 0).slice(0, MAX_PHOTOS)
  const photoBuffers = await Promise.all(validPhotos.map(async (p) => Buffer.from(await p.arrayBuffer())))

  // AI estimate is optional — never block the submission on it
  let aiResult: { analysis: AIAnalysis; quoteLow: number; quoteHigh: number } | null = null
  try {
    aiResult = await generateAIQuote({
      jobType,
      customerNotes,
      photos: photoBuffers.map((buf, i) => ({
        data: buf.toString('base64'),
        mediaType: validPhotos[i].type || 'image/jpeg',
      })),
    })
  } catch (aiErr) {
    console.error('[submitJob] AI quote failed (non-fatal):', describeError(aiErr))
  }

  const baseInsert = {
    id:               jobId,
    customer_name:    customerName,
    customer_email:   customerEmail,
    customer_phone:   customerPhone,
    property_address: propertyAddress,
    job_type:         jobType,
    customer_notes:   customerNotes,
    tracking_code:    trackingCode,
    status:           'received',
    ai_quote_low:     aiResult?.quoteLow ?? null,
    ai_quote_high:    aiResult?.quoteHigh ?? null,
    ai_analysis:      aiResult?.analysis ?? null,
    ai_confidence:    aiResult?.analysis?.confidence ?? null,
    utm_source:       utmSource,
    utm_medium:       utmMedium,
    utm_campaign:     utmCampaign,
  }

  // Insert without .select(): visitors may insert jobs but are not allowed to read them back.
  let supabase: Awaited<ReturnType<typeof createClient>> | null = null
  let dbError: string | null = null
  let photosLinkable = true
  try {
    supabase = await createClient()
    let { error } = await supabase.from('jobs').insert({ ...baseInsert, service_selection: serviceSelection })
    if (error && (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('service_selection'))) {
      ({ error } = await supabase.from('jobs').insert(baseInsert))
    }
    // Older schemas use a numeric id; let the database assign it and skip photo records.
    if (error && (error.code === '22P02' || error.code === '428C9')) {
      const { id: _id, ...withoutId } = baseInsert
      void _id
      ;({ error } = await supabase.from('jobs').insert(withoutId))
      if (!error) photosLinkable = false
    }
    if (error) dbError = describeError(error)
  } catch (err) {
    dbError = describeError(err)
  }

  const uploadedPaths: string[] = []
  if (!dbError && supabase && photosLinkable) {
    for (const [i, photo] of validPhotos.entries()) {
      try {
        const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
        const filePath = `${jobId}/submission/${Date.now()}-${i}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('job-files')
          .upload(filePath, photoBuffers[i], { contentType: photo.type || 'image/jpeg' })
        if (uploadError) {
          console.error('[submitJob] Photo upload failed (non-fatal):', uploadError.message)
          continue
        }
        await supabase.from('job_files').insert({
          job_id:    jobId,
          file_path: filePath,
          file_name: photo.name,
          file_type: 'submission_photo',
        })
        uploadedPaths.push(filePath)
      } catch (uploadErr) {
        console.error('[submitJob] Photo upload failed (non-fatal):', describeError(uploadErr))
      }
    }
  }

  if (dbError) {
    console.error('[submitJob] Database insert failed:', dbError, '— check /api/health')
  }

  let emailSent = false
  try {
    await sendJobNotificationEmail({
      customerName,
      customerEmail,
      customerPhone,
      propertyAddress,
      jobType:          jobType as JobType,
      customerNotes,
      trackingCode,
      photoLinks:       [],
      aiQuoteLow:       aiResult?.quoteLow ?? null,
      aiQuoteHigh:      aiResult?.quoteHigh ?? null,
      aiAnalysis:       aiResult?.analysis ?? null,
      serviceSelection,
      savedToDashboard: !dbError,
      attachments:      validPhotos.map((p, i) => ({ filename: p.name || `photo-${i + 1}.jpg`, content: photoBuffers[i] })),
    })
    emailSent = true
  } catch (emailErr) {
    console.error('[submitJob] Email notification failed:', describeError(emailErr))
  }

  if (dbError && !emailSent) {
    return {
      error: "We couldn't submit your request right now. Please try again in a few minutes, or email us at Edward@walkerpropservices.com.",
      fields,
    }
  }

  revalidatePath('/dashboard')
  redirect(`/confirmation?code=${trackingCode}${dbError ? '&queued=1' : ''}`)
}

// ── Staff: Login ──────────────────────────────────────────────────────────────

export async function loginStaff(prevState: { error?: string } | null, formData: FormData) {
  const supabase = await createClient()
  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
  if (error) {
    if (error.status === 400 || error.status === 401) {
      return { error: 'Invalid email or password. Please try again.' }
    }
    console.error('[loginStaff] Sign-in failed:', describeError(error))
    return { error: "Can't reach the login service right now. Please try again in a minute." }
  }

  redirect('/dashboard')
}

// ── Staff: Logout ─────────────────────────────────────────────────────────────

export async function logoutStaff() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/dashboard/login')
}

// ── Staff: Update job status ──────────────────────────────────────────────────

export async function updateJobStatus(jobId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('jobs').update({ status }).eq('id', jobId)
  revalidatePath(`/dashboard/jobs/${jobId}`)
  revalidatePath('/dashboard')
}

// ── Staff: Update quote amount ────────────────────────────────────────────────

export async function updateJobQuote(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const jobId  = formData.get('job_id') as string
  const amount = parseFloat(formData.get('quote_amount') as string)

  if (isNaN(amount) || amount < 0) return { error: 'Please enter a valid amount.' }

  const { error } = await supabase
    .from('jobs')
    .update({ quote_amount: amount, status: 'quoted' })
    .eq('id', jobId)

  if (error) return { error: 'Failed to save quote.' }

  revalidatePath(`/dashboard/jobs/${jobId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

// ── Staff: Update internal notes ──────────────────────────────────────────────

export async function updateInternalNotes(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const jobId = formData.get('job_id') as string
  const notes = formData.get('internal_notes') as string

  const { error } = await supabase
    .from('jobs')
    .update({ internal_notes: notes })
    .eq('id', jobId)

  if (error) return { error: 'Failed to save notes.' }

  revalidatePath(`/dashboard/jobs/${jobId}`)
  return { success: true }
}

// ── Staff: Save pricing notes ─────────────────────────────────────────────────

export async function savePricingNotes(content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('pricing_notes')
    .upsert({ id: 'main', content, updated_at: new Date().toISOString() })

  if (error) throw new Error('Failed to save pricing notes.')
}

// ── Staff: Record an uploaded file in the database ────────────────────────────
// Called after the file is uploaded directly to Supabase Storage from the browser

export async function saveFileRecord(
  jobId: string,
  filePath: string,
  fileName: string,
  fileType: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('job_files').insert({
    job_id:    jobId,
    file_path: filePath,
    file_name: fileName,
    file_type: fileType,
  })

  if (error) throw new Error('Failed to record file.')

  revalidatePath(`/dashboard/jobs/${jobId}`)
}

// ── Staff: Delete a file record ───────────────────────────────────────────────

export async function deleteFileRecord(fileId: string, filePath: string, jobId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.storage.from('job-files').remove([filePath])
  await supabase.from('job_files').delete().eq('id', fileId)

  revalidatePath(`/dashboard/jobs/${jobId}`)
}
