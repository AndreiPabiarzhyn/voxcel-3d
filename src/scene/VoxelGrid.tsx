import type { VoxelKey } from '../types/project'
import { parseVoxelKey } from '../lib/voxel/key'
import { useProjectStore } from '../store/projectStore'
import { Voxel } from './Voxel'

export function VoxelGrid() {
  const voxels = useProjectStore((state) => state.voxels)

  return (
    <group>
      {Object.entries(voxels).map(([key, data]) => {
        const [x, y, z] = parseVoxelKey(key as VoxelKey)
        return <Voxel key={key} x={x} y={y} z={z} color={data.color} />
      })}
    </group>
  )
}
