// ===================
// © AngelaMos | 2025
// i18n.config.ts
// ===================

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, Language } from '@/api/types'

import en from '@/locales/en.json'
import es from '@/locales/es.json'
import fr from '@/locales/fr.json'
import hi from '@/locales/hi.json'
import pt from '@/locales/pt.json'
import zh from '@/locales/zh.json'

const resources = {
  [Language.ENGLISH]: { translation: en },
  [Language.MANDARIN]: { translation: zh },
  [Language.HINDI]: { translation: hi },
  [Language.SPANISH]: { translation: es },
  [Language.FRENCH]: { translation: fr },
  [Language.PORTUGUESE]: { translation: pt },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: Language.ENGLISH,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export const changeLanguage = (lang: Language): void => {
  if (lang !== Language.UNKNOWN) {
    i18n.changeLanguage(lang)
  }
}

export { i18n }
