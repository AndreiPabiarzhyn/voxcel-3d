import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { memo, useEffect, useRef } from 'react'
import { BoxGeometry, type Mesh, MeshStandardMaterial } from 'three'
import { playEraseSound, playPaintSound, playPlaceSound } from '../lib/audio/sounds'
import { useProjectStore } from '../store/projectStore'
import { useClickWithoutDrag } from './useClickWithoutDrag'
import {
  easeOutBack,
  ERASE_DURATION_MS,
  PAINT_PULSE_DURATION_MS,
  PLACE_DURATION_MS,
} from './voxelAnimation'

interface VoxelProps {
  x: number
  y: number
  z: number
  color: string
}

// Every voxel is an identical unit cube — one shared geometry instead of
// each mesh allocating (and the GC eventually collecting) its own is a
// meaningful saving once a build has hundreds of cubes, and it's what was
// making editing feel choppy. Same idea for materials, cached by color:
// two red cubes reuse one MeshStandardMaterial rather than two. Nothing
// here ever mutates a shared material's own properties (only mesh.scale,
// which is per-instance) — keep it that way if a future effect wants a
// material-level flash instead of a scale pulse.
const sharedGeometry = new BoxGeometry(1, 1, 1)
const materialCache = new Map<string, MeshStandardMaterial>()

function materialForColor(color: string) {
  let material = materialCache.get(color)
  if (!material) {
    material = new MeshStandardMaterial({ color })
    materialCache.set(color, material)
  }
  return material
}

function VoxelComponent({ x, y, z, color }: VoxelProps) {
  const tool = useProjectStore((state) => state.tool)
  const addVoxel = useProjectStore((state) => state.addVoxel)
  const removeVoxel = useProjectStore((state) => state.removeVoxel)
  const paintVoxel = useProjectStore((state) => state.paintVoxel)

  const meshRef = useRef<Mesh>(null)
  const mountedAt = useRef(performance.now())
  const pulseAt = useRef<number | null>(null)
  const eraseAt = useRef<number | null>(null)
  const erasedOnce = useRef(false)
  const prevColor = useRef(color)
  // Once true, the per-frame animation work below is skipped entirely —
  // a settled voxel doing nothing still cost a function call and a few
  // comparisons every frame, which adds up across hundreds of cubes.
  const settled = useRef(false)

  // Recoloring doesn't remount the mesh (same key), so a pulse is
  // triggered here instead of at mount time, whenever the color prop
  // actually changes.
  useEffect(() => {
    if (prevColor.current !== color) {
      pulseAt.current = performance.now()
      prevColor.current = color
      settled.current = false
    }
  }, [color])

  useFrame(() => {
    if (settled.current) return
    const mesh = meshRef.current
    if (!mesh) return
    const now = performance.now()
    let scale: number

    if (eraseAt.current !== null) {
      const t = Math.min((now - eraseAt.current) / ERASE_DURATION_MS, 1)
      scale = 1 - t
      if (t >= 1 && !erasedOnce.current) {
        erasedOnce.current = true
        removeVoxel(x, y, z)
      }
    } else {
      const placeT = Math.min((now - mountedAt.current) / PLACE_DURATION_MS, 1)
      scale = placeT < 1 ? easeOutBack(placeT) : 1

      if (pulseAt.current !== null) {
        const pulseT = (now - pulseAt.current) / PAINT_PULSE_DURATION_MS
        if (pulseT < 1) {
          scale *= 1 + 0.18 * Math.sin(pulseT * Math.PI)
        } else {
          pulseAt.current = null
        }
      }
    }

    if (eraseAt.current === null && pulseAt.current === null && scale === 1) {
      settled.current = true
    }

    mesh.scale.setScalar(Math.max(scale, 0.001))
  })

  const handleClick = (event: ThreeEvent<PointerEvent>) => {
    if (event.button !== 0) return
    event.stopPropagation()

    if (tool === 'erase') {
      playEraseSound()
      eraseAt.current = performance.now()
      settled.current = false
      return
    }
    if (tool === 'paint') {
      playPaintSound()
      paintVoxel(x, y, z)
      return
    }

    // Place mode: add a cube on the face that was clicked. Voxels never
    // rotate, so the face normal in local space already equals world space.
    const normal = event.face?.normal
    if (!normal) return
    playPlaceSound()
    addVoxel(x + Math.round(normal.x), y + Math.round(normal.y), z + Math.round(normal.z))
  }

  const dragGuard = useClickWithoutDrag(handleClick)

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      scale={0.001}
      geometry={sharedGeometry}
      material={materialForColor(color)}
      castShadow
      receiveShadow
      {...dragGuard}
    />
  )
}

// Props are all primitives, so a shallow-equal memo skips re-rendering
// every other voxel whenever the store's `voxels` object changes because
// just one of them did.
export const Voxel = memo(VoxelComponent)
