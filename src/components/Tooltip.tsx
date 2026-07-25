import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './Tooltip.css'

interface TooltipProps {
  label: string
  children: ReactNode
  /** Suppresses the tooltip entirely — e.g. while the same button already
   * has its own popover open, so the two floating cards don't stack. */
  disabled?: boolean
}

const SHOW_DELAY_MS = 400
// Rough height of the bubble (one line + padding) plus its gap from the
// anchor — below this much clearance above the button there's nowhere
// for an "above" tooltip to render without going off-screen.
const MIN_SPACE_ABOVE = 48
const EDGE_MARGIN = 90

type Placement = { left: number; y: number; side: 'above' | 'below' }

export function Tooltip({ label, children, disabled = false }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [placement, setPlacement] = useState<Placement>({ left: 0, y: 0, side: 'above' })
  const anchorRef = useRef<HTMLSpanElement>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearTimer() {
    if (showTimer.current) {
      clearTimeout(showTimer.current)
      showTimer.current = null
    }
  }

  function scheduleShow() {
    if (disabled) return
    clearTimer()
    showTimer.current = setTimeout(() => {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (!rect) return
      const left = Math.min(
        Math.max(rect.left + rect.width / 2, EDGE_MARGIN),
        window.innerWidth - EDGE_MARGIN,
      )
      if (rect.top < MIN_SPACE_ABOVE) {
        setPlacement({ left, y: rect.bottom + 8, side: 'below' })
      } else {
        setPlacement({ left, y: window.innerHeight - rect.top + 8, side: 'above' })
      }
      setVisible(true)
    }, SHOW_DELAY_MS)
  }

  function hide() {
    clearTimer()
    setVisible(false)
  }

  useEffect(() => {
    if (disabled) hide()
  }, [disabled])

  return (
    <span
      ref={anchorRef}
      className="tooltip-anchor"
      onMouseEnter={scheduleShow}
      onMouseLeave={hide}
      onFocus={scheduleShow}
      onBlur={hide}
    >
      {children}
      {visible &&
        createPortal(
          <div
            className="tooltip-bubble"
            style={{
              left: placement.left,
              ...(placement.side === 'above' ? { bottom: placement.y } : { top: placement.y }),
            }}
            role="tooltip"
          >
            {label}
          </div>,
          document.body,
        )}
    </span>
  )
}
