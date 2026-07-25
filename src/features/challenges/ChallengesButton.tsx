import { useChallengeStore } from './challengeStore'

const CHALLENGE_ICON = `${import.meta.env.BASE_URL}icons/actions/challenge.svg`

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
      <img className="hud-button__icon" src={CHALLENGE_ICON} alt="" />
    </button>
  )
}
