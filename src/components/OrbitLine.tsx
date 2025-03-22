import { Line } from '@react-three/drei'
import { Vector3 } from 'three'

interface OrbitLineProps {
  radius: number
  color?: string
}

export function OrbitLine({ radius, color = '#ffffff20' }: OrbitLineProps) {
  const points: Vector3[] = []
  const segments = 128
  
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    points.push(
      new Vector3(
        Math.cos(theta) * radius,
        0,
        Math.sin(theta) * radius
      )
    )
  }

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.5}
      dashed={true}
      dashScale={100}
      dashSize={1}
      dashOffset={0}
    />
  )
} 