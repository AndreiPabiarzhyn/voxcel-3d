import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import brickIcon from '../../assets/actionIcons/place.svg'
import hammerIcon from '../../assets/actionIcons/hammer.svg'
import paintIcon from '../../assets/actionIcons/paint.svg'
import redoIcon from '../../assets/actionIcons/redo.svg'
import undoIcon from '../../assets/actionIcons/undo.svg'
import { Tooltip } from '../../components/Tooltip'
import { useTranslations } from '../../i18n/useTranslations'
import { redoWithSound, undoWithSound } from '../../store/historyActions'
import { useProjectStore } from '../../store/projectStore'
import { Palette } from './Palette'
import './Toolbar.css'

// The tool itself (hammer, brush...) is the big, crisp, legible part —
// the brick is just a small dimmed accent tucked in the corner, enough
// to say "this acts on a block" without competing with the tool for
// attention (an earlier pass had this backwards, brick large + tool small).
function ComboIcon({ tool, label }: { tool: string; label: string }) {
  return (
    <span className="combo-icon" role="img" aria-label={label}>
      <img className="combo-icon__fg" src={tool} alt="" />
      <img className="combo-icon__bg" src={brickIcon} alt="" />
    </span>
  )
}

// Hover-intent close: the popover is portalled to <body>, so it's no
// longer a DOM descendant of the trigger button — a plain onMouseLeave on
// the button would fire the instant the cursor crosses into the popover.
// Instead, any leave schedules a close a beat later, and an enter on
// *either* the button or the popover cancels that pending close.
const CLOSE_DELAY_MS = 150

export function Toolbar() {
  const t = useTranslations()
  const tool = useProjectStore((state) => state.tool)
  const setTool = useProjectStore((state) => state.setTool)
  const canUndo = useProjectStore((state) => state.past.length > 0)
  const canRedo = useProjectStore((state) => state.future.length > 0)
  const [colorsOpen, setColorsOpen] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ left: 0, bottom: 0 })
  const paintButtonRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function scheduleClose() {
    cancelClose()
    closeTimer.current = setTimeout(() => setColorsOpen(false), CLOSE_DELAY_MS)
  }

  function updatePopoverPosition() {
    const rect = paintButtonRef.current?.getBoundingClientRect()
    if (!rect) return
    setPopoverPos({ left: rect.left + rect.width / 2, bottom: window.innerHeight - rect.top + 10 })
  }

  function openColorPicker() {
    updatePopoverPosition()
    setTool('paint')
    setColorsOpen((open) => !open)
  }

  useEffect(() => {
    if (!colorsOpen) return
    updatePopoverPosition()
    window.addEventListener('resize', updatePopoverPosition)
    return () => window.removeEventListener('resize', updatePopoverPosition)
  }, [colorsOpen])

  useEffect(() => () => cancelClose(), [])

  return (
    <div className="toolbar">
      <Tooltip label={t.toolbar.place}>
        <button
          type="button"
          className={tool === 'place' ? 'hud-button hud-button--active-cyan' : 'hud-button'}
          onClick={() => setTool('place')}
          aria-label={t.toolbar.place}
          aria-pressed={tool === 'place'}
        >
          <img className="hud-button__icon" src={brickIcon} alt="" />
        </button>
      </Tooltip>
      <Tooltip label={t.toolbar.erase}>
        <button
          type="button"
          className={tool === 'erase' ? 'hud-button hud-button--active-cyan' : 'hud-button'}
          onClick={() => setTool('erase')}
          aria-label={t.toolbar.erase}
          aria-pressed={tool === 'erase'}
        >
          <ComboIcon tool={hammerIcon} label={t.toolbar.erase} />
        </button>
      </Tooltip>
      <Tooltip label={t.toolbar.paint} disabled={colorsOpen}>
        <button
          ref={paintButtonRef}
          type="button"
          className={tool === 'paint' ? 'hud-button hud-button--active-cyan' : 'hud-button'}
          onClick={openColorPicker}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          aria-label={t.toolbar.paint}
          aria-pressed={tool === 'paint'}
        >
          <ComboIcon tool={paintIcon} label={t.toolbar.paint} />
        </button>
      </Tooltip>
      {colorsOpen &&
        createPortal(
          <div
            className="tool-color-picker__popover"
            style={{ left: popoverPos.left, bottom: popoverPos.bottom }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="tool-color-picker__card hud-panel">
              <Palette className="palette--wide" onSelect={() => setColorsOpen(false)} />
            </div>
          </div>,
          document.body,
        )}
      <div className="hud-divider" />
      <Tooltip label={t.toolbar.undoTooltip}>
        <button
          type="button"
          className="hud-button"
          onClick={undoWithSound}
          disabled={!canUndo}
          aria-label={t.toolbar.undoLabel}
        >
          <img className="hud-button__icon" src={undoIcon} alt="" />
        </button>
      </Tooltip>
      <Tooltip label={t.toolbar.redoTooltip}>
        <button
          type="button"
          className="hud-button"
          onClick={redoWithSound}
          disabled={!canRedo}
          aria-label={t.toolbar.redoLabel}
        >
          <img className="hud-button__icon" src={redoIcon} alt="" />
        </button>
      </Tooltip>
    </div>
  )
}
