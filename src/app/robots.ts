import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

const BASE_URL = getSiteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/dashboard', '/api/', '/confirmation', '/track/'] },
      // Explicitly welcome AI search and assistant crawlers so the business can be cited in AI answers.
      {
        userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot'],
        allow: '/',
        disallow: ['/dashboard', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
