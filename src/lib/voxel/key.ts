import type { VoxelKey } from '../../types/project'

export function voxelKey(x: number, y: number, z: number): VoxelKey {
  return `${x},${y},${z}`
}

export function parseVoxelKey(key: VoxelKey): [number, number, number] {
  const [x, y, z] = key.split(',').map(Number)
  return [x, y, z]
}
