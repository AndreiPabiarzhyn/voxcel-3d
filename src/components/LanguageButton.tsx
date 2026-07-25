import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import globeIcon from '../assets/actionIcons/globe.svg'
import { LANGUAGES } from '../i18n/languages'
import { useLanguageStore } from '../i18n/languageStore'
import { useTranslations } from '../i18n/useTranslations'
import './LanguageButton.css'
import { Tooltip } from './Tooltip'

export function LanguageButton() {
  const t = useTranslations()
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ right: 0, bottom: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || popoverRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  function toggleOpen() {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      // Anchored to the button's *right* edge, not centered on it — the
      // button sits in the bottom-right corner, so centering a ~170px
      // wide popover on it pushed the popover's right half off-screen.
      setPos({ right: window.innerWidth - rect.right, bottom: window.innerHeight - rect.top + 10 })
    }
    setOpen((value) => !value)
  }

  return (
    <>
      <Tooltip label={t.language.buttonLabel} disabled={open}>
        <button
          ref={buttonRef}
          type="button"
          className="language-button hud-button"
          onClick={toggleOpen}
          aria-label={t.language.buttonLabel}
          aria-pressed={open}
        >
          <img className="hud-button__icon" src={globeIcon} alt="" />
        </button>
      </Tooltip>
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="language-button__popover"
            style={{ right: pos.right, bottom: pos.bottom }}
          >
            <div className="language-button__card hud-panel hud-panel--column">
              {LANGUAGES.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  className={
                    option.code === language
                      ? 'language-button__option language-button__option--active'
                      : 'language-button__option'
                  }
                  onClick={() => {
                    setLanguage(option.code)
                    setOpen(false)
                  }}
                  aria-pressed={option.code === language}
                >
                  {option.nativeName}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
