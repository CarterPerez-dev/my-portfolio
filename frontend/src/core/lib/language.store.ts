// ===================
// © AngelaMos | 2025
// language.store.ts
// ===================

import i18next from 'i18next'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { DEFAULT_LANGUAGE, Language } from '@/api/types'
import { STORAGE_KEYS } from '@/config'

interface LanguageState {
  language: Language
}

interface LanguageActions {
  setLanguage: (language: Language) => void
}

type LanguageStore = LanguageState & LanguageActions

export const useLanguageStore = create<LanguageStore>()(
  devtools(
    persist(
      (set) => ({
        language: DEFAULT_LANGUAGE,

        setLanguage: (language) => {
          if (language !== Language.UNKNOWN) {
            i18next.changeLanguage(language)
          }
          set({ language }, false, 'language/setLanguage')
        },
      }),
      {
        name: STORAGE_KEYS.LANGUAGE,
        onRehydrateStorage: () => (state) => {
          if (state?.language && state.language !== Language.UNKNOWN) {
            i18next.changeLanguage(state.language)
          }
        },
      }
    ),
    { name: 'LanguageStore' }
  )
)

export const useLanguage = (): Language => useLanguageStore((s) => s.language)
export const useSetLanguage = (): ((language: Language) => void) =>
  useLanguageStore((s) => s.setLanguage)

export { Language }
