import { NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/supabase-env'

export const dynamic = 'force-dynamic'

function keyProjectRef(key: string): string | null {
  const parts = key.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    return typeof payload.ref === 'string' ? payload.ref : null
  } catch {
    return null
  }
}

function describeError(err: unknown): { error: string; cause: string | null } {
  if (!(err instanceof Error)) return { error: String(err), cause: null }
  const cause = err.cause as { code?: string; message?: string } | undefined
  return {
    error: `${err.name}: ${err.message}`,
    cause: cause ? [cause.code, cause.message].filter(Boolean).join(' — ') : null,
  }
}

export async function GET() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()

  let host: string | null = null
  try { host = new URL(url).host } catch { /* reported below */ }

  const urlRef = host?.endsWith('.supabase.co') ? host.split('.')[0] : null
  const keyRef = keyProjectRef(key)

  const checks = {
    url_set: rawUrl.length > 0,
    url_host: host,
    url_had_extra_characters: rawUrl !== url,
    key_set: rawKey.length > 0,
    key_format: key.startsWith('sb_publishable_') ? 'publishable' : keyRef ? 'jwt' : key ? 'unrecognized' : 'missing',
    key_had_extra_characters: rawKey !== key,
    key_matches_url_project: keyRef && urlRef ? keyRef === urlRef : null,
    resend_key_set: Boolean(process.env.RESEND_API_KEY),
  }

  let database: Record<string, unknown> = { reachable: false }
  if (host) {
    try {
      const res = await fetch(`${url}/rest/v1/jobs?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      })
      const body = await res.text()
      database = { reachable: true, http_status: res.status, response: body.slice(0, 200) }
    } catch (err) {
      database = { reachable: false, ...describeError(err) }
    }
  }

  const ok = database.reachable === true && (database.http_status === 200)
  return NextResponse.json({ ok, checks, database }, { status: ok ? 200 : 503 })
}
