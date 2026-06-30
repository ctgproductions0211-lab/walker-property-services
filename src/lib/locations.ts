export interface LocationData {
  name: string
  slug: string
  region: string
  distanceNote?: string
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const DELAWARE_NOTE =
  'Due to travel distance, our Delaware service area is focused on larger commercial and residential projects — dumpster rentals, full property cleanouts, and demolition work — rather than small single-item pickups.'

const OUTER_NOTE =
  'Due to travel distance, service in this area is best suited for larger projects — full property cleanouts, demolition, dumpster rentals, and multi-unit turnovers — rather than small single-item pickups.'

const OUTER_BUCKS = new Set(['Doylestown', 'Newtown', 'Yardley'])

interface RawRegion {
  region: string
  note?: string
  locations: string[]
}

const RAW_REGIONS: RawRegion[] = [
  {
    region: 'Philadelphia',
    locations: [
      'Center City', 'North Philadelphia', 'South Philadelphia', 'West Philadelphia',
      'Northeast Philadelphia', 'Germantown', 'Kensington', 'Fishtown', 'Manayunk',
      'Chestnut Hill', 'Roxborough', 'Strawberry Mansion', 'Port Richmond',
      'Brewerytown', 'Northern Liberties',
    ],
  },
  {
    region: 'The Main Line',
    locations: [
      'Ardmore', 'Haverford', 'Bryn Mawr', 'Wayne', 'Paoli',
      'Malvern', 'Berwyn', 'Devon', 'Radnor', 'Villanova', 'Lower Merion',
    ],
  },
  {
    region: 'Delaware County',
    locations: [
      'Media', 'Upper Darby', 'Chester', 'Springfield', 'Ridley Park',
      'Drexel Hill', 'Swarthmore', 'Brookhaven',
    ],
  },
  {
    region: 'Montgomery County',
    locations: [
      'Norristown', 'King of Prussia', 'Lansdale', 'Horsham', 'Ambler',
      'Jenkintown', 'Abington', 'Conshohocken', 'Plymouth Meeting',
    ],
  },
  {
    region: 'Bucks County',
    locations: [
      'Bensalem', 'Bristol', 'Levittown', 'Langhorne', 'Warminster',
      'Doylestown', 'Newtown', 'Yardley',
    ],
  },
  {
    region: 'South Jersey',
    locations: [
      'Camden', 'Cherry Hill', 'Voorhees', 'Moorestown', 'Mount Laurel',
      'Marlton', 'Haddonfield', 'Collingswood',
    ],
  },
  {
    region: 'Delaware',
    note: DELAWARE_NOTE,
    locations: ['Wilmington', 'Newark', 'New Castle', 'Middletown'],
  },
]

export const ALL_LOCATIONS: LocationData[] = RAW_REGIONS.flatMap(({ region, note, locations }) =>
  locations.map(name => ({
    name,
    slug: toSlug(name),
    region,
    distanceNote: note ?? (OUTER_BUCKS.has(name) ? OUTER_NOTE : undefined),
  }))
)

export function getLocationBySlug(slug: string): LocationData | undefined {
  return ALL_LOCATIONS.find(l => l.slug === slug)
}

export function getNearbyLocations(location: LocationData): LocationData[] {
  return ALL_LOCATIONS.filter(l => l.region === location.region && l.slug !== location.slug)
}

export const LOCATION_REGIONS = RAW_REGIONS.map(r => ({
  region: r.region,
  locations: r.locations.map(name => ({ name, slug: toSlug(name) })),
}))
