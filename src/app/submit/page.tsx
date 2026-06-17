import Link from 'next/link'
import SubmitForm from './_components/SubmitForm'

export default function SubmitPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0d1b2a' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#c9a558' }}>
              <span className="font-bold text-sm" style={{ color: '#0d1b2a' }}>W</span>
            </div>
            <span className="font-semibold" style={{ color: '#f5f7fa' }}>Walker Property Services</span>
          </Link>
          <Link href="/track" className="text-sm" style={{ color: '#8a9bb0' }}>
            Track a job
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#f5f7fa' }}>Request a Job</h1>
          <p style={{ color: '#8a9bb0' }}>
            Fill in the details below and we&apos;ll get back to you with a quote.
          </p>
        </div>

        <SubmitForm />
      </main>
    </div>
  )
}
