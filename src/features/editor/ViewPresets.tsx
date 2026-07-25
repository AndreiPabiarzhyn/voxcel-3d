import { setViewPreset, type ViewPreset } from '../../scene/cameraController'
import { FrontViewIcon, HomeIcon, TopViewIcon } from './icons'
import './ViewPresets.css'

const PRESETS: Array<{ id: ViewPreset; label: string; Icon: typeof HomeIcon }> = [
  { id: 'home', label: 'Обычный вид', Icon: HomeIcon },
  { id: 'front', label: 'Вид спереди', Icon: FrontViewIcon },
  { id: 'top', label: 'Вид сверху', Icon: TopViewIcon },
]

export function ViewPresets() {
  return (
    <div className="view-presets hud-panel">
      {PRESETS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className="hud-button"
          onClick={() => setViewPreset(id)}
          aria-label={label}
          title={label}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  )
}
