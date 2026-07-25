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
  // Voxels render at world position = their index (Voxel.tsx), so the
  // grid's visual middle — where GroundPlane/GroundGrid already center
  // themselves, and where the starter pig sits — is (gridSize-1)/2, not
  // the world origin. The camera used to default to looking at (0,0,0),
  // a corner of the grid, which is exactly why the pig was hard to find:
  // shifting both the camera's start position and its look-at target by
  // the same offset keeps the identical angle/zoom, just re-centered on
  // the grid's middle instead of its corner.
  const center = (gridSize - 1) / 2

  return (
    <Canvas
      shadows
      camera={{ position: [center + 10, 9, center + 10], fov: 45 }}
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
      <CameraRig center={center} />
    </Canvas>
  )
}
