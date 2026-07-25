import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { registerCamera, TOP_POLAR_ANGLE, unregisterCamera } from './cameraController'
import { registerCanvas, unregisterCanvas } from './screenshotController'

// How far (world units) the view may drift from where the drag started —
// keeps a kid from right-click-dragging the build off-screen with no way
// back.
const PAN_RANGE = 10

/**
 * Orbit stays gentle on purpose: no free-fall polar angle and a
 * clamped zoom range, so small kids can't flip the view upside down
 * or spin it into an unreadable blur. Right-click drag pans the view
 * left/right and up/down on desktop via a custom handler below (so we
 * can clamp total drift and stop it from losing the model off-screen).
 * Touch has no right-click equivalent, so `mouseButtons` deliberately
 * leaves RIGHT unmapped — that hands the button back to OrbitControls
 * doing nothing with it — while `enablePan` stays on so its own
 * well-tested two-finger touch pan still works on tablets, just without
 * our drift clamp (the "reset view" button is the safety net there).
 */
interface CameraRigProps {
  /** World-space x/z of the grid's visual middle — see the comment in
   * Scene.tsx. The initial OrbitControls target is set here imperatively
   * (once, before "home" is captured) rather than via a `target` prop on
   * `<OrbitControls>`, since that prop would need a stable array
   * reference to avoid re-snapping the target back on every re-render —
   * simpler to just set it once and let the custom pan/orbit logic own
   * `controls.target` from then on. */
  center: number
}

export function CameraRig({ center }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera, gl } = useThree()

  // Raw pointer deltas accumulate here between rendered frames instead
  // of being applied immediately inside the pointermove handler.
  // pointermove can fire more often than the screen actually repaints
  // (comfortably true on a 125Hz+ mouse against a 60Hz display) — applying
  // every single event moved the camera in uneven little jumps (some
  // updates got overwritten before a frame ever showed them) and felt
  // both laggy and jittery. Coalescing to exactly one update per
  // useFrame tick ties the pan directly to the render cadence.
  const pendingDelta = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const startTarget = useRef(new THREE.Vector3())

  // Scratch vectors, reused every frame instead of freshly allocated —
  // this runs dozens of times a second while dragging, and `new
  // THREE.Vector3()` in that hot path is real enough GC pressure to show
  // up as stutter on modest hardware.
  const rightVec = useRef(new THREE.Vector3())
  const upVec = useRef(new THREE.Vector3())
  const offsetVec = useRef(new THREE.Vector3())
  const driftVec = useRef(new THREE.Vector3())

  useEffect(() => {
    const dom = gl.domElement
    const controls = controlsRef.current
    if (!controls) return

    controls.target.set(center, 0, center)
    controls.update()

    registerCamera(camera, controls)
    registerCanvas(dom)

    let lastX = 0
    let lastY = 0

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 2 || !controlsRef.current) return
      dragging.current = true
      lastX = event.clientX
      lastY = event.clientY
      pendingDelta.current.x = 0
      pendingDelta.current.y = 0
      startTarget.current.copy(controlsRef.current.target)
      dom.setPointerCapture(event.pointerId)
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragging.current) return
      pendingDelta.current.x += event.clientX - lastX
      pendingDelta.current.y += event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
    }

    function stopDragging() {
      dragging.current = false
    }

    function onContextMenu(event: MouseEvent) {
      event.preventDefault()
    }

    dom.addEventListener('pointerdown', onPointerDown)
    dom.addEventListener('pointermove', onPointerMove)
    dom.addEventListener('pointerup', stopDragging)
    dom.addEventListener('pointercancel', stopDragging)
    dom.addEventListener('contextmenu', onContextMenu)

    return () => {
      unregisterCamera()
      unregisterCanvas()
      dom.removeEventListener('pointerdown', onPointerDown)
      dom.removeEventListener('pointermove', onPointerMove)
      dom.removeEventListener('pointerup', stopDragging)
      dom.removeEventListener('pointercancel', stopDragging)
      dom.removeEventListener('contextmenu', onContextMenu)
    }
  }, [camera, gl, center])

  useFrame(() => {
    const controls = controlsRef.current
    if (!dragging.current || !controls) return

    const deltaX = pendingDelta.current.x
    const deltaY = pendingDelta.current.y
    if (deltaX === 0 && deltaY === 0) return
    pendingDelta.current.x = 0
    pendingDelta.current.y = 0

    // Same screen-space-to-world scale OrbitControls uses for panning,
    // so the drag feels 1:1 regardless of zoom level.
    const targetDistance = camera.position.distanceTo(controls.target)
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 45
    const panScale =
      (2 * targetDistance * Math.tan((fov * Math.PI) / 360)) / gl.domElement.clientHeight

    const right = rightVec.current.setFromMatrixColumn(camera.matrixWorld, 0)
    const up = upVec.current.setFromMatrixColumn(camera.matrixWorld, 1)
    const offset = offsetVec.current
      .copy(right)
      .multiplyScalar(-deltaX * panScale)
      .addScaledVector(up, deltaY * panScale)

    camera.position.add(offset)
    controls.target.add(offset)

    // Pull back if this drag has pushed the target too far from start.
    const drift = driftVec.current.subVectors(controls.target, startTarget.current)
    const distance = drift.length()
    if (distance > PAN_RANGE) {
      const excess = drift.multiplyScalar(1 - PAN_RANGE / distance)
      controls.target.sub(excess)
      camera.position.sub(excess)
    }

    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan
      mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY }}
      touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      minDistance={6}
      maxDistance={24}
      minPolarAngle={TOP_POLAR_ANGLE}
      maxPolarAngle={Math.PI / 2.05}
    />
  )
}
