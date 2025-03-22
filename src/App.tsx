import { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Sun from './components/Sun'
import Planet from './components/Planet'
import Stars from './components/Stars'
import { textureUrls } from './textures'
import './App.css'

// Time speed options (Earth days per second)
const TIME_SPEEDS = [
  { label: '1 Hour', value: 1/24 },      // 1 hour per second
  { label: '1 Day', value: 1 },          // 1 day per second
  { label: '1 Week', value: 7 },         // 1 week per second
  { label: '1 Month', value: 30 },       // 1 month per second
  { label: '1 Year', value: 365 }        // 1 year per second
]

// Constants for display only (actual measurements)
const REAL_PLANET_DATA = {
  Mercury: { 
    radius: 1516, // miles
    distance: 35.98, // million miles
    description: "The smallest planet and closest to the Sun"
  },
  Venus: { 
    radius: 3760.4, 
    distance: 67.24,
    description: "Often called Earth's sister planet due to similar size"
  },
  Earth: { 
    radius: 3958.8, 
    distance: 92.96,
    description: "Our home planet, the only known world with liquid water oceans"
  },
  Mars: { 
    radius: 2106.1, 
    distance: 141.6,
    description: "The Red Planet, home to the largest volcano in the solar system"
  },
  Jupiter: { 
    radius: 43441, 
    distance: 483.8,
    description: "The largest planet, with its famous Great Red Spot storm"
  },
  Saturn: { 
    radius: 36184, 
    distance: 890.8,
    description: "Known for its spectacular ring system"
  },
  Uranus: { 
    radius: 15759, 
    distance: 1784,
    description: "The tilted planet, rotating on its side"
  },
  Neptune: { 
    radius: 15299, 
    distance: 2793,
    description: "The windiest planet, with speeds up to 1,200 mph"
  }
}

// Planet data with realistic textures and adjusted sizes
const planets = [
  {
    name: 'Mercury',
    radius: 0.8,
    orbitRadius: 10,
    orbitPeriod: 88,
    rotationPeriod: 59,
    textureUrl: './textures/mercury.jpg',
    hasAtmosphere: false
  },
  {
    name: 'Venus',
    radius: 1.2,
    orbitRadius: 15,
    orbitPeriod: 225,
    rotationPeriod: -243,
    textureUrl: './textures/venus.jpg',
    hasAtmosphere: true
  },
  {
    name: 'Earth',
    radius: 1.3,
    orbitRadius: 20,
    orbitPeriod: 365,
    rotationPeriod: 1,
    textureUrl: './textures/earth.jpg',
    hasAtmosphere: true
  },
  {
    name: 'Mars',
    radius: 0.9,
    orbitRadius: 25,
    orbitPeriod: 687,
    rotationPeriod: 1.03,
    textureUrl: './textures/mars.jpg',
    hasAtmosphere: false
  },
  {
    name: 'Jupiter',
    radius: 3.5,
    orbitRadius: 35,
    orbitPeriod: 4333,
    rotationPeriod: 0.41,
    textureUrl: './textures/jupiter.jpg',
    hasAtmosphere: true
  },
  {
    name: 'Saturn',
    radius: 3.0,
    orbitRadius: 45,
    orbitPeriod: 10759,
    rotationPeriod: 0.45,
    textureUrl: './textures/saturn.jpg',
    hasAtmosphere: true
  },
  {
    name: 'Uranus',
    radius: 2.0,
    orbitRadius: 55,
    orbitPeriod: 30687,
    rotationPeriod: -0.72,
    textureUrl: './textures/uranus.jpg',
    hasAtmosphere: true
  },
  {
    name: 'Neptune',
    radius: 1.8,
    orbitRadius: 65,
    orbitPeriod: 60190,
    rotationPeriod: 0.67,
    textureUrl: './textures/neptune.jpg',
    hasAtmosphere: true
  }
]

function TimeControls({ timeSpeed, setTimeSpeed }: { 
  timeSpeed: number
  setTimeSpeed: (speed: number) => void 
}) {
  return (
    <div className="time-controls">
      <div className="time-controls-title">Simulation Speed</div>
      <div className="time-controls-buttons">
        {TIME_SPEEDS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setTimeSpeed(value)}
            className={timeSpeed === value ? 'active' : ''}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PlanetInfo({ planet }: { planet: typeof planets[0] }) {
  const realData = REAL_PLANET_DATA[planet.name as keyof typeof REAL_PLANET_DATA]
  return (
    <div className="planet-info">
      <h2>{planet.name}</h2>
      <p>{realData.description}</p>
      <p>Radius: {realData.radius.toLocaleString()} miles</p>
      <p>Distance from Sun: {realData.distance.toLocaleString()} million miles</p>
      <p>Orbital Period: {planet.orbitPeriod} Earth days</p>
      <p>Rotation Period: {Math.abs(planet.rotationPeriod)} Earth days {planet.rotationPeriod < 0 ? '(retrograde)' : ''}</p>
    </div>
  )
}

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [timeSpeed, setTimeSpeed] = useState(TIME_SPEEDS[0].value)
  const [activeDescription, setActiveDescription] = useState<string | null>(null)
  const [showPlanetNames, setShowPlanetNames] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 50, 100], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.1} />
        <Stars />
        <OrbitControls />
        <pointLight position={[0, 0, 0]} intensity={2} distance={100} decay={1} />
        
        <Suspense fallback={null}>
          {/* Sun */}
          <Sun textureUrl="./textures/sun.jpg" timeSpeed={timeSpeed} />
          
          {/* Planets */}
          {planets.map((planet) => (
            <Planet
              key={planet.name}
              {...planet}
              timeSpeed={timeSpeed}
              description={REAL_PLANET_DATA[planet.name as keyof typeof REAL_PLANET_DATA].description}
              realRadius={REAL_PLANET_DATA[planet.name as keyof typeof REAL_PLANET_DATA].radius}
              realDistance={REAL_PLANET_DATA[planet.name as keyof typeof REAL_PLANET_DATA].distance}
              isDescriptionVisible={activeDescription === planet.name}
              onDescriptionToggle={() => {
                setActiveDescription(activeDescription === planet.name ? null : planet.name)
              }}
              showName={showPlanetNames}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* UI Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'flex-end',
        gap: '20px',
        color: 'white'
      }}>
        <TimeControls 
          timeSpeed={timeSpeed} 
          setTimeSpeed={setTimeSpeed}
        />

        <button
          onClick={() => setShowPlanetNames(!showPlanetNames)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '300px' : 'none',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}
        >
          <span style={{ 
            display: 'inline-block',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: showPlanetNames ? '#4CAF50' : '#666',
            transition: 'background 0.2s ease'
          }} />
          Planet Names
        </button>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .time-controls {
              width: 100%;
              max-width: 300px;
            }
            .time-controls-buttons {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .time-controls-buttons button {
              flex: 1;
              min-width: 80px;
            }
          }
        `}
      </style>
    </div>
  )
}

export default App
