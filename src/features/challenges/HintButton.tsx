import lightbulbIcon from '../../assets/actionIcons/lightbulb.svg'
import { Tooltip } from '../../components/Tooltip'
import './HintButton.css'
import { useChallengeStore } from './challengeStore'

/** Only visible while a challenge is active — toggles whether
 * ChallengeGhost renders its preview cubes, so a kid can hide the
 * answer and test themselves, then bring it back if stuck. */
export function HintButton() {
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId)
  const hintVisible = useChallengeStore((state) => state.hintVisible)
  const toggleHint = useChallengeStore((state) => state.toggleHint)

  if (!activeChallengeId) return null

  return (
    <div className="hint-button hud-panel">
      <Tooltip label={hintVisible ? 'Скрыть подсказку' : 'Показать подсказку'}>
        <button
          type="button"
          className={hintVisible ? 'hud-button hud-button--active-gold' : 'hud-button'}
          onClick={toggleHint}
          aria-label="Подсказка"
          aria-pressed={hintVisible}
        >
          <img className="hud-button__icon" src={lightbulbIcon} alt="" />
        </button>
      </Tooltip>
    </div>
  )
}
