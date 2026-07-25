import { Bvh } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useProjectStore } from '../store/projectStore'
import { CameraRig } from './CameraRig'
import { ChallengeGhost } from './ChallengeGhost'
import { GroundGrid } from './GroundGrid'
import { GroundPlane } from './GroundPlane'
import { Lighting } from './Lighting'
import { VoxelGrid } from './VoxelGrid'

export function Scene() {
  const gridSize = useProjectStore((state) => state.gridSize)

  return (
    <Canvas
      shadows
      camera={{ position: [10, 9, 10], fov: 45 }}
      // Needed so the PNG screenshot button can read back the canvas —
      // without it the browser is free to clear the drawing buffer right
      // after presenting a frame, and the capture can come out blank.
      gl={{ preserveDrawingBuffer: true }}
    >
      <color attach="background" args={['#1b2130']} />
      <Lighting />
      {/*
        R3F raycasts every clickable mesh on every pointer move to track
        hover state — fine for a handful of objects, but it scales
        linearly with the voxel count and gets choppy once a build has a
        few hundred cubes. Bvh indexes this group once and turns that
        into a fast tree lookup instead of a full per-object scan.
      */}
      <Bvh firstHitOnly>
        <GroundPlane size={gridSize} />
        <VoxelGrid />
      </Bvh>
      <GroundGrid size={gridSize} />
      <ChallengeGhost />
      <CameraRig />
    </Canvas>
  )
}
