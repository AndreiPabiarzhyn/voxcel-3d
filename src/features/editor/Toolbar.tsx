import { useState } from 'react'
import { redoWithSound, undoWithSound } from '../../store/historyActions'
import { useProjectStore } from '../../store/projectStore'
import { Palette } from './Palette'
import './Toolbar.css'

const ICON_BASE = import.meta.env.BASE_URL + 'icons/actions/'

export function Toolbar() {
  const tool = useProjectStore((state) => state.tool)
  const setTool = useProjectStore((state) => state.setTool)
  const canUndo = useProjectStore((state) => state.past.length > 0)
  const canRedo = useProjectStore((state) => state.future.length > 0)
  const [colorsOpen, setColorsOpen] = useState(false)

  return (
    <div className="toolbar">
      <button
        type="button"
        className={tool === 'place' ? 'hud-button hud-button--active-cyan' : 'hud-button'}
        onClick={() => setTool('place')}
        aria-label="Добавить блок"
        aria-pressed={tool === 'place'}
        title="Добавить блок"
      >
        <img className="hud-button__icon" src={`${ICON_BASE}place.svg`} alt="" />
      </button>
      <button
        type="button"
        className={tool === 'erase' ? 'hud-button hud-button--active-cyan' : 'hud-button'}
        onClick={() => setTool('erase')}
        aria-label="Стереть блок"
        aria-pressed={tool === 'erase'}
        title="Стереть блок"
      >
        <img className="hud-button__icon" src={`${ICON_BASE}erase.svg`} alt="" />
      </button>
      <div className="tool-color-picker" onMouseLeave={() => setColorsOpen(false)}>
        <button
          type="button"
          className={tool === 'paint' ? 'hud-button hud-button--active-cyan' : 'hud-button'}
          onClick={() => {
            setTool('paint')
            setColorsOpen((open) => !open)
          }}
          aria-label="Покрасить"
          aria-pressed={tool === 'paint'}
          title="Покрасить"
        >
          <img className="hud-button__icon" src={`${ICON_BASE}paint.svg`} alt="" />
        </button>
        {colorsOpen && (
          <div className="tool-color-picker__popover">
            <div className="tool-color-picker__card hud-panel">
              <Palette onSelect={() => setColorsOpen(false)} />
            </div>
          </div>
        )}
      </div>
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
