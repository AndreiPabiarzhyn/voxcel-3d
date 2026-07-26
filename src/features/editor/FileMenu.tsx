import { useRef, useState, type ChangeEvent } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Tooltip } from '../../components/Tooltip'
import { getTranslations, useTranslations } from '../../i18n/useTranslations'
import { useChallengeStore } from '../challenges/challengeStore'
import { downloadProjectFile } from '../../lib/storage/exportProjectFile'
import { exportVoxelsAsGlb } from '../../lib/voxel/exportModel'
import { useToastStore } from '../../lib/toast/toastStore'
import { captureScreenshot } from '../../scene/screenshotController'
import { useProjectStore } from '../../store/projectStore'
import type { VoxelProject } from '../../types/project'
import './FileMenu.css'
import { DownloadIcon, ExportModelIcon, FolderIcon, NewProjectIcon, ScreenshotIcon } from './icons'

// A hand-crafted or corrupted .voxcel file shouldn't be able to crash the
// app or freeze the tab: `typeof null === 'object'` let a `voxels: null`
// file through before (every later `Object.keys(voxels)` call would then
// throw), and an unbounded voxel count let a huge file try to mount
// millions of meshes at once.
const MAX_IMPORTED_VOXELS = 50_000
const MAX_IMPORTED_GRID_SIZE = 256

function isVoxelProject(value: unknown): value is VoxelProject {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<VoxelProject>
  if (typeof candidate.gridSize !== 'number' || !Number.isFinite(candidate.gridSize)) return false
  if (candidate.gridSize <= 0 || candidate.gridSize > MAX_IMPORTED_GRID_SIZE) return false
  if (typeof candidate.voxels !== 'object' || candidate.voxels === null) return false
  if (Object.keys(candidate.voxels).length > MAX_IMPORTED_VOXELS) return false
  return true
}

function handleScreenshot() {
  const { projectName } = useProjectStore.getState()
  captureScreenshot(projectName)
  useToastStore.getState().show(getTranslations().toast.screenshotSaved, 'success')
}

function handleExportProject() {
  downloadProjectFile(useProjectStore.getState().toProject())
  useToastStore.getState().show(getTranslations().toast.projectSaved, 'success')
}

function handleNewProject() {
  useProjectStore.getState().newProject()
  useChallengeStore.getState().exitChallenge()
  useToastStore.getState().show(getTranslations().toast.newProjectStarted, 'success')
}

export function FileMenu() {
  const t = useTranslations()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exportingModel, setExportingModel] = useState(false)
  const [confirmingNew, setConfirmingNew] = useState(false)

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const project = JSON.parse(await file.text())
      if (!isVoxelProject(project)) throw new Error('not a voxcel project')
      useProjectStore.getState().loadProject(project)
      useToastStore.getState().show(t.toast.projectOpened, 'success')
    } catch {
      useToastStore.getState().show(t.toast.projectOpenError, 'error')
    }
  }

  async function handleExportModel() {
    const { voxels, projectName } = useProjectStore.getState()
    setExportingModel(true)
    try {
      await exportVoxelsAsGlb(voxels, projectName)
      useToastStore.getState().show(t.toast.modelExported, 'success')
    } finally {
      setExportingModel(false)
    }
  }

  return (
    <div className="file-menu hud-panel">
      <Tooltip label={t.fileMenu.newProjectTooltip}>
        <button
          type="button"
          className="hud-button"
          onClick={() => setConfirmingNew(true)}
          aria-label={t.fileMenu.newProjectLabel}
        >
          <NewProjectIcon size={20} />
        </button>
      </Tooltip>
      <div className="hud-divider" />
      <Tooltip label={t.fileMenu.saveTooltip}>
        <button
          type="button"
          className="hud-button"
          onClick={handleExportProject}
          aria-label={t.fileMenu.saveLabel}
        >
          <DownloadIcon size={20} />
        </button>
      </Tooltip>
      <Tooltip label={t.fileMenu.openTooltip}>
        <button
          type="button"
          className="hud-button"
          onClick={() => fileInputRef.current?.click()}
          aria-label={t.fileMenu.openLabel}
        >
          <FolderIcon size={20} />
        </button>
      </Tooltip>
      <div className="hud-divider" />
      <Tooltip label={t.fileMenu.screenshotTooltip}>
        <button
          type="button"
          className="hud-button"
          onClick={handleScreenshot}
          aria-label={t.fileMenu.screenshotLabel}
        >
          <ScreenshotIcon size={20} />
        </button>
      </Tooltip>
      <div className="hud-divider" />
      <Tooltip label={t.fileMenu.exportModelTooltip}>
        <button
          type="button"
          className="hud-button"
          onClick={handleExportModel}
          disabled={exportingModel}
          aria-label={t.fileMenu.exportModelLabel}
        >
          <ExportModelIcon size={20} />
        </button>
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept=".voxcel,application/json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
      {confirmingNew && (
        <ConfirmDialog
          title={t.fileMenu.newProjectConfirmTitle}
          message={t.fileMenu.newProjectConfirmMessage}
          confirmLabel={t.fileMenu.newProjectConfirmYes}
          cancelLabel={t.common.cancel}
          onConfirm={() => {
            handleNewProject()
            setConfirmingNew(false)
          }}
          onCancel={() => setConfirmingNew(false)}
        />
      )}
    </div>
  )
}
