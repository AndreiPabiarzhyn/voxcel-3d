import type { Translations } from '../../i18n/types'

export interface PaletteColor {
  hex: string
  nameKey: keyof Translations['palette']
}

export const PALETTE_COLORS: PaletteColor[] = [
  { hex: '#ff5c5c', nameKey: 'red' },
  { hex: '#ff9f43', nameKey: 'orange' },
  { hex: '#ffe066', nameKey: 'yellow' },
  { hex: '#5cff8d', nameKey: 'green' },
  { hex: '#5cd6ff', nameKey: 'cyan' },
  { hex: '#5c8dff', nameKey: 'blue' },
  { hex: '#a35cff', nameKey: 'purple' },
  { hex: '#ff5cc7', nameKey: 'pink' },
  { hex: '#8a5a44', nameKey: 'brown' },
  { hex: '#f4f4f4', nameKey: 'white' },
  { hex: '#2b2f3a', nameKey: 'black' },
  { hex: '#9aa5b1', nameKey: 'gray' },
]
