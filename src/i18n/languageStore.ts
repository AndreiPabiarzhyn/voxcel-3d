import { create } from 'zustand'
import { DEFAULT_LANGUAGE, isLanguageCode } from './languages'
import type { LanguageCode } from './types'

const STORAGE_KEY = 'voxcel:language'

function loadLanguage(): LanguageCode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && isLanguageCode(raw)) return raw
  } catch {
    // Storage disabled (private mode) — just fall through to the default.
  }
  return DEFAULT_LANGUAGE
}

function applyDocumentLang(language: LanguageCode) {
  document.documentElement.lang = language
}

interface LanguageState {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
}

const initialLanguage = loadLanguage()
applyDocumentLang(initialLanguage)

export const useLanguageStore = create<LanguageState>((set) => ({
  language: initialLanguage,
  setLanguage: (language) => {
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Quota exceeded or storage disabled — the pick still applies for
      // this session, it just won't survive a reload.
    }
    applyDocumentLang(language)
    set({ language })
  },
}))
