import { ChallengesButton } from '../challenges/ChallengesButton'
import './EditorHud.css'
import { Palette } from './Palette'
import { Toolbar } from './Toolbar'

export function EditorHud() {
  return (
    <div className="editor-hud hud-panel">
      <Toolbar />
      <div className="hud-divider" />
      <ChallengesButton />
      <div className="hud-divider" />
      <Palette />
    </div>
  )
}
