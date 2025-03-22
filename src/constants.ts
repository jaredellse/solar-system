// All distances are in astronomical units (AU)
// All sizes are relative to Earth's radius (1 = 6371 km)
// Orbital periods in Earth days
// Rotation periods in Earth days (negative values indicate retrograde rotation)
// Colors are approximations of real appearances

// Scale factors to make visualization manageable
export const DISTANCE_SCALE = 20000 // Higher number = planets closer together
export const SIZE_SCALE = 2 // Higher number = smaller planets

export const SUN_DATA = {
  name: 'Sun',
  radius: 5, // Fixed size for visibility
  rotationPeriod: 27,
  color: '#FDB813',
  emissive: '#FDB813',
  textureMap: 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004816/lroc_color_poles_1k.jpg'
}

export const PLANETS_DATA = [
  {
    name: 'Mercury',
    radius: 1,
    distance: 10,
    orbitalPeriod: 88,
    rotationPeriod: 58.6,
    color: '#A5A5A5',
    textureMap: 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004841/mercury_4k.jpg'
  },
  {
    name: 'Venus',
    radius: 1.5,
    distance: 15,
    orbitalPeriod: 224.7,
    rotationPeriod: -243,
    color: '#E6B88A',
    textureMap: 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004842/venus_4k.jpg'
  },
  {
    name: 'Earth',
    radius: 1.5,
    distance: 20,
    orbitalPeriod: 365.25,
    rotationPeriod: 1,
    color: '#2E75FF',
    textureMap: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74393/world.200412.3x5400x2700.jpg'
  },
  {
    name: 'Mars',
    radius: 1,
    distance: 25,
    orbitalPeriod: 687,
    rotationPeriod: 1.03,
    color: '#FF3C3C',
    textureMap: 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004843/mars_4k.jpg'
  },
  {
    name: 'Jupiter',
    radius: 4,
    distance: 35,
    orbitalPeriod: 4331,
    rotationPeriod: 0.41,
    color: '#E0A064',
    textureMap: 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004844/jupiter_4k.jpg'
  },
  {
    name: 'Saturn',
    radius: 3.5,
    distance: 45,
    orbitalPeriod: 10747,
    rotationPeriod: 0.44,
    color: '#C5AB6E',
    textureMap: 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004845/saturn_4k.jpg'
  },
  {
    name: 'Uranus',
    radius: 2.5,
    distance: 55,
    orbitalPeriod: 30589,
    rotationPeriod: -0.72,
    color: '#9BB4B4',
    textureMap: 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004846/uranus_4k.jpg'
  },
  {
    name: 'Neptune',
    radius: 2.5,
    distance: 65,
    orbitalPeriod: 59800,
    rotationPeriod: 0.67,
    color: '#3C54E0',
    textureMap: 'https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004847/neptune_4k.jpg'
  }
]

export const TIME_SPEEDS = [
  { label: '1x', value: 1 },
  { label: '10x', value: 10 },
  { label: '100x', value: 100 },
  { label: '1000x', value: 1000 },
  { label: '10000x', value: 10000 }
] 