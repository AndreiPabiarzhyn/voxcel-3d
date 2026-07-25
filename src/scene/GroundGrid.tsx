import { Grid } from '@react-three/drei'

interface GroundGridProps {
  size: number
}

export function GroundGrid({ size }: GroundGridProps) {
  return (
    <Grid
      position={[size / 2 - 0.5, -0.51, size / 2 - 0.5]}
      args={[size, size]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#8892a6"
      sectionColor="#4c5a70"
      sectionSize={4}
      fadeDistance={30}
      infiniteGrid={false}
    />
  )
}
