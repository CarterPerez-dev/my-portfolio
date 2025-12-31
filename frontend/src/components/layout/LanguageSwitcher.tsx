/**
 * ©AngelaMos | 2025
 * LanguageSwitcher.tsx
 */

import { Language } from '@/api/types'
import { useLanguage, useSetLanguage } from '@/core/lib'
import styles from './language.switcher.module.scss'

const LANGUAGES: { code: Language; label: string }[] = [
  { code: Language.ENGLISH, label: 'EN' },
  { code: Language.MANDARIN, label: '中' },
  { code: Language.HINDI, label: 'हि' },
  { code: Language.SPANISH, label: 'ES' },
  { code: Language.FRENCH, label: 'FR' },
  { code: Language.PORTUGUESE, label: 'PT' },
]

interface LanguageSwitcherProps {
  showTocToggle?: boolean
  onTocToggle?: () => void
}

function TocToggleIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={styles.tocIcon}
    >
      <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
    </svg>
  )
}

export function LanguageSwitcher({
  showTocToggle = false,
  onTocToggle,
}: LanguageSwitcherProps): React.ReactElement {
  const currentLanguage = useLanguage()
  const setLanguage = useSetLanguage()

  return (
    <div className={styles.switcher}>
      <div className={styles.languages}>
        {LANGUAGES.map((lang, index) => (
          <span key={lang.code}>
            <button
              type="button"
              className={`${styles.lang} ${currentLanguage === lang.code ? styles.active : ''}`}
              onClick={() => setLanguage(lang.code)}
              aria-label={`Switch to ${lang.label}`}
              aria-current={currentLanguage === lang.code ? 'true' : undefined}
            >
              {lang.label}
            </button>
            {index < LANGUAGES.length - 1 && (
              <span className={styles.separator}>·</span>
            )}
          </span>
        ))}
      </div>
      {showTocToggle && onTocToggle && (
        <button
          type="button"
          className={styles.tocToggle}
          onClick={onTocToggle}
          aria-label="Toggle table of contents"
        >
          <TocToggleIcon />
        </button>
      )}
    </div>
  )
}
