import { useTexture } from '@react-three/drei'

export function SpaceBackground() {
  const texture = useTexture('/textures/space.jpg')
  
  return (
    <mesh>
      <sphereGeometry args={[1000, 32, 32]} />
      <meshBasicMaterial 
        map={texture}
        side={1}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
} 