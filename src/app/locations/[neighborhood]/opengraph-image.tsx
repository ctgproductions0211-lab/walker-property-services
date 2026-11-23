import { renderOgImage, OG_SIZE } from '@/lib/og'
import { getLocationBySlug } from '@/lib/locations'

export const alt = 'Walker Property Services — junk removal and cleanouts'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ neighborhood: string }> }) {
  const { neighborhood } = await params
  const location = getLocationBySlug(neighborhood)
  return renderOgImage({
    eyebrow: location ? location.region : 'Service Area',
    title: `Junk Removal & Cleanouts in ${location?.name ?? 'Your Area'}`,
    subtitle: 'Cleanouts · Demolition · Dumpster Rentals',
  })
}
