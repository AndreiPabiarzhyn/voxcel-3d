import type { VoxelData, VoxelKey } from '../../types/project'
import { voxelKey } from './key'

const PIG_PINK = '#f2a9c3'
const SNOUT_PINK = '#e087a8'

function fillBox(
  target: Record<VoxelKey, VoxelData>,
  color: string,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
) {
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      for (let z = z0; z <= z1; z++) {
        target[voxelKey(x, y, z)] = { color }
      }
    }
  }
}

// Footprint is 5 wide (x) x 5 tall (y) x 10 long (z) — comfortably inside
// the default 12x12x12 grid without needing to enlarge it. Offsets center
// it: x 4-7 (mid 5.5) and z 1-10 (mid 5.5) both land on the grid's center.
const OX = 3
const OZ = 1

/** The default starter build: a low-poly Minecraft-style pig, standing on
 * all four legs and facing +z. Used only when there's no autosaved
 * project yet (a genuinely fresh visit) — see projectStore's `savedProject`
 * check and the WelcomeModal that asks whether to keep it. */
export function buildStarterPig(): Record<VoxelKey, VoxelData> {
  const voxels: Record<VoxelKey, VoxelData> = {}

  // 4 legs, one under each corner of the body
  for (const dx of [1, 4]) {
    for (const dz of [1, 5]) {
      fillBox(voxels, PIG_PINK, OX + dx, OX + dx, 0, 1, OZ + dz, OZ + dz)
    }
  }
  // body
  fillBox(voxels, PIG_PINK, OX + 1, OX + 4, 2, 3, OZ + 1, OZ + 5)
  // head
  fillBox(voxels, PIG_PINK, OX + 1, OX + 4, 2, 3, OZ + 6, OZ + 8)
  // ears, one above each side of the head
  fillBox(voxels, PIG_PINK, OX + 1, OX + 1, 4, 4, OZ + 7, OZ + 7)
  fillBox(voxels, PIG_PINK, OX + 4, OX + 4, 4, 4, OZ + 7, OZ + 7)
  // snout — a small darker-pink nub on the lower face, protruding forward
  fillBox(voxels, SNOUT_PINK, OX + 2, OX + 3, 2, 2, OZ + 9, OZ + 9)
  // tail
  fillBox(voxels, PIG_PINK, OX + 2, OX + 2, 3, 3, OZ + 0, OZ + 0)

  return voxels
}
