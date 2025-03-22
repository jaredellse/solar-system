import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

interface SunProps {
  textureUrl: string
  timeSpeed: number
}

export default function Sun({ textureUrl, timeSpeed }: SunProps) {
  const sunRef = useRef<THREE.Group>(null)

  // Load the texture using useLoader
  const texture = useLoader(THREE.TextureLoader, textureUrl)
  texture.colorSpace = THREE.SRGBColorSpace

  useFrame(({ clock }) => {
    if (sunRef.current) {
      const time = clock.getElapsedTime()
      // Sun rotates once every 27 Earth days
      const rotationAngle = (2 * Math.PI * time * timeSpeed) / 27
      sunRef.current.rotation.y = rotationAngle
    }
  })

  const sunRadius = 4 // Adjusted to match new planet scales

  return (
    <group ref={sunRef}>
      {/* Sun mesh */}
      <mesh>
        <sphereGeometry args={[sunRadius, 64, 64]} />
        <meshBasicMaterial
          map={texture}
          color="#ff9500"
          toneMapped={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[sunRadius * 1.05, 32, 32]} />
        <meshBasicMaterial
          color="#ff9500"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[sunRadius * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#ff9500"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Add a strong point light */}
      <pointLight
        intensity={2}
        distance={100}
        decay={1}
        color="#ff9500"
      />
    </group>
  )
} 