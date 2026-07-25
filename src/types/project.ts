export type VoxelKey = `${number},${number},${number}`

export interface VoxelData {
  color: string
}

export interface VoxelProject {
  id: string
  name: string
  gridSize: number
  voxels: Record<VoxelKey, VoxelData>
  createdAt: number
  updatedAt: number
}
