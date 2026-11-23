import { renderOgImage, OG_SIZE } from '@/lib/og'
import { getCategoryBySlug } from '@/lib/services'

export const alt = 'Walker Property Services'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const c = getCategoryBySlug(category)
  return renderOgImage({
    eyebrow: 'Philadelphia & Tri-State Area',
    title: c?.title ?? 'Property Services',
    subtitle: c?.shortDescription ?? 'Cleanouts · Demolition · Dumpster Rentals',
  })
}
