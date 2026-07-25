import { create } from 'zustand'
import { loadProjectFromLocalStorage, saveProjectToLocalStorage } from '../lib/storage/localProject'
import { voxelKey } from '../lib/voxel/key'
import { buildStarterPig } from '../lib/voxel/starterPig'
import type { VoxelData, VoxelKey, VoxelProject } from '../types/project'

const DEFAULT_GRID_SIZE = 12
const DEFAULT_PROJECT_NAME = 'Моя постройка'
const MAX_HISTORY = 50

export type Tool = 'place' | 'paint' | 'erase'

interface ProjectState {
  projectId: string
  projectName: string
  createdAt: number
  gridSize: number
  voxels: Record<VoxelKey, VoxelData>
  selectedColor: string
  tool: Tool
  past: Record<VoxelKey, VoxelData>[]
  future: Record<VoxelKey, VoxelData>[]
  setColor: (color: string) => void
  setTool: (tool: Tool) => void
  setProjectName: (name: string) => void
  addVoxel: (x: number, y: number, z: number) => void
  removeVoxel: (x: number, y: number, z: number) => void
  paintVoxel: (x: number, y: number, z: number) => void
  undo: () => void
  redo: () => void
  toProject: () => VoxelProject
  loadProject: (project: VoxelProject) => void
  newProject: () => void
  clearVoxels: () => void
  showWelcome: boolean
  keepStarterPig: () => void
  dismissStarterPig: () => void
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function inBounds(gridSize: number, x: number, y: number, z: number) {
  return x >= 0 && x < gridSize && y >= 0 && y < gridSize && z >= 0 && z < gridSize
}

function pushHistory(
  past: Record<VoxelKey, VoxelData>[],
  voxels: Record<VoxelKey, VoxelData>,
) {
  const next = [...past, voxels]
  return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next
}

const savedProject = loadProjectFromLocalStorage()

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectId: savedProject?.id ?? createId(),
  projectName: savedProject?.name ?? DEFAULT_PROJECT_NAME,
  createdAt: savedProject?.createdAt ?? Date.now(),
  gridSize: savedProject?.gridSize ?? DEFAULT_GRID_SIZE,
  voxels: savedProject?.voxels ?? buildStarterPig(),
  selectedColor: '#ff5c5c',
  tool: 'place',
  past: [],
  future: [],

  setColor: (color) => set({ selectedColor: color }),
  setTool: (tool) => set({ tool }),
  setProjectName: (name) => set({ projectName: name }),

  addVoxel: (x, y, z) => {
    if (!inBounds(get().gridSize, x, y, z)) return
    set((state) => ({
      past: pushHistory(state.past, state.voxels),
      future: [],
      voxels: {
        ...state.voxels,
        [voxelKey(x, y, z)]: { color: state.selectedColor },
      },
    }))
  },

  removeVoxel: (x, y, z) =>
    set((state) => {
      const key = voxelKey(x, y, z)
      if (!state.voxels[key]) return state
      const next = { ...state.voxels }
      delete next[key]
      return { past: pushHistory(state.past, state.voxels), future: [], voxels: next }
    }),

  paintVoxel: (x, y, z) =>
    set((state) => {
      const key = voxelKey(x, y, z)
      const existing = state.voxels[key]
      if (!existing || existing.color === state.selectedColor) return state
      return {
        past: pushHistory(state.past, state.voxels),
        future: [],
        voxels: { ...state.voxels, [key]: { color: state.selectedColor } },
      }
    }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        future: [state.voxels, ...state.future],
        voxels: previous,
      }
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state
      const [next, ...rest] = state.future
      return {
        past: pushHistory(state.past, state.voxels),
        future: rest,
        voxels: next,
      }
    }),

  toProject: () => {
    const state = get()
    return {
      id: state.projectId,
      name: state.projectName,
      gridSize: state.gridSize,
      voxels: state.voxels,
      createdAt: state.createdAt,
      updatedAt: Date.now(),
    }
  },

  loadProject: (project) =>
    set({
      projectId: project.id,
      projectName: project.name,
      createdAt: project.createdAt,
      gridSize: project.gridSize,
      voxels: project.voxels,
      past: [],
      future: [],
    }),

  newProject: () =>
    set({
      projectId: createId(),
      projectName: DEFAULT_PROJECT_NAME,
      createdAt: Date.now(),
      gridSize: DEFAULT_GRID_SIZE,
      voxels: {},
      past: [],
      future: [],
    }),

  clearVoxels: () =>
    set((state) => {
      if (Object.keys(state.voxels).length === 0) return state
      return { past: pushHistory(state.past, state.voxels), future: [], voxels: {} }
    }),

  // Only true on a genuinely fresh visit (nothing in localStorage yet) —
  // see WelcomeModal. Whichever way it's answered, the resulting project
  // is saved immediately: autosave only fires on the *next* edit, and
  // without an explicit save here "keep the pig" would silently ask again
  // on every reload until the player happened to place a block.
  showWelcome: savedProject === null,

  keepStarterPig: () => {
    saveProjectToLocalStorage(get().toProject())
    set({ showWelcome: false })
  },

  dismissStarterPig: () => {
    get().newProject()
    saveProjectToLocalStorage(get().toProject())
    set({ showWelcome: false })
  },
}))

/** Shared `useProjectStore(selectHasVoxels)` selector — whether there's
 * anything on the grid worth confirming before a destructive action
 * (clear-all, starting a challenge). Kept in one place so the two
 * call sites can't drift into subtly different "empty" checks. */
export const selectHasVoxels = (state: ProjectState) => Object.keys(state.voxels).length > 0
