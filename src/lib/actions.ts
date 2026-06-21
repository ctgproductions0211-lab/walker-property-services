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

export async function submitJob(prevState: { error?: string } | null, formData: FormData) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('[submitJob] Missing Supabase environment variables')
    return { error: 'Server configuration error — missing environment variables. Please contact support.' }
  }

  const supabase = await createClient()

  const customerName    = formData.get('customer_name') as string
  const customerEmail   = formData.get('customer_email') as string
  const customerPhone   = formData.get('customer_phone') as string
  const propertyAddress = formData.get('property_address') as string
  const jobType         = formData.get('job_type') as string
  const customerNotes   = formData.get('customer_notes') as string
  const photos          = formData.getAll('photos') as File[]

  if (!customerName || !propertyAddress || !jobType) {
    return { error: 'Please fill in all required fields.' }
  }

  const trackingCode = generateTrackingCode()

  // Read photos into memory as base64 (needed for AI analysis and later storage upload)
  const validPhotos = photos.filter((p) => p.size > 0)
  const photoData: { data: string; mediaType: string }[] = []
  for (const photo of validPhotos.slice(0, 5)) {
    const buffer = await photo.arrayBuffer()
    photoData.push({
      data:      Buffer.from(buffer).toString('base64'),
      mediaType: photo.type || 'image/jpeg',
    })
  }

  // Run AI analysis — never block the submission if it fails
  let aiResult: { analysis: AIAnalysis; quoteLow: number; quoteHigh: number } | null = null
  try {
    aiResult = await generateAIQuote({
      jobType,
      customerNotes: customerNotes || null,
      photos:        photoData,
    })
  } catch (aiErr) {
    console.error('[submitJob] AI quote generation failed (non-fatal):', aiErr)
  }

  const { data: job, error: insertError } = await supabase
    .from('jobs')
    .insert({
      customer_name:    customerName,
      customer_email:   customerEmail || null,
      customer_phone:   customerPhone || null,
      property_address: propertyAddress,
      job_type:         jobType,
      customer_notes:   customerNotes || null,
      tracking_code:    trackingCode,
      status:           'received',
      ai_quote_low:     aiResult?.quoteLow   ?? null,
      ai_quote_high:    aiResult?.quoteHigh  ?? null,
      ai_analysis:      aiResult?.analysis   ?? null,
      ai_confidence:    aiResult?.analysis?.confidence ?? null,
    })
    .select()
    .single()

  if (insertError || !job) {
    console.error('[submitJob] Insert failed:', insertError?.message, insertError?.code, insertError?.details)
    return { error: `Something went wrong submitting your request. Please try again. (${insertError?.message ?? 'no job returned'})` }
  }

  // Upload any photos the customer attached
  const uploadedFiles: { name: string; path: string }[] = []

  for (const photo of validPhotos) {
    const ext = photo.name.split('.').pop()
    const filePath = `${job.id}/submission/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('job-files')
      .upload(filePath, photo)

    if (!uploadError) {
      await supabase.from('job_files').insert({
        job_id:    job.id,
        file_path: filePath,
        file_name: photo.name,
        file_type: 'submission_photo',
      })
      uploadedFiles.push({ name: photo.name, path: filePath })
    }
  }

  // Generate 7-day signed URLs for the email
  const photoLinks: { name: string; url: string }[] = []
  for (const file of uploadedFiles) {
    const { data } = await supabase.storage
      .from('job-files')
      .createSignedUrl(file.path, 60 * 60 * 24 * 7)
    if (data) photoLinks.push({ name: file.name, url: data.signedUrl })
  }

  // Send notification email — don't let a failure block the submission
  try {
    await sendJobNotificationEmail({
      customerName,
      customerEmail:   customerEmail || null,
      customerPhone:   customerPhone || null,
      propertyAddress,
      jobType:         jobType as JobType,
      customerNotes:   customerNotes || null,
      trackingCode:    job.tracking_code,
      photoLinks,
      aiQuoteLow:      aiResult?.quoteLow   ?? null,
      aiQuoteHigh:     aiResult?.quoteHigh  ?? null,
      aiAnalysis:      aiResult?.analysis   ?? null,
    })
  } catch (emailErr) {
    console.error('[submitJob] Email notification failed:', emailErr)
  }

  redirect(`/confirmation?code=${trackingCode}`)
}

// ── Staff: Login ──────────────────────────────────────────────────────────────

export async function loginStaff(prevState: { error?: string } | null, formData: FormData) {
  const supabase = await createClient()
  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: 'Invalid email or password. Please try again.' }
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
