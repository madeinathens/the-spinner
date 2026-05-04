import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { en, type I18nDict } from './en'
import { el } from './el'

export type Lang = 'en' | 'el'

const DICT: Record<Lang, I18nDict> = { en, el }

interface I18nCtx {
  lang: Lang
  t: I18nDict
  setLang: (l: Lang) => void
}

const I18nContext = createContext<I18nCtx | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof localStorage === 'undefined') return 'en'
    const saved = localStorage.getItem('spinner_lang')
    if (saved === 'en' || saved === 'el') return saved
    // Auto-detect Greek browsers
    const browser = navigator.language?.toLowerCase() || ''
    return browser.startsWith('el') ? 'el' : 'en'
  })

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('spinner_lang', lang)
    } catch {
      /* noop */
    }
  }, [lang])

  const value: I18nCtx = {
    lang,
    t: DICT[lang],
    setLang: setLangState,
  }
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nCtx {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be inside I18nProvider')
  return ctx
}
