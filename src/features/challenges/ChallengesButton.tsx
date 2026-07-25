import challengeIcon from '../../assets/actionIcons/challenge.svg'
import { Tooltip } from '../../components/Tooltip'
import { useTranslations } from '../../i18n/useTranslations'
import { useChallengeStore } from './challengeStore'

export function ChallengesButton() {
  const t = useTranslations()
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId)
  const openPanel = useChallengeStore((state) => state.openPanel)

  return (
    <Tooltip label={t.challenges.buttonLabel}>
      <button
        type="button"
        className={activeChallengeId ? 'hud-button hud-button--active-gold' : 'hud-button'}
        onClick={openPanel}
        aria-label={t.challenges.buttonLabel}
      >
        <img className="hud-button__icon" src={challengeIcon} alt="" />
      </button>
    </Tooltip>
  )
}
