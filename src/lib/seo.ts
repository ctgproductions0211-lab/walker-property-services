import { getSiteUrl } from '@/lib/site-url'

export const BUSINESS = {
  name: 'Walker Property Services',
  email: 'Edward@walkerpropservices.com',
  instagram: 'https://www.instagram.com/walker_a.n.d/',
  description:
    'Philadelphia property services company providing junk removal, property cleanouts, estate and eviction cleanouts, interior demolition, tenant turnovers, painting, and dumpster rentals across Philadelphia, Northeast Philadelphia, the Main Line, and the PA/NJ/DE tri-state area.',
  services: [
    'Junk Removal',
    'Property Cleanouts',
    'Estate Cleanouts',
    'Eviction & Foreclosure Cleanouts',
    'Apartment & Tenant Turnovers',
    'Interior Demolition',
    'Kitchen & Bathroom Demolition',
    'Dumpster Rentals',
    'Commercial & Office Cleanouts',
    'Interior Painting',
    'Property Preparation',
  ],
}

export const NORTHEAST_PHILLY = {
  slug: 'northeast-philadelphia',
  neighborhoods: [
    'Mayfair', 'Frankford', 'Tacony', 'Holmesburg', 'Fox Chase', 'Rhawnhurst',
    'Bustleton', 'Somerton', 'Torresdale', 'Morrell Park', 'Parkwood', 'Castor',
    'Oxford Circle', 'Lawncrest', 'Burholme', 'Wissinoming', 'Bridesburg', 'Academy Gardens',
  ],
  zipCodes: ['19111', '19114', '19115', '19116', '19120', '19124', '19135', '19136', '19137', '19149', '19152', '19154'],
}

export function locationFaqs(name: string): { q: string; a: string }[] {
  return [
    {
      q: `Do you offer junk removal and cleanouts in ${name}?`,
      a: `Yes. Walker Property Services provides junk removal, full property cleanouts, estate cleanouts, eviction cleanouts, and tenant turnovers in ${name}. Submit a request online with photos and we will follow up with a free quote.`,
    },
    {
      q: `How much does a cleanout cost in ${name}?`,
      a: 'Pricing depends on how much needs to go and how hard it is to remove. Typical truck loads range from about $150 for a few items to $600 for a full load, with larger multi-load jobs quoted individually. Sending photos with your request gets you the fastest, most accurate quote.',
    },
    {
      q: `Do you do demolition in ${name}?`,
      a: `Yes. We handle interior and selective demolition in ${name}, including kitchen and bathroom tear-outs, drywall, and flooring removal, and we haul away the debris.`,
    },
    {
      q: `Can I rent a dumpster in ${name}?`,
      a: `Yes. We offer 10, 15, 20, and 30 yard dumpster rentals in ${name}, or a crew can load and haul everything for you instead.`,
    },
    {
      q: 'How do I get a quote?',
      a: 'Use the Request a Job form on walkerpropservices.com. Add the address, a short description, and photos. You get a tracking code to check your job status anytime, and estimates are free.',
    },
  ]
}

export function businessJsonLd(areaServed: string[]) {
  const url = getSiteUrl()
  return {
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${url}/#business`,
    name: BUSINESS.name,
    url,
    email: BUSINESS.email,
    image: `${url}/logo.jpg`,
    logo: `${url}/logo.jpg`,
    description: BUSINESS.description,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Philadelphia', addressRegion: 'PA', addressCountry: 'US' },
    areaServed: areaServed.map((name) => ({ '@type': 'Place', name })),
    sameAs: [BUSINESS.instagram],
    knowsAbout: BUSINESS.services,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Property services',
      itemListElement: BUSINESS.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s } })),
    },
  }
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  const url = getSiteUrl()
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '' }, ...trail].map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.name, item: `${url}${t.path}`,
    })),
  }
}

export function pageJsonLd(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
