import { useProjectStore } from '../../store/projectStore'
import { saveProjectToLocalStorage } from './localProject'

const AUTOSAVE_DELAY_MS = 800

/**
 * Debounced autosave: any change to the build, grid size or project name
 * gets written to localStorage shortly after the user stops editing, so a
 * refresh or accidental tab close doesn't lose the build. Call once at
 * app boot.
 */
export function startAutosave() {
  let timer: ReturnType<typeof setTimeout> | undefined

  return useProjectStore.subscribe((state, prevState) => {
    if (
      state.voxels === prevState.voxels &&
      state.gridSize === prevState.gridSize &&
      state.projectName === prevState.projectName
    ) {
      return
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      saveProjectToLocalStorage(useProjectStore.getState().toProject())
    }, AUTOSAVE_DELAY_MS)
  })
}
