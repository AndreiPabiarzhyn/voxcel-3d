import { Tooltip } from '../../components/Tooltip'
import { useTranslations } from '../../i18n/useTranslations'
import { setViewPreset, type ViewPreset } from '../../scene/cameraController'
import { FrontViewIcon, HomeIcon, TopViewIcon } from './icons'
import './ViewPresets.css'

export function ViewPresets() {
  const t = useTranslations()

  const presets: Array<{ id: ViewPreset; label: string; Icon: typeof HomeIcon }> = [
    { id: 'home', label: t.viewPresets.home, Icon: HomeIcon },
    { id: 'front', label: t.viewPresets.front, Icon: FrontViewIcon },
    { id: 'top', label: t.viewPresets.top, Icon: TopViewIcon },
  ]

  return (
    <div className="view-presets hud-panel">
      {presets.map(({ id, label, Icon }) => (
        <Tooltip key={id} label={label}>
          <button
            type="button"
            className="hud-button"
            onClick={() => setViewPreset(id)}
            aria-label={label}
          >
            <Icon size={20} />
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
