import amongusIcon from '../../assets/challengeIcons/amongus.svg'
import houseIcon from '../../assets/challengeIcons/house.svg'
import treeIcon from '../../assets/challengeIcons/tree.svg'
import { voxelKey } from '../../lib/voxel/key'
import type { VoxelData, VoxelKey } from '../../types/project'

export type ChallengeAccent = 'gold' | 'leaf' | 'coral'

export interface Challenge {
  id: string
  title: string
  hint: string
  icon: string
  accent: ChallengeAccent
  target: Record<VoxelKey, VoxelData>
}

// Centers a <=5-wide shape comfortably inside the default 12x12 grid.
const OFFSET = 3

function square(
  target: Record<VoxelKey, VoxelData>,
  y: number,
  size: number,
  color: string,
  center: number,
) {
  const half = Math.floor(size / 2)
  for (let dx = -half; dx <= half; dx++) {
    for (let dz = -half; dz <= half; dz++) {
      target[voxelKey(center + dx, y, center + dz)] = { color }
    }
  }
}

// Same idea as `square` but stamped across a range of y layers at once —
// used for the house's walls and the crewmate's body segments.
function box(
  target: Record<VoxelKey, VoxelData>,
  y0: number,
  y1: number,
  size: number,
  color: string,
  center: number,
) {
  for (let y = y0; y <= y1; y++) {
    square(target, y, size, color, center)
  }
}

function buildHouse(): Record<VoxelKey, VoxelData> {
  const target: Record<VoxelKey, VoxelData> = {}
  const wall = '#c9915f'
  const roof = '#b23b3b'
  const glass = '#8ecfe0'
  const center = OFFSET + 2

  box(target, 0, 2, 5, wall, center) // walls, 5x5, 3 tall
  square(target, 3, 3, roof, center) // roof, stepping in...
  square(target, 4, 1, roof, center) // ...to a single peak

  // Door: a 1-wide, 2-tall gap in the front wall (a real opening, not a
  // recolored cell) — the lintel row above (y=2) stays filled.
  delete target[voxelKey(center, 0, center + 2)]
  delete target[voxelKey(center, 1, center + 2)]

  // A window on each side wall, at eye height.
  target[voxelKey(center - 2, 1, center)] = { color: glass }
  target[voxelKey(center + 2, 1, center)] = { color: glass }

  return target
}

function buildTree(): Record<VoxelKey, VoxelData> {
  const target: Record<VoxelKey, VoxelData> = {}
  const trunk = '#8a5a44'
  const leaves = '#5cff8d'
  const center = OFFSET + 2
  target[voxelKey(center, 0, center)] = { color: trunk }
  square(target, 1, 5, leaves, center)
  square(target, 2, 3, leaves, center)
  square(target, 3, 1, leaves, center)
  return target
}

function buildAmongUs(): Record<VoxelKey, VoxelData> {
  const target: Record<VoxelKey, VoxelData> = {}
  const body = '#e74c3c'
  const visor = '#5cd6ff'
  const center = OFFSET + 2

  // The bean-shaped body: narrow base, wide torso, narrow rounded top.
  square(target, 0, 3, body, center)
  square(target, 1, 5, body, center)
  square(target, 2, 5, body, center)
  square(target, 3, 5, body, center)
  square(target, 4, 5, body, center)
  square(target, 5, 3, body, center)

  // Visor band across the upper-front face.
  for (let dx = -2; dx <= 2; dx++) {
    target[voxelKey(center + dx, 4, center + 2)] = { color: visor }
  }

  // Backpack bump on the back.
  for (let dx = -1; dx <= 1; dx++) {
    target[voxelKey(center + dx, 2, center - 3)] = { color: body }
    target[voxelKey(center + dx, 3, center - 3)] = { color: body }
  }

  return target
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'house',
    title: 'Домик',
    hint: 'Собери домик с дверью, окнами и крышей',
    icon: houseIcon,
    accent: 'gold',
    target: buildHouse(),
  },
  {
    id: 'tree',
    title: 'Ёлочка',
    hint: 'Собери пушистую ёлочку',
    icon: treeIcon,
    accent: 'leaf',
    target: buildTree(),
  },
  {
    id: 'amongus',
    title: 'Амогус',
    hint: 'Собери персонажа из Among Us',
    icon: amongusIcon,
    accent: 'coral',
    target: buildAmongUs(),
  },
]
