import type { MetadataRoute } from 'next'
import { ALL_LOCATIONS } from '@/lib/locations'
import { SERVICE_CATEGORIES } from '@/lib/services'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                         priority: 1.0, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/services`,           priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/locations`,          priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/submit`,             priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/property-managers`,  priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/developers`,         priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/about`,              priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/faq`,               priority: 0.7, changeFrequency: 'monthly' },
  ]

  const servicePages: MetadataRoute.Sitemap = SERVICE_CATEGORIES.map(category => ({
    url: `${BASE_URL}/services/${category.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly',
  }))

  const locationPages: MetadataRoute.Sitemap = ALL_LOCATIONS.map(location => ({
    url: `${BASE_URL}/locations/${location.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly',
  }))

  return [...staticPages, ...servicePages, ...locationPages]
}
