import * as THREE from 'three'
import { GLTFExporter } from 'three-stdlib'
import type { VoxelData, VoxelKey } from '../../types/project'
import { parseVoxelKey } from './key'

/**
 * Exports the build as a standalone .glb — a real 3D model file any game
 * engine or 3D tool can import (Unity, Unreal, Godot, Blender, Roblox via
 * plugins, Three.js/Babylon.js scenes...), unlike `.voxcel` which only
 * this editor understands. One box mesh per voxel, sharing a single
 * geometry and one material per distinct color so same-colored cubes
 * don't bloat the file with duplicates.
 */
export async function exportVoxelsAsGlb(
  voxels: Record<VoxelKey, VoxelData>,
  fileName: string,
) {
  const group = new THREE.Group()
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const materials = new Map<string, THREE.MeshStandardMaterial>()

  function materialFor(color: string) {
    let material = materials.get(color)
    if (!material) {
      material = new THREE.MeshStandardMaterial({ color })
      materials.set(color, material)
    }
    return material
  }

  for (const [key, data] of Object.entries(voxels)) {
    const [x, y, z] = parseVoxelKey(key as VoxelKey)
    const mesh = new THREE.Mesh(geometry, materialFor(data.color))
    mesh.position.set(x, y, z)
    group.add(mesh)
  }

  const exporter = new GLTFExporter()
  const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    exporter.parse(
      group,
      (result) => resolve(result as ArrayBuffer),
      (error) => reject(error),
      { binary: true },
    )
  })

  geometry.dispose()
  materials.forEach((material) => material.dispose())

  const blob = new Blob([buffer], { type: 'model/gltf-binary' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName || 'voxcel-model'}.glb`
  link.click()
  URL.revokeObjectURL(url)
}
