import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { getSiteUrl } from '@/lib/site-url'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Walker Property Services | Philadelphia Junk Removal, Cleanouts & Demolition',
  description:
    'Junk removal, property cleanouts, demolition, and dumpster rentals in Philadelphia, Northeast Philadelphia, and the PA/NJ/DE tri-state area. Free estimates.',
  applicationName: 'Walker Property Services',
  openGraph: {
    type: 'website',
    siteName: 'Walker Property Services',
    locale: 'en_US',
    images: [{ url: '/logo.jpg', alt: 'Walker Property Services' }],
  },
  twitter: { card: 'summary' },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
