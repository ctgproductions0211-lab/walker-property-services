import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const OG_SIZE = { width: 1200, height: 630 }

export async function renderOgImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const logo = await readFile(join(process.cwd(), 'public/logo.jpg'))
  const logoSrc = `data:image/jpeg;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #16210a 100%)', padding: '64px', color: '#f5f5f5',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 40 }}>
          <div style={{ fontSize: 26, color: '#9cc23a', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>{eyebrow}</div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08, marginBottom: 24 }}>{title}</div>
          <div style={{ fontSize: 28, color: '#b0b0b0' }}>{subtitle}</div>
          <div style={{ display: 'flex', marginTop: 36, fontSize: 26, color: '#ffffff', background: '#5f7d1f', padding: '14px 28px', borderRadius: 14, alignSelf: 'flex-start' }}>
            Free quotes · walkerpropservices.com
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={340} height={340} alt="" style={{ borderRadius: 24 }} />
      </div>
    ),
    OG_SIZE,
  )
}
