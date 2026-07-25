import type { VoxelProject } from '../../types/project'

const STORAGE_KEY = 'voxcel:autosave'

export function saveProjectToLocalStorage(project: VoxelProject) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
  } catch {
    // Quota exceeded or storage disabled (private mode) — losing the
    // autosave silently is better than crashing the editor over it.
  }
}

export function loadProjectFromLocalStorage(): VoxelProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<VoxelProject>
    if (!parsed || typeof parsed.gridSize !== 'number' || typeof parsed.voxels !== 'object') {
      return null
    }
    return parsed as VoxelProject
  } catch {
    return null
  }
}
