import { useState } from 'react'
import clearIcon from '../../assets/actionIcons/clear.svg'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Tooltip } from '../../components/Tooltip'
import { useTranslations } from '../../i18n/useTranslations'
import { ChallengesButton } from '../challenges/ChallengesButton'
import { useToastStore } from '../../lib/toast/toastStore'
import { selectHasVoxels, useProjectStore } from '../../store/projectStore'
import { Palette } from './Palette'
import './SidePanel.css'

export function SidePanel() {
  const t = useTranslations()
  const hasVoxels = useProjectStore(selectHasVoxels)
  const [confirmingClear, setConfirmingClear] = useState(false)

  function handleClearAll() {
    useProjectStore.getState().clearVoxels()
    useToastStore.getState().show(t.toast.allCleared, 'success')
  }

  return (
    <div className="side-panel hud-panel hud-panel--column">
      <Palette />
      <div className="hud-divider--h" />
      <ChallengesButton />
      <Tooltip label={t.sidePanel.clearAllTooltip}>
        <button
          type="button"
          className="hud-button"
          onClick={() => setConfirmingClear(true)}
          disabled={!hasVoxels}
          aria-label={t.sidePanel.clearAllLabel}
        >
          <img className="hud-button__icon" src={clearIcon} alt="" />
        </button>
      </Tooltip>
      {confirmingClear && (
        <ConfirmDialog
          title={t.sidePanel.clearAllConfirmTitle}
          message={t.sidePanel.clearAllConfirmMessage}
          confirmLabel={t.sidePanel.clearAllConfirmYes}
          cancelLabel={t.common.cancel}
          onConfirm={() => {
            handleClearAll()
            setConfirmingClear(false)
          }}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </div>
  )
}
