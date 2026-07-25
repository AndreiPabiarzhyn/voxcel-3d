import { useState } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { useTranslations } from '../../i18n/useTranslations'
import { downloadProjectFile } from '../../lib/storage/exportProjectFile'
import { useToastStore } from '../../lib/toast/toastStore'
import { selectHasVoxels, useProjectStore } from '../../store/projectStore'
import { CloseIcon, CompletedIcon } from '../editor/icons'
import { CHALLENGES } from './challengeData'
import './ChallengePanel.css'
import { getChallengeProgress } from './challengeProgress'
import { useChallengeStore } from './challengeStore'

export function ChallengePanel() {
  const t = useTranslations()
  const panelOpen = useChallengeStore((state) => state.panelOpen)
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId)
  const completedChallengeIds = useChallengeStore((state) => state.completedChallengeIds)
  const startChallenge = useChallengeStore((state) => state.startChallenge)
  const exitChallenge = useChallengeStore((state) => state.exitChallenge)
  const closePanel = useChallengeStore((state) => state.closePanel)
  const voxels = useProjectStore((state) => state.voxels)
  const hasVoxels = useProjectStore(selectHasVoxels)
  const [pendingChallengeId, setPendingChallengeId] = useState<string | null>(null)

  if (!panelOpen) return null

  function beginChallenge(id: string) {
    useProjectStore.getState().clearVoxels()
    startChallenge(id)
  }

  function handleStart(id: string) {
    if (hasVoxels) {
      setPendingChallengeId(id)
    } else {
      beginChallenge(id)
    }
  }

  return (
    <div className="modal-backdrop" onClick={closePanel}>
      <div className="modal-panel challenge-panel" onClick={(event) => event.stopPropagation()}>
        <div className="challenge-panel__header">
          <h2>{t.challenges.buttonLabel}</h2>
          <button
            type="button"
            className="hud-button"
            onClick={closePanel}
            aria-label={t.challenges.close}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="challenge-panel__list">
          {CHALLENGES.map((challenge) => {
            const { filled, total } = getChallengeProgress(challenge, voxels)
            const completed = completedChallengeIds.includes(challenge.id)
            const active = activeChallengeId === challenge.id

            return (
              <div
                key={challenge.id}
                className={
                  active ? 'challenge-card challenge-card--active' : 'challenge-card'
                }
              >
                <div
                  className={`challenge-card__icon-badge challenge-card__icon-badge--${challenge.accent}`}
                >
                  <img
                    className="challenge-card__icon-img"
                    src={challenge.icon}
                    alt=""
                    aria-hidden="true"
                  />
                  {completed && (
                    <span className="challenge-card__done-badge" aria-label={t.challenges.completedBadge}>
                      <CompletedIcon size={13} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <div className="challenge-card__info">
                  <div className="challenge-card__title">{t.challenges[challenge.titleKey]}</div>
                  <div className="challenge-card__hint">{t.challenges[challenge.hintKey]}</div>
                  {active && (
                    <div className="challenge-card__progress">
                      {filled} / {total}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-pill challenge-card__action"
                  onClick={() => handleStart(challenge.id)}
                >
                  {active
                    ? t.challenges.actionPlaying
                    : completed
                      ? t.challenges.actionRetry
                      : t.challenges.actionStart}
                </button>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          className="btn-pill btn-pill--ghost challenge-panel__sandbox"
          onClick={() => {
            exitChallenge()
            closePanel()
          }}
        >
          {t.challenges.sandboxMode}
        </button>
      </div>

      {pendingChallengeId && (
        <ConfirmDialog
          title={t.challenges.saveBeforeStartTitle}
          message={t.challenges.saveBeforeStartMessage}
          confirmLabel={t.challenges.saveBeforeStartDiscard}
          cancelLabel={t.challenges.saveBeforeStartSave}
          onConfirm={() => {
            beginChallenge(pendingChallengeId)
            setPendingChallengeId(null)
          }}
          onCancel={() => {
            downloadProjectFile(useProjectStore.getState().toProject())
            useToastStore.getState().show(t.toast.projectSaved, 'success')
            beginChallenge(pendingChallengeId)
            setPendingChallengeId(null)
          }}
        />
      )}
    </div>
  )
}
