export interface Location {
  slug: string
  name: string
  region: string
}

export const ALL_LOCATIONS: Location[] = [
  // Philadelphia (15)
  { slug: 'center-city-philadelphia', name: 'Center City', region: 'Philadelphia' },
  { slug: 'north-philadelphia', name: 'North Philadelphia', region: 'Philadelphia' },
  { slug: 'south-philadelphia', name: 'South Philadelphia', region: 'Philadelphia' },
  { slug: 'west-philadelphia', name: 'West Philadelphia', region: 'Philadelphia' },
  { slug: 'northeast-philadelphia', name: 'Northeast Philadelphia', region: 'Philadelphia' },
  { slug: 'germantown-philadelphia', name: 'Germantown', region: 'Philadelphia' },
  { slug: 'kensington-philadelphia', name: 'Kensington', region: 'Philadelphia' },
  { slug: 'fishtown-philadelphia', name: 'Fishtown', region: 'Philadelphia' },
  { slug: 'manayunk-philadelphia', name: 'Manayunk', region: 'Philadelphia' },
  { slug: 'chestnut-hill-philadelphia', name: 'Chestnut Hill', region: 'Philadelphia' },
  { slug: 'roxborough-philadelphia', name: 'Roxborough', region: 'Philadelphia' },
  { slug: 'port-richmond-philadelphia', name: 'Port Richmond', region: 'Philadelphia' },
  { slug: 'olney-philadelphia', name: 'Olney', region: 'Philadelphia' },
  { slug: 'mount-airy-philadelphia', name: 'Mount Airy', region: 'Philadelphia' },
  { slug: 'fairmount-philadelphia', name: 'Fairmount', region: 'Philadelphia' },
  // The Main Line (11)
  { slug: 'ardmore', name: 'Ardmore', region: 'The Main Line' },
  { slug: 'bryn-mawr', name: 'Bryn Mawr', region: 'The Main Line' },
  { slug: 'wayne', name: 'Wayne', region: 'The Main Line' },
  { slug: 'paoli', name: 'Paoli', region: 'The Main Line' },
  { slug: 'haverford', name: 'Haverford', region: 'The Main Line' },
  { slug: 'villanova', name: 'Villanova', region: 'The Main Line' },
  { slug: 'merion-station', name: 'Merion Station', region: 'The Main Line' },
  { slug: 'narberth', name: 'Narberth', region: 'The Main Line' },
  { slug: 'berwyn', name: 'Berwyn', region: 'The Main Line' },
  { slug: 'malvern', name: 'Malvern', region: 'The Main Line' },
  { slug: 'devon', name: 'Devon', region: 'The Main Line' },
  // Delaware County (8)
  { slug: 'media', name: 'Media', region: 'Delaware County' },
  { slug: 'upper-darby', name: 'Upper Darby', region: 'Delaware County' },
  { slug: 'springfield', name: 'Springfield', region: 'Delaware County' },
  { slug: 'swarthmore', name: 'Swarthmore', region: 'Delaware County' },
  { slug: 'chester', name: 'Chester', region: 'Delaware County' },
  { slug: 'lansdowne', name: 'Lansdowne', region: 'Delaware County' },
  { slug: 'folcroft', name: 'Folcroft', region: 'Delaware County' },
  { slug: 'ridley-park', name: 'Ridley Park', region: 'Delaware County' },
  // Montgomery County (9)
  { slug: 'norristown', name: 'Norristown', region: 'Montgomery County' },
  { slug: 'king-of-prussia', name: 'King of Prussia', region: 'Montgomery County' },
  { slug: 'lansdale', name: 'Lansdale', region: 'Montgomery County' },
  { slug: 'horsham', name: 'Horsham', region: 'Montgomery County' },
  { slug: 'ambler', name: 'Ambler', region: 'Montgomery County' },
  { slug: 'jenkintown', name: 'Jenkintown', region: 'Montgomery County' },
  { slug: 'hatboro', name: 'Hatboro', region: 'Montgomery County' },
  { slug: 'pottstown', name: 'Pottstown', region: 'Montgomery County' },
  { slug: 'conshohocken', name: 'Conshohocken', region: 'Montgomery County' },
  // Bucks County (8)
  { slug: 'bensalem', name: 'Bensalem', region: 'Bucks County' },
  { slug: 'levittown', name: 'Levittown', region: 'Bucks County' },
  { slug: 'bristol', name: 'Bristol', region: 'Bucks County' },
  { slug: 'langhorne', name: 'Langhorne', region: 'Bucks County' },
  { slug: 'doylestown', name: 'Doylestown', region: 'Bucks County' },
  { slug: 'newtown-bucks-county', name: 'Newtown', region: 'Bucks County' },
  { slug: 'yardley', name: 'Yardley', region: 'Bucks County' },
  { slug: 'quakertown', name: 'Quakertown', region: 'Bucks County' },
  // South Jersey (8)
  { slug: 'camden-nj', name: 'Camden', region: 'South Jersey' },
  { slug: 'cherry-hill-nj', name: 'Cherry Hill', region: 'South Jersey' },
  { slug: 'voorhees-nj', name: 'Voorhees', region: 'South Jersey' },
  { slug: 'mount-laurel-nj', name: 'Mount Laurel', region: 'South Jersey' },
  { slug: 'moorestown-nj', name: 'Moorestown', region: 'South Jersey' },
  { slug: 'collingswood-nj', name: 'Collingswood', region: 'South Jersey' },
  { slug: 'haddonfield-nj', name: 'Haddonfield', region: 'South Jersey' },
  { slug: 'gloucester-city-nj', name: 'Gloucester City', region: 'South Jersey' },
  // Delaware (4)
  { slug: 'wilmington-de', name: 'Wilmington', region: 'Delaware' },
  { slug: 'newark-de', name: 'Newark', region: 'Delaware' },
  { slug: 'bear-de', name: 'Bear', region: 'Delaware' },
  { slug: 'middletown-de', name: 'Middletown', region: 'Delaware' },
]

export const LOCATION_REGIONS = [...new Set(ALL_LOCATIONS.map(l => l.region))]

export function getLocationBySlug(slug: string): Location | undefined {
  return ALL_LOCATIONS.find(l => l.slug === slug)
}

export function getNearbyLocations(location: Location, limit = 4): Location[] {
  return ALL_LOCATIONS
    .filter(l => l.region === location.region && l.slug !== location.slug)
    .slice(0, limit)
}
