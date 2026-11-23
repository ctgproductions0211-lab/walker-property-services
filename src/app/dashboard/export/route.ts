import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { JOB_TYPE_LABELS, JOB_STATUS_LABELS, SERVICE_SELECTION_LABELS } from '@/types'
import type { Job, JobStatus } from '@/types'

export const dynamic = 'force-dynamic'

function cell(value: unknown): string {
  let text = value == null ? '' : String(value)
  // Stop spreadsheet apps from treating customer text as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const header = ['Submitted', 'Tracking Code', 'Status', 'Customer', 'Phone', 'Email', 'Address', 'Job Type', 'Size Requested', 'Quote', 'AI Estimate', 'Customer Notes', 'Internal Notes', 'Lead Source']
  const rows = ((data as Job[]) ?? []).map((j) => [
    new Date(j.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' }),
    j.tracking_code,
    JOB_STATUS_LABELS[j.status as JobStatus] ?? j.status,
    j.customer_name,
    j.customer_phone,
    j.customer_email,
    j.property_address,
    JOB_TYPE_LABELS[j.job_type] ?? j.job_type,
    j.service_selection ? SERVICE_SELECTION_LABELS[j.service_selection] ?? j.service_selection : '',
    j.quote_amount ?? '',
    j.ai_quote_low && j.ai_quote_high ? `$${j.ai_quote_low}-$${j.ai_quote_high}` : '',
    j.customer_notes,
    j.internal_notes,
    [j.utm_source, j.utm_medium, j.utm_campaign].filter(Boolean).join(' / '),
  ])

  const csv = [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n')
  const date = new Date().toISOString().slice(0, 10)
  return new NextResponse('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="walker-jobs-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
