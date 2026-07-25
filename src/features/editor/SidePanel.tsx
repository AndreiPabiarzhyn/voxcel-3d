import { useState } from 'react'
import clearIcon from '../../assets/actionIcons/clear.svg'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { Tooltip } from '../../components/Tooltip'
import { ChallengesButton } from '../challenges/ChallengesButton'
import { useToastStore } from '../../lib/toast/toastStore'
import { selectHasVoxels, useProjectStore } from '../../store/projectStore'
import { Palette } from './Palette'
import './SidePanel.css'

export function SidePanel() {
  const hasVoxels = useProjectStore(selectHasVoxels)
  const [confirmingClear, setConfirmingClear] = useState(false)

  function handleClearAll() {
    useProjectStore.getState().clearVoxels()
    useToastStore.getState().show('Всё стёрто 🧹', 'success')
  }

  return (
    <div className="side-panel hud-panel hud-panel--column">
      <Palette />
      <div className="hud-divider--h" />
      <ChallengesButton />
      <Tooltip label="Стереть все кубики">
        <button
          type="button"
          className="hud-button"
          onClick={() => setConfirmingClear(true)}
          disabled={!hasVoxels}
          aria-label="Стереть всё"
        >
          <img className="hud-button__icon" src={clearIcon} alt="" />
        </button>
      </Tooltip>
      {confirmingClear && (
        <ConfirmDialog
          title="Стереть всё?"
          message="Все кубики на сетке будут удалены. Это действие можно отменить кнопкой «Отменить»."
          confirmLabel="Да, стереть всё"
          cancelLabel="Не надо"
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
