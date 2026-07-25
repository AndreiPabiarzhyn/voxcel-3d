import challengeIcon from '../../assets/actionIcons/challenge.svg'
import { Tooltip } from '../../components/Tooltip'
import { useChallengeStore } from './challengeStore'

export function ChallengesButton() {
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId)
  const openPanel = useChallengeStore((state) => state.openPanel)

  return (
    <Tooltip label="Задания">
      <button
        type="button"
        className={activeChallengeId ? 'hud-button hud-button--active-gold' : 'hud-button'}
        onClick={openPanel}
        aria-label="Задания"
      >
        <img className="hud-button__icon" src={challengeIcon} alt="" />
      </button>
    </Tooltip>
  )
}
