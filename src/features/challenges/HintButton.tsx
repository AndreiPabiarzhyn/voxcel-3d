import lightbulbIcon from '../../assets/actionIcons/lightbulb.svg'
import { Tooltip } from '../../components/Tooltip'
import { useTranslations } from '../../i18n/useTranslations'
import './HintButton.css'
import { useChallengeStore } from './challengeStore'

/** Only visible while a challenge is active — toggles whether
 * ChallengeGhost renders its preview cubes, so a kid can hide the
 * answer and test themselves, then bring it back if stuck. */
export function HintButton() {
  const t = useTranslations()
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId)
  const hintVisible = useChallengeStore((state) => state.hintVisible)
  const toggleHint = useChallengeStore((state) => state.toggleHint)

  if (!activeChallengeId) return null

  return (
    <Tooltip label={hintVisible ? t.hint.hide : t.hint.show}>
      <button
        type="button"
        className={
          hintVisible
            ? 'hint-button hud-button hud-button--active-gold'
            : 'hint-button hud-button'
        }
        onClick={toggleHint}
        aria-label={t.hint.label}
        aria-pressed={hintVisible}
      >
        <img className="hud-button__icon" src={lightbulbIcon} alt="" />
      </button>
    </Tooltip>
  )
}
