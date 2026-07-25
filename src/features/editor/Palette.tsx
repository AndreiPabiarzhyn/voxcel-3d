import { Tooltip } from '../../components/Tooltip'
import { useProjectStore } from '../../store/projectStore'
import { PALETTE_COLORS } from './paletteColors'
import './Palette.css'

interface PaletteProps {
  onSelect?: (hex: string) => void
  className?: string
}

export function Palette({ onSelect, className = '' }: PaletteProps) {
  const selectedColor = useProjectStore((state) => state.selectedColor)
  const setColor = useProjectStore((state) => state.setColor)

  return (
    <div className={className ? `palette ${className}` : 'palette'}>
      {PALETTE_COLORS.map(({ hex, name }) => (
        <Tooltip key={hex} label={name}>
          <button
            type="button"
            className={
              selectedColor === hex
                ? 'palette__swatch palette__swatch--active'
                : 'palette__swatch'
            }
            style={{ backgroundColor: hex }}
            onClick={() => {
              setColor(hex)
              onSelect?.(hex)
            }}
            aria-label={name}
            aria-pressed={selectedColor === hex}
          />
        </Tooltip>
      ))}
    </div>
  )
}
