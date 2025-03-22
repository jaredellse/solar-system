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
  const [showControls, setShowControls] = useState(true)

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
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        width: '90%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Toggle Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            color: 'white',
            padding: '4px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: window.innerWidth <= 768 ? '11px' : '14px'
          }}
        >
          <span style={{
            display: 'inline-block',
            transform: `rotate(${showControls ? '180deg' : '0deg'})`,
            transition: 'transform 0.3s ease'
          }}>▼</span>
          Controls
        </button>

        {/* Controls Panel */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          width: '100%',
          maxHeight: showControls ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, padding 0.3s ease',
          padding: showControls ? (window.innerWidth <= 768 ? '10px' : '15px') : '0'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: window.innerWidth <= 768 ? '10px' : '20px',
            alignItems: 'start'
          }}>
            {/* Simulation Speed Controls */}
            <div>
              <div style={{ 
                marginBottom: window.innerWidth <= 768 ? '5px' : '10px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                fontSize: window.innerWidth <= 768 ? '12px' : '14px'
              }}>
                Simulation Speed
              </div>
              <div className="time-controls-buttons" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                gap: '8px'
              }}>
                {TIME_SPEEDS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setTimeSpeed(value)}
                    className={timeSpeed === value ? 'active' : ''}
                    style={{
                      padding: window.innerWidth <= 768 ? '4px' : '8px',
                      background: timeSpeed === value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      width: '100%',
                      fontSize: window.innerWidth <= 768 ? '11px' : '14px'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Planet Names Toggle */}
            <div>
              <div style={{ 
                marginBottom: window.innerWidth <= 768 ? '5px' : '10px', 
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: window.innerWidth <= 768 ? '12px' : '14px'
              }}>
                Planet Names
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                gap: '8px'
              }}>
                <button
                  onClick={() => setShowPlanetNames(true)}
                  style={{
                    padding: window.innerWidth <= 768 ? '4px' : '8px',
                    background: showPlanetNames ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: window.innerWidth <= 768 ? '11px' : '14px'
                  }}
                >
                  Show
                </button>
                <button
                  onClick={() => setShowPlanetNames(false)}
                  style={{
                    padding: window.innerWidth <= 768 ? '4px' : '8px',
                    background: !showPlanetNames ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: window.innerWidth <= 768 ? '11px' : '14px'
                  }}
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .time-controls {
              width: 100%;
              max-width: 300px;
            }
            .time-controls-title {
              text-align: center;
              margin-bottom: 8px;
            }
            .time-controls-buttons {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
              gap: 8px;
            }
            .time-controls-buttons button {
              width: 100%;
              white-space: nowrap;
            }
          }
        `}
      </style>
    </div>
  )
}

export default App
