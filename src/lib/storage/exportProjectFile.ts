import type { VoxelProject } from '../../types/project'

/** Triggers a browser download of the project as a re-openable .voxcel
 * JSON file. Shared by the File menu's "save" button and the challenge
 * start flow's "save my build first" prompt. */
export function downloadProjectFile(project: VoxelProject) {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${project.name || 'voxcel-project'}.voxcel`
  link.click()
  URL.revokeObjectURL(url)
}
