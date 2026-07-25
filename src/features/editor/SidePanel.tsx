import { useState } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { ChallengesButton } from '../challenges/ChallengesButton'
import { useToastStore } from '../../lib/toast/toastStore'
import { useProjectStore } from '../../store/projectStore'
import { Palette } from './Palette'
import './SidePanel.css'

const CLEAR_ICON = `${import.meta.env.BASE_URL}icons/actions/clear.svg`

export function SidePanel() {
  const hasVoxels = useProjectStore((state) => Object.keys(state.voxels).length > 0)
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
      <button
        type="button"
        className="hud-button"
        onClick={() => setConfirmingClear(true)}
        disabled={!hasVoxels}
        aria-label="Стереть всё"
        title="Стереть все кубики"
      >
        <img className="hud-button__icon" src={CLEAR_ICON} alt="" />
      </button>
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
