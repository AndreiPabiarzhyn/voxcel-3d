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

function buildHouse(): Record<VoxelKey, VoxelData> {
  const target: Record<VoxelKey, VoxelData> = {}
  const wall = '#8a5a44'
  const roof = '#ff5c5c'
  const center = OFFSET + 1
  square(target, 0, 3, wall, center)
  square(target, 1, 3, wall, center)
  square(target, 2, 3, roof, center)
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

function buildMushroom(): Record<VoxelKey, VoxelData> {
  const target: Record<VoxelKey, VoxelData> = {}
  const stem = '#f4f4f4'
  const cap = '#ff5c5c'
  const center = OFFSET + 2
  target[voxelKey(center, 0, center)] = { color: stem }
  target[voxelKey(center, 1, center)] = { color: stem }
  square(target, 2, 5, cap, center)
  square(target, 3, 3, cap, center)
  return target
}

// import.meta.env.BASE_URL, not a hardcoded leading slash: this app is
// deployed as a GitHub Pages *project* site (/voxcel-3d/, not domain root),
// so a literal '/icons/...' string would 404 in production while working
// fine in local dev — BASE_URL resolves to the right prefix in both.
const ICON_BASE = import.meta.env.BASE_URL + 'icons/challenges/'

export const CHALLENGES: Challenge[] = [
  {
    id: 'house',
    title: 'Домик',
    hint: 'Собери маленький домик с крышей',
    icon: `${ICON_BASE}house.svg`,
    accent: 'gold',
    target: buildHouse(),
  },
  {
    id: 'tree',
    title: 'Ёлочка',
    hint: 'Собери пушистую ёлочку',
    icon: `${ICON_BASE}tree.svg`,
    accent: 'leaf',
    target: buildTree(),
  },
  {
    id: 'mushroom',
    title: 'Гриб',
    hint: 'Собери гриб с красной шляпкой',
    icon: `${ICON_BASE}mushroom.svg`,
    accent: 'coral',
    target: buildMushroom(),
  },
]
