import { renderOgImage, OG_SIZE } from '@/lib/og'

export const alt = 'Walker Property Services — junk removal, cleanouts and demolition in Philadelphia'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return renderOgImage({
    eyebrow: 'Philadelphia & Tri-State Area',
    title: 'Junk Removal, Cleanouts & Demolition',
    subtitle: 'One call. One invoice. One vendor.',
  })
}
