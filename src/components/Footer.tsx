import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">

        {/* Contact & social */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <a
            href="mailto:Edward@walkerpropservices.com"
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: '#888888' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Edward@walkerpropservices.com
          </a>
          <a
            href="https://www.instagram.com/walker_a.n.d/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: '#888888' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            @walker_a.n.d
          </a>
        </div>

        {/* Site links */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          <Link href="/services" className="text-xs hover:underline" style={{ color: '#888888' }}>Services</Link>
          <Link href="/about"    className="text-xs hover:underline" style={{ color: '#888888' }}>About</Link>
          <Link href="/faq"      className="text-xs hover:underline" style={{ color: '#888888' }}>FAQ</Link>
          <Link href="/submit"   className="text-xs hover:underline" style={{ color: '#888888' }}>Request a Quote</Link>
        </div>

        <p className="text-xs" style={{ color: '#888888' }}>
          © {new Date().getFullYear()} Walker Property Services · Philadelphia &amp; Tri-State Area
        </p>
      </div>
    </footer>
  )
}
