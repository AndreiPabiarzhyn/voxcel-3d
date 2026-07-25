import { redoWithSound, undoWithSound } from '../../store/historyActions'
import type { Tool } from '../../store/projectStore'
import { useProjectStore } from '../../store/projectStore'
import './Toolbar.css'

const ICON_BASE = import.meta.env.BASE_URL + 'icons/actions/'

const TOOLS: Array<{ id: Tool; label: string; icon: string }> = [
  { id: 'place', label: 'Добавить блок', icon: `${ICON_BASE}place.svg` },
  { id: 'paint', label: 'Заливка цветом', icon: `${ICON_BASE}paint.svg` },
  { id: 'erase', label: 'Стереть блок', icon: `${ICON_BASE}erase.svg` },
]

export function Toolbar() {
  const tool = useProjectStore((state) => state.tool)
  const setTool = useProjectStore((state) => state.setTool)
  const canUndo = useProjectStore((state) => state.past.length > 0)
  const canRedo = useProjectStore((state) => state.future.length > 0)

  return (
    <div className="toolbar">
      {TOOLS.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          className={tool === id ? 'hud-button hud-button--active-cyan' : 'hud-button'}
          onClick={() => setTool(id)}
          aria-label={label}
          aria-pressed={tool === id}
          title={label}
        >
          <img className="hud-button__icon" src={icon} alt="" />
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
        <img className="hud-button__icon" src={`${ICON_BASE}undo.svg`} alt="" />
      </button>
      <button
        type="button"
        className="hud-button"
        onClick={redoWithSound}
        disabled={!canRedo}
        aria-label="Вернуть"
        title="Вернуть (Ctrl+Y)"
      >
        <img className="hud-button__icon" src={`${ICON_BASE}redo.svg`} alt="" />
      </button>
    </div>
  )
}
