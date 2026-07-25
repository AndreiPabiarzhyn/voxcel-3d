import type { VoxelData, VoxelKey } from '../../types/project'
import type { Challenge } from './challengeData'

export interface ChallengeProgress {
  filled: number
  total: number
}

/**
 * A target cell counts as filled the moment ANY cube sits there, regardless
 * of color — checking exact color match would mean a ghost cube and a real
 * (wrong-color) cube occupying the same spot at once, which is both a
 * z-fighting mess to render and needlessly picky for a 6-10 y/o.
 */
export function getChallengeProgress(
  challenge: Challenge,
  voxels: Record<VoxelKey, VoxelData>,
): ChallengeProgress {
  const keys = Object.keys(challenge.target) as VoxelKey[]
  let filled = 0
  for (const key of keys) {
    if (voxels[key]) filled++
  }
  return { filled, total: keys.length }
}
