import { playRedoSound, playUndoSound } from '../lib/audio/sounds'
import { useProjectStore } from './projectStore'

// Shared by the Toolbar buttons and the keyboard shortcuts, so both
// trigger the same sound and skip it when there's nothing to undo/redo
// (matches the buttons already being disabled in that case).

export function undoWithSound() {
  const { past, undo } = useProjectStore.getState()
  if (past.length === 0) return
  playUndoSound()
  undo()
}

export function redoWithSound() {
  const { future, redo } = useProjectStore.getState()
  if (future.length === 0) return
  playRedoSound()
  redo()
}
