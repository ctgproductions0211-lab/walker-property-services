import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FAQ | Walker Property Services',
  description: 'Common questions about property cleanouts, demolition, dumpster rentals, service areas, free estimates, and before/after documentation from Walker Property Services.',
}

const FAQS = [
  {
    question: 'Do you handle same-day cleanouts?',
    answer:
      'Yes — in many cases. Availability depends on current workload and job size, but we routinely accommodate same-day and next-day requests. Submit your job through the request form and note your timeline; we\'ll confirm availability and do our best to make it work.',
  },
  {
    question: 'Do you offer dumpster rental?',
    answer:
      'We don\'t offer standalone dumpster rental, but dumpster-based removal is included as part of our cleanout service. We bring the container, load everything, and haul it away — you don\'t have to manage a permit, a rental timeline, or a pickup schedule.',
  },
  {
    question: 'What areas do you service?',
    answer:
      'Walker Property Services is based in Philadelphia and covers the surrounding tri-state area, including Delaware County, Montgomery County, Bucks County, and parts of South Jersey and Delaware. If you\'re unsure whether your location is covered, submit a job request and we\'ll confirm.',
  },
  {
    question: 'Do you handle commercial properties or only residential?',
    answer:
      'We work with both residential and commercial properties. Our clients include individual landlords, property management companies, and commercial property owners with office spaces, retail units, and multi-unit buildings. Submit your request with details on the property type and scope and we\'ll provide a tailored quote.',
  },
  {
    question: 'Can you provide before-and-after documentation for my insurance or records?',
    answer:
      'Yes — before-and-after photo documentation is standard on every job. Photos are logged against your job\'s unique tracking code and can be accessed at any time. Share them with an insurance carrier, property owner, or keep them for your own accounting records.',
  },
  {
    question: 'Do you offer free estimates?',
    answer:
      'Yes, all estimates are free. Describe your project in the job request form and we\'ll respond with a clear, firm price. For larger or more complex jobs, we may schedule a brief site visit before finalizing the quote.',
  },
  {
    question: "What's the difference between a cleanout and a demolition job?",
    answer:
      'A cleanout involves removing the contents of a property — furniture, junk, trash, and debris left behind by tenants or previous owners. A demolition job involves physically removing building materials, such as tearing out walls, flooring, cabinets, or fixtures. Walker Property Services handles both, and many jobs involve elements of each.',
  },
  {
    question: 'Do you work with property management companies on recurring contracts?',
    answer:
      'Yes — recurring service is one of our specialties. Property managers with multiple units or full portfolios can work out ongoing turnover arrangements with consistent pricing and priority scheduling. Mention in your request that you\'re looking for recurring support and we\'ll discuss the best approach for your portfolio.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen flex flex-col" style={{ background: '#111111' }}>
        <header className="border-b border-white/10 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Image src="/logo.jpg" alt="" aria-hidden={true} width={40} height={40} style={{ objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }} />
              <span className="font-semibold" style={{ color: '#f0f0f0' }}>Walker Property Services</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/services" className="text-sm" style={{ color: '#888888' }}>Services</Link>
              <Link
                href="/submit"
                className="text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110"
                style={{ background: '#6B8C23', color: '#ffffff' }}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">

          {/* Hero */}
          <div className="mb-12">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ background: 'rgba(107,140,35,0.15)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.3)' }}
            >
              Common Questions
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#f0f0f0' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#888888' }}>
              Everything you need to know about working with Walker Property Services.
              Don&apos;t see your question here?{' '}
              <Link href="/submit" className="underline" style={{ color: '#6B8C23' }}>
                Submit a request
              </Link>{' '}
              and we&apos;ll get back to you.
            </p>
          </div>

          {/* FAQ list */}
          <div className="flex flex-col gap-3 mb-16">
            {FAQS.map(({ question, answer }) => (
              <div
                key={question}
                className="rounded-xl p-6"
                style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}
              >
                <h2 className="font-bold text-base mb-3" style={{ color: '#f0f0f0' }}>
                  {question}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>
                  {answer}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: 'rgba(107,140,35,0.08)', border: '1px solid rgba(107,140,35,0.2)' }}
          >
            <h2 className="text-xl font-bold mb-2" style={{ color: '#f0f0f0' }}>
              Ready to get started?
            </h2>
            <p className="text-sm mb-5" style={{ color: '#888888' }}>
              Free estimates. Fast response. Philadelphia &amp; tri-state area.
            </p>
            <Link
              href="/submit"
              className="inline-block px-8 py-4 rounded-lg font-semibold transition-all hover:brightness-110 active:scale-95"
              style={{ background: '#6B8C23', color: '#ffffff' }}
            >
              Request a Free Quote
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
