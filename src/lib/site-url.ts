const DEFAULT_SITE_URL = 'https://walkerpropservices.com'

export function getSiteUrl(): string {
  const value = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '')
  if (!value.startsWith('http') || value.includes('supabase.co')) return DEFAULT_SITE_URL
  return value
}
