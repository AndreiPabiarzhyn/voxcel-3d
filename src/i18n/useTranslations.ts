import { DICTIONARIES } from './languages'
import { useLanguageStore } from './languageStore'

/** Returns the full (nested) dictionary for the current language, e.g.
 * `useTranslations().toolbar.place` — plain object access instead of a
 * string-keyed `t('toolbar.place')` function keeps every call site
 * type-checked and autocompleted, and a typo just fails to compile
 * instead of silently rendering a raw key at runtime. Re-renders
 * whenever the language changes, same as any other zustand selector. */
export function useTranslations() {
  const language = useLanguageStore((state) => state.language)
  return DICTIONARIES[language]
}

/** Non-reactive equivalent for plain functions that aren't React
 * components (module-level toast helpers, the project store's default
 * name) — reads whatever the language is *right now*, once, instead of
 * subscribing to changes. */
export function getTranslations() {
  return DICTIONARIES[useLanguageStore.getState().language]
}
