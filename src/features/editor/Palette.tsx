import { useProjectStore } from '../../store/projectStore'
import { PALETTE_COLORS } from './paletteColors'
import './Palette.css'

interface PaletteProps {
  onSelect?: (hex: string) => void
}

export function Palette({ onSelect }: PaletteProps) {
  const selectedColor = useProjectStore((state) => state.selectedColor)
  const setColor = useProjectStore((state) => state.setColor)

  return (
    <div className="palette">
      {PALETTE_COLORS.map(({ hex, name }) => (
        <button
          key={hex}
          type="button"
          className={
            selectedColor === hex ? 'palette__swatch palette__swatch--active' : 'palette__swatch'
          }
          style={{ backgroundColor: hex }}
          onClick={() => {
            setColor(hex)
            onSelect?.(hex)
          }}
          aria-label={name}
          title={name}
          aria-pressed={selectedColor === hex}
        />
      ))}
    </div>
  )
}
