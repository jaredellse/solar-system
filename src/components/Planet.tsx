import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
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
  onClick?: () => void
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
  onClick
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

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
      // Convert timeSpeed from days/second to appropriate orbital and rotation speeds
      const time = clock.getElapsedTime()
      
      // Orbital movement: 2π * timeSpeed / orbitalPeriod gives us the angle per second
      const orbitalSpeed = (2 * Math.PI * timeSpeed) / orbitPeriod
      const angle = time * orbitalSpeed
      
      groupRef.current.position.x = Math.cos(angle) * orbitRadius
      groupRef.current.position.z = Math.sin(angle) * orbitRadius

      // Planet rotation: 2π * timeSpeed / rotationPeriod gives us the rotation angle per second
      const rotationSpeed = (2 * Math.PI * timeSpeed) / rotationPeriod
      planetRef.current.rotation.y += rotationSpeed / 60 // Divide by 60 because useFrame runs ~60 times per second
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
        <mesh ref={planetRef} onClick={onClick}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshBasicMaterial
            map={texture}
            toneMapped={false}
          />
        </mesh>

        {/* Atmosphere effect for planets with atmosphere */}
        {hasAtmosphere && (
          <mesh>
            <sphereGeometry args={[radius * 1.05, 32, 32]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.1}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Planet label */}
        <Html distanceFactor={15}>
          <div style={{
            color: 'white',
            background: 'rgba(0,0,0,0.8)',
            padding: '5px 10px',
            borderRadius: '5px',
            transform: 'translate3d(-50%, -50%, 0)',
            pointerEvents: 'none'
          }}>
            {name}
          </div>
        </Html>
      </group>
    </>
  )
}