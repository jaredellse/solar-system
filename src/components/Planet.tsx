import { useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface PlanetProps {
  name: string
  radius: number
  orbitRadius: number
  orbitPeriod: number
  rotationPeriod: number
  textureUrl: string
  hasAtmosphere: boolean
  timeSpeed: number
  description: string
  realRadius?: number
  realDistance?: number
  isDescriptionVisible: boolean
  onDescriptionToggle: () => void
  showName: boolean
}

export default function Planet({
  name,
  radius,
  orbitRadius,
  orbitPeriod,
  rotationPeriod,
  textureUrl,
  hasAtmosphere,
  timeSpeed,
  description,
  realRadius,
  realDistance,
  isDescriptionVisible,
  onDescriptionToggle,
  showName
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  // Load the texture using useLoader
  const texture = useLoader(THREE.TextureLoader, textureUrl)
  texture.colorSpace = THREE.SRGBColorSpace

  // Create points for orbital line
  const points = []
  const segments = 128
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    points.push(new THREE.Vector3(
      Math.cos(theta) * orbitRadius,
      0,
      Math.sin(theta) * orbitRadius
    ))
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points)

  useFrame(({ clock }) => {
    if (planetRef.current && groupRef.current) {
      const time = clock.getElapsedTime()
      
      // Orbital movement
      const orbitalAngle = (2 * Math.PI * time * timeSpeed) / orbitPeriod
      groupRef.current.position.x = Math.cos(orbitalAngle) * orbitRadius
      groupRef.current.position.z = Math.sin(orbitalAngle) * orbitRadius

      // Planet rotation
      const rotationAngle = (2 * Math.PI * time * timeSpeed) / Math.abs(rotationPeriod)
      planetRef.current.rotation.y = rotationAngle * Math.sign(rotationPeriod)

      // Special rotation for Uranus (tilted 98 degrees)
      if (name === 'Uranus') {
        planetRef.current.rotation.z = Math.PI * 0.54 // ~98 degrees
      }
    }
  })

  return (
    <>
      {/* Orbital line */}
      <primitive object={new THREE.Line(
        orbitGeometry,
        new THREE.LineBasicMaterial({ color: '#666666', opacity: 0.5, transparent: true })
      )} />

      {/* Planet group */}
      <group ref={groupRef}>
        {/* Planet mesh */}
        <mesh 
          ref={planetRef} 
          onClick={(e) => {
            e.stopPropagation()
            onDescriptionToggle()
          }}
        >
          <sphereGeometry args={[radius, 64, 64]} />
          <meshBasicMaterial
            map={texture}
            toneMapped={false}
          />
        </mesh>

        {/* Saturn's rings */}
        {name === 'Saturn' && (
          <group rotation={[Math.PI * 0.1, 0, 0]}>
            {/* Inner ring (B ring) */}
            <mesh>
              <ringGeometry args={[radius * 1.4, radius * 1.7, 128]} />
              <meshStandardMaterial
                color="#F5EFE7"
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Outer ring (A ring) */}
            <mesh>
              <ringGeometry args={[radius * 1.7, radius * 2.0, 128]} />
              <meshStandardMaterial
                color="#EBE3D5"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}

        {/* Uranus's rings */}
        {name === 'Uranus' && (
          <group rotation={[Math.PI * 0.5, 0, Math.PI * 0.54]}>
            <mesh>
              <ringGeometry args={[radius * 1.4, radius * 1.8, 128]} />
              <meshBasicMaterial
                color="#B5C7D3"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}

        {/* Atmosphere effect for planets with atmosphere */}
        {hasAtmosphere && (
          <mesh>
            <sphereGeometry args={[radius * 1.05, 32, 32]} />
            <meshBasicMaterial
              color={name === 'Venus' ? '#FFE4B5' : '#ffffff'}
              transparent
              opacity={name === 'Venus' ? 0.3 : 0.1}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Planet Label */}
        {showName && (
          <Html
            position={[0, radius * (name === 'Mercury' || name === 'Venus' || name === 'Earth' || name === 'Mars' ? 1.8 : 1.2), 0]}
            style={{
              transition: 'all 0.2s',
              opacity: 1,
              transform: 'translate3d(-50%, -50%, 0)',
              pointerEvents: 'none'
            }}
            center
          >
            <div style={{
              color: 'white',
              background: 'rgba(0,0,0,0.8)',
              padding: '0.4em 0.8em',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              textShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}>
              {name}
            </div>
          </Html>
        )}

        {/* Description box */}
        {isDescriptionVisible && (
          <Html
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
            }}
            prepend
          >
            <div style={{
              color: 'white',
              background: 'rgba(0,0,0,0.9)',
              padding: '20px',
              borderRadius: '12px',
              width: '300px',
              position: 'relative',
              pointerEvents: 'auto',
              cursor: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDescriptionToggle()
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  width: '30px',
                  height: '30px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              >
                ×
              </button>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                paddingRight: '25px',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>{name}</h3>
              <p style={{ 
                margin: '0 0 15px 0', 
                fontSize: '18px', 
                lineHeight: '1.5',
                fontWeight: '400'
              }}>{description}</p>
              <div style={{
                fontSize: '16px',
                lineHeight: '1.4',
                opacity: 0.9
              }}>
                <p style={{ margin: '0 0 8px 0' }}>
                  Radius: {realRadius?.toLocaleString()} miles
                </p>
                <p style={{ margin: '0 0 8px 0' }}>
                  Distance from Sun: {realDistance?.toLocaleString()} million miles
                </p>
                <p style={{ margin: '0 0 8px 0' }}>
                  Orbital Period: {orbitPeriod} Earth days
                </p>
                <p style={{ margin: '0' }}>
                  Rotation Period: {Math.abs(rotationPeriod)} Earth days {rotationPeriod < 0 ? '(retrograde)' : ''}
                </p>
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  )
}