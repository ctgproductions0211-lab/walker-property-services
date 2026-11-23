// Copy-pasted env values often carry whitespace, wrapping quotes, a trailing slash or a /rest/v1 suffix.
function clean(value: string | undefined): string {
  return (value ?? '').trim().replace(/^["']|["']$/g, '').trim()
}

export function getSupabaseUrl(): string {
  return clean(process.env.NEXT_PUBLIC_SUPABASE_URL)
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1$/, '')
}

export function getSupabaseAnonKey(): string {
  return clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).replace(/\s+/g, '')
}

export function getSupabaseConfig(): { url: string; key: string } {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  if (!url.startsWith('https://')) {
    throw new Error(`NEXT_PUBLIC_SUPABASE_URL is missing or invalid (got "${url.slice(0, 60)}")`)
  }
  if (!key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty')
  }
  return { url, key }
}
