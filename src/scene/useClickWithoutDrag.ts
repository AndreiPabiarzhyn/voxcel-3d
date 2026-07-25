import { useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'

// OrbitControls rotate-drags and voxel clicks share the left mouse button;
// without this, ending a camera drag over a cube also "clicks" it. A click
// only counts if the pointer barely moved between down and up.
const DRAG_THRESHOLD = 6

export function useClickWithoutDrag(onClick: (event: ThreeEvent<PointerEvent>) => void) {
  const origin = useRef<{ x: number; y: number } | null>(null)

  return {
    onPointerDown: (event: ThreeEvent<PointerEvent>) => {
      origin.current = { x: event.clientX, y: event.clientY }
    },
    onPointerUp: (event: ThreeEvent<PointerEvent>) => {
      const start = origin.current
      origin.current = null
      if (!start) return
      const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y)
      if (moved <= DRAG_THRESHOLD) onClick(event)
    },
  }
}
