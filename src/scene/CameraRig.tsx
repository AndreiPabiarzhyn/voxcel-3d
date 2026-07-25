import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
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
export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera, gl } = useThree()

  useEffect(() => {
    const dom = gl.domElement
    const controls = controlsRef.current
    if (!controls) return

    registerCamera(camera, controls)
    registerCanvas(dom)

    const startTarget = new THREE.Vector3()
    let dragging = false
    let lastX = 0
    let lastY = 0

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 2 || !controlsRef.current) return
      dragging = true
      lastX = event.clientX
      lastY = event.clientY
      startTarget.copy(controlsRef.current.target)
      dom.setPointerCapture(event.pointerId)
    }

    function onPointerMove(event: PointerEvent) {
      const controls = controlsRef.current
      if (!dragging || !controls) return

      const deltaX = event.clientX - lastX
      const deltaY = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
      if (deltaX === 0 && deltaY === 0) return

      // Same screen-space-to-world scale OrbitControls uses for panning,
      // so the drag feels 1:1 regardless of zoom level.
      const targetDistance = camera.position.distanceTo(controls.target)
      const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 45
      const panScale =
        (2 * targetDistance * Math.tan((fov * Math.PI) / 360)) / dom.clientHeight

      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1)
      const offset = right
        .multiplyScalar(-deltaX * panScale)
        .add(up.multiplyScalar(deltaY * panScale))

      camera.position.add(offset)
      controls.target.add(offset)

      // Pull back if this drag has pushed the target too far from start.
      const drift = new THREE.Vector3().subVectors(controls.target, startTarget)
      const distance = drift.length()
      if (distance > PAN_RANGE) {
        const excess = drift.multiplyScalar(1 - PAN_RANGE / distance)
        controls.target.sub(excess)
        camera.position.sub(excess)
      }

      controls.update()
    }

    function stopDragging() {
      dragging = false
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
  }, [camera, gl])

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
