import { ChallengesIcon } from '../editor/icons'
import { useChallengeStore } from './challengeStore'

export function ChallengesButton() {
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId)
  const openPanel = useChallengeStore((state) => state.openPanel)

  return (
    <button
      type="button"
      className={activeChallengeId ? 'hud-button hud-button--active-gold' : 'hud-button'}
      onClick={openPanel}
      aria-label="Задания"
      title="Задания"
    >
      <ChallengesIcon size={24} />
    </button>
  )
}
