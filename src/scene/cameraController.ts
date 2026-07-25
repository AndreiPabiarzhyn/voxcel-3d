import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface Registration {
  camera: THREE.Camera
  controls: OrbitControlsImpl
  homePosition: THREE.Vector3
  homeTarget: THREE.Vector3
}

let registration: Registration | null = null

export function registerCamera(camera: THREE.Camera, controls: OrbitControlsImpl) {
  registration = {
    camera,
    controls,
    homePosition: camera.position.clone(),
    homeTarget: controls.target.clone(),
  }
}

export function unregisterCamera() {
  registration = null
}

export type ViewPreset = 'home' | 'front' | 'top'

// Kept just shy of the poles — an exact 0/180 polar angle puts the camera
// parallel to the up vector, where lookAt()'s basis math degenerates.
// OrbitControls' own minPolarAngle (see CameraRig) uses the same value so
// manual dragging and this preset agree on how close to top-down is
// reachable.
export const TOP_POLAR_ANGLE = 0.05

export function setViewPreset(preset: ViewPreset) {
  if (!registration) return
  const { camera, controls, homePosition, homeTarget } = registration

  if (preset === 'home') {
    camera.position.copy(homePosition)
    controls.target.copy(homeTarget)
    controls.update()
    return
  }

  const target = controls.target
  const radius = camera.position.distanceTo(target) || homePosition.distanceTo(homeTarget)
  const theta = Math.PI / 4
  const phi = preset === 'top' ? TOP_POLAR_ANGLE : Math.PI / 2.05

  const offset = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta)
  camera.position.copy(target).add(offset)
  camera.lookAt(target)
  controls.update()
}
