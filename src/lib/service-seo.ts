export interface ServiceSeo {
  title: string
  description: string
  serviceType: string
  whoFor: string[]
  faqs: { q: string; a: string }[]
}

export const SERVICE_SEO: Record<string, ServiceSeo> = {
  'property-turnovers-cleanouts': {
    title: 'Cleanouts & Junk Removal in Philadelphia | Walker',
    description: 'Apartment, estate, eviction, and foreclosure cleanouts plus tenant turnovers in Philadelphia and the tri-state area. Free quotes from photos.',
    serviceType: 'Junk removal and property cleanout',
    whoFor: ['Landlords between tenants', 'Property managers with recurring turnovers', 'Families handling an estate', 'Attorneys and banks with eviction or foreclosure properties'],
    faqs: [
      { q: 'What do you take in a cleanout?', a: 'Furniture, mattresses, appliances, boxes, clothing, household junk, and general debris — basically everything left behind in a unit, basement, garage, or whole house. Tell us about anything unusual in your request and we will confirm.' },
      { q: 'How is a cleanout priced?', a: 'By volume and difficulty. A few items typically runs about $150–$200, a half truck load about $200–$300, and a full load about $450–$600, with stairs, appliances, and heavy debris adding to the price. Send photos for an accurate quote.' },
      { q: 'Do you handle estate and eviction cleanouts?', a: 'Yes. We clear estates with care for families and executors, and handle eviction and foreclosure cleanouts for landlords, attorneys, and property owners across Philadelphia.' },
    ],
  },
  demolition: {
    title: 'Interior Demolition in Philadelphia | Walker Property Services',
    description: 'Kitchen and bathroom tear-outs, drywall and flooring removal, and selective interior demolition in Philadelphia, with debris hauled away. Free quotes.',
    serviceType: 'Interior and selective demolition',
    whoFor: ['Homeowners starting a renovation', 'Investors flipping a property', 'General contractors who need a space gutted', 'Landlords upgrading units'],
    faqs: [
      { q: 'What kind of demolition do you do?', a: 'Interior and selective demolition: kitchen and bathroom tear-outs, drywall, plaster, flooring, cabinets, and non-structural walls. We clear the space so your contractors can start right away.' },
      { q: 'Do you haul away the demolition debris?', a: 'Yes. Debris removal is part of the job — we tear out, load, and haul it away, or you can pair the work with a dumpster rental for larger projects.' },
      { q: 'How do I get a demolition quote?', a: 'Submit a request with the address, a description of what needs to come out, and photos. Every quote is free.' },
    ],
  },
  'commercial-office-services': {
    title: 'Commercial & Office Cleanouts in Philadelphia | Walker',
    description: 'Office, retail, and facility cleanouts plus construction site cleanup in Philadelphia and the tri-state area. Fast scheduling and free quotes.',
    serviceType: 'Commercial and office cleanout',
    whoFor: ['Businesses moving or downsizing', 'Commercial property managers', 'Retail tenants turning over a storefront', 'Contractors finishing a build-out'],
    faqs: [
      { q: 'Can you clear out an entire office?', a: 'Yes — desks, chairs, cubicles, filing cabinets, electronics, and general debris, from a single suite to a multi-floor facility.' },
      { q: 'Do you work around business hours?', a: 'Tell us your timing in your request and we will work with your schedule to keep downtime low.' },
      { q: 'Do you clean up construction sites?', a: 'Yes. We handle construction and build-out debris cleanup so the space is ready for the next trade or tenant.' },
    ],
  },
  'site-exterior-services': {
    title: 'Lot Cleanup, Shed & Fence Removal in Philadelphia | Walker',
    description: 'Overgrown lot cleanup, shed removal, fence removal, and bulk item hauling across Philadelphia and the tri-state area. Free quotes from photos.',
    serviceType: 'Lot cleanup and exterior removal',
    whoFor: ['Homeowners clearing a yard', 'Sellers improving curb appeal', 'Investors cleaning up vacant lots', 'Landlords with neglected exteriors'],
    faqs: [
      { q: 'Do you tear down and remove sheds?', a: 'Yes. We take down the shed, break it up, and haul away all of the materials and anything stored inside.' },
      { q: 'Can you clean up an overgrown or vacant lot?', a: 'Yes. We clear trash, debris, and bulk items from lots so the property is safe and presentable.' },
      { q: 'Do you remove old fencing?', a: 'Yes — wood, chain-link, and other common fencing, including hauling the materials away.' },
    ],
  },
  painting: {
    title: 'Interior Painting for Rentals in Philadelphia | Walker',
    description: 'Interior painting to get rental units and listings move-in ready, coordinated with cleanouts and turnover prep. Philadelphia and tri-state area.',
    serviceType: 'Interior painting',
    whoFor: ['Landlords turning over units', 'Sellers preparing to list', 'Property managers with multiple units', 'Investors finishing a rehab'],
    faqs: [
      { q: 'Can you paint right after a cleanout?', a: 'Yes. That is the point of using one vendor — we clear the unit and paint it as one coordinated job, so it is ready for the next tenant or showing faster.' },
      { q: 'Do you paint occupied homes?', a: 'Our painting service is focused on vacant units and properties being prepared for rent or sale. Describe your project in a request and we will let you know.' },
      { q: 'How is painting priced?', a: 'By the size of the space and its condition. Send photos and room count for a free quote.' },
    ],
  },
  'property-preparation': {
    title: 'Property Prep for Sale or Lease in Philadelphia | Walker',
    description: 'End-to-end property preparation — cleanout, debris removal, painting, and final clean-up — to get Philadelphia properties market-ready for sale or lease.',
    serviceType: 'Property preparation for sale or lease',
    whoFor: ['Sellers and listing agents', 'Landlords between leases', 'Investors preparing a flip for market', 'Estate executors'],
    faqs: [
      { q: 'What is included in property preparation?', a: 'Whatever it takes to make the property presentable: clearing it out, hauling debris, painting, and final clean-up, coordinated as one job with one invoice.' },
      { q: 'Do you work with real estate agents?', a: 'Yes. We regularly prepare properties for listing on an agent or seller timeline.' },
      { q: 'How fast can a property be ready?', a: 'It depends on the property. Send the address, your target date, and photos, and we will give you a quote and timeline.' },
    ],
  },
}
