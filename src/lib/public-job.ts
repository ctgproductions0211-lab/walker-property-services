import { createClient } from '@/lib/supabase-server'
import type { Job } from '@/types'

export type PublicJob = Pick<
  Job,
  | 'tracking_code' | 'customer_name' | 'property_address' | 'job_type' | 'status'
  | 'quote_amount' | 'created_at' | 'ai_quote_low' | 'ai_quote_high' | 'ai_analysis'
>

// Visitors look jobs up through a database function that only returns one job's
// public fields, so the jobs table itself never has to be readable by the public.
export async function getPublicJob(code: string): Promise<PublicJob | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_job_by_tracking_code', { code: code.toUpperCase() })
    if (!error) {
      const row = Array.isArray(data) ? data[0] : data
      return (row as PublicJob | undefined) ?? null
    }
    // Function not installed yet (setup.sql not run) — fall back to a direct read.
    const { data: job } = await supabase
      .from('jobs')
      .select('tracking_code, customer_name, property_address, job_type, status, quote_amount, created_at, ai_quote_low, ai_quote_high, ai_analysis')
      .eq('tracking_code', code.toUpperCase())
      .maybeSingle()
    return (job as PublicJob | null) ?? null
  } catch (err) {
    console.error('[getPublicJob] lookup failed:', err instanceof Error ? err.message : err)
    return null
  }
}
