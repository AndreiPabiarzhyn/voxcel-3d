import { useState } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useToastStore } from '../../lib/toast/toastStore'
import { redoWithSound, undoWithSound } from '../../store/historyActions'
import type { Tool } from '../../store/projectStore'
import { useProjectStore } from '../../store/projectStore'
import { ClearAllIcon, EraseIcon, PaintIcon, PlaceIcon, RedoIcon, UndoIcon } from './icons'
import './Toolbar.css'

const TOOLS: Array<{ id: Tool; label: string; Icon: typeof PlaceIcon }> = [
  { id: 'place', label: 'Ставить кубики', Icon: PlaceIcon },
  { id: 'paint', label: 'Красить', Icon: PaintIcon },
  { id: 'erase', label: 'Стирать', Icon: EraseIcon },
]

export function Toolbar() {
  const tool = useProjectStore((state) => state.tool)
  const setTool = useProjectStore((state) => state.setTool)
  const canUndo = useProjectStore((state) => state.past.length > 0)
  const canRedo = useProjectStore((state) => state.future.length > 0)
  const hasVoxels = useProjectStore((state) => Object.keys(state.voxels).length > 0)
  const [confirmingClear, setConfirmingClear] = useState(false)

  function handleClearAll() {
    useProjectStore.getState().clearVoxels()
    useToastStore.getState().show('Всё стёрто 🧹', 'success')
  }

  return (
    <div className="toolbar">
      {TOOLS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={tool === id ? 'hud-button hud-button--active-cyan' : 'hud-button'}
          onClick={() => setTool(id)}
          aria-label={label}
          aria-pressed={tool === id}
          title={label}
        >
          <Icon size={24} />
        </button>
      ))}
      <div className="hud-divider" />
      <button
        type="button"
        className="hud-button"
        onClick={undoWithSound}
        disabled={!canUndo}
        aria-label="Отменить"
        title="Отменить (Ctrl+Z)"
      >
        <UndoIcon size={24} />
      </button>
      <button
        type="button"
        className="hud-button"
        onClick={redoWithSound}
        disabled={!canRedo}
        aria-label="Вернуть"
        title="Вернуть (Ctrl+Y)"
      >
        <RedoIcon size={24} />
      </button>
      <div className="hud-divider" />
      <button
        type="button"
        className="hud-button"
        onClick={() => setConfirmingClear(true)}
        disabled={!hasVoxels}
        aria-label="Стереть всё"
        title="Стереть все кубики"
      >
        <ClearAllIcon size={24} />
      </button>
      {confirmingClear && (
        <ConfirmDialog
          title="Стереть всё?"
          message="Все кубики на сетке будут удалены. Это действие можно отменить кнопкой «Отменить»."
          confirmLabel="Да, стереть всё"
          cancelLabel="Не надо"
          onConfirm={() => {
            handleClearAll()
            setConfirmingClear(false)
          }}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </div>
  )
}
