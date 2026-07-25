import { en } from './dictionaries/en'
import { es } from './dictionaries/es'
import { id } from './dictionaries/id'
import { it } from './dictionaries/it'
import { pl } from './dictionaries/pl'
import { pt } from './dictionaries/pt'
import { ru } from './dictionaries/ru'
import { tr } from './dictionaries/tr'
import type { LanguageCode, Translations } from './types'

export const DICTIONARIES: Record<LanguageCode, Translations> = { en, pl, it, es, tr, ru, pt, id }

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

interface LanguageOption {
  code: LanguageCode
  /** Always shown in that language's own script/spelling, regardless of
   * the current UI language — a Polish speaker recognizes "Polski"
   * whether the app is currently in Turkish or English. */
  nativeName: string
}

// Order matches how Andrei listed them (English first as the default).
export const LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English' },
  { code: 'pl', nativeName: 'Polski' },
  { code: 'it', nativeName: 'Italiano' },
  { code: 'es', nativeName: 'Español' },
  { code: 'tr', nativeName: 'Türkçe' },
  { code: 'ru', nativeName: 'Русский' },
  { code: 'pt', nativeName: 'Português' },
  { code: 'id', nativeName: 'Bahasa Indonesia' },
]

export function isLanguageCode(value: string): value is LanguageCode {
  return value in DICTIONARIES
}
