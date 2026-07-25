import type { ThreeEvent } from '@react-three/fiber'
import { playPlaceSound } from '../lib/audio/sounds'
import { useProjectStore } from '../store/projectStore'
import { useClickWithoutDrag } from './useClickWithoutDrag'

interface GroundPlaneProps {
  size: number
}

/**
 * Invisible click-catcher covering the floor so "place" also works on
 * empty ground, not just on the face of an existing cube. Three.js still
 * raycasts against invisible meshes, so it stays undrawn but clickable.
 */
export function GroundPlane({ size }: GroundPlaneProps) {
  const tool = useProjectStore((state) => state.tool)
  const addVoxel = useProjectStore((state) => state.addVoxel)

  const handleClick = (event: ThreeEvent<PointerEvent>) => {
    if (event.button !== 0 || tool !== 'place') return
    event.stopPropagation()
    playPlaceSound()
    addVoxel(Math.round(event.point.x), 0, Math.round(event.point.z))
  }

  const dragGuard = useClickWithoutDrag(handleClick)

  return (
    <mesh
      position={[(size - 1) / 2, -0.5, (size - 1) / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
      {...dragGuard}
    >
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial />
    </mesh>
  )
}
