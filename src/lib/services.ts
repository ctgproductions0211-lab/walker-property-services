export interface ServiceCategory {
  slug: string
  title: string
  shortDescription: string
  intro: string
  items: string[]
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: 'property-turnovers-cleanouts',
    title: 'Property Turnovers & Cleanouts',
    shortDescription: 'Fast, thorough cleanouts for landlords, property managers, and families clearing out residential units.',
    intro:
      'Whether you need a single apartment cleared between tenants or an entire estate handled with care, Walker Property Services delivers fast, thorough cleanouts across the Philadelphia tri-state area. We work with landlords, property managers, attorneys, and families to get properties cleared and ready for the next chapter — on your timeline.',
    items: [
      'Apartment Cleanout',
      'Student Housing Turnovers',
      'Estate Cleanouts',
      'Eviction Cleanouts',
      'Foreclosure Cleanouts',
      'Multifamily Property Services',
    ],
  },
  {
    slug: 'demolition',
    title: 'Demolition',
    shortDescription: 'Safe, efficient interior and selective demolition for renovation and redevelopment projects.',
    intro:
      'Our demolition crews handle controlled interior teardowns with the precision your project demands. From gutting a kitchen to removing a single wall, we work cleanly and efficiently — clearing the space so your contractors can move in without delay. We serve homeowners, investors, and general contractors throughout the region.',
    items: [
      'Interior Demolition',
      'Selective Demolition',
      'Kitchen & Bathroom Demolition',
      'Drywall & Flooring Removal',
    ],
  },
  {
    slug: 'commercial-office-services',
    title: 'Commercial & Office Services',
    shortDescription: 'Commercial cleanouts and space preparation for offices, retail storefronts, and facilities.',
    intro:
      'Transitioning a commercial space takes speed and professionalism. We help businesses, property managers, and developers clear out offices, retail locations, and facilities quickly — minimizing downtime and getting the space ready for its next use. From a single-suite office to a multi-floor facility, we handle the heavy lifting.',
    items: [
      'Commercial Cleanouts',
      'Office Cleanouts',
      'Retail Space Preparation',
      'Facilities Cleanouts',
      'Construction Site Cleanup',
    ],
  },
  {
    slug: 'site-exterior-services',
    title: 'Site & Exterior Services',
    shortDescription: 'Lot clearing, fence and shed removal, and bulk item hauling to clean up your outdoor space.',
    intro:
      'First impressions start at the curb. Our site and exterior services tackle the outdoor work that makes a property look neglected — overgrown lots, aging sheds, unwanted fencing, and piles of bulk debris. We haul it away completely so your property shows well, sells well, and is ready for whatever comes next.',
    items: [
      'Lot Cleanup',
      'Fence Removal',
      'Shed Removal',
      'Bulk Item Removal',
    ],
  },
  {
    slug: 'painting',
    title: 'Painting',
    shortDescription: 'Professional interior painting to freshen up units and prepare properties for sale or rent.',
    intro:
      'A fresh coat of paint is one of the fastest ways to add value and appeal to any property. Walker Property Services offers professional painting as part of our full-service property preparation — coordinated alongside cleanouts and prep work so you only need one call to get a unit move-in ready.',
    items: [
      'Painting Services',
      'Interior Painting',
    ],
  },
  {
    slug: 'property-preparation',
    title: 'Property Preparation',
    shortDescription: 'End-to-end property prep services to get your property market-ready for sale or lease.',
    intro:
      'Getting a property ready to list or lease involves more than a cleanout. Our property preparation service coordinates everything needed to present a clean, attractive, move-in-ready space — from initial clearing to final touch-ups. We work with sellers, landlords, and real estate professionals across the Philadelphia area.',
    items: [
      'Property Preparation for Sale or Leasing',
    ],
  },
]

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find(c => c.slug === slug)
}
