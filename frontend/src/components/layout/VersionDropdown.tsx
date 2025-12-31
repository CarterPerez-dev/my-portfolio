/**
 * ©AngelaMos | 2025
 * VersionDropdown.tsx
 */

import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from '@/core/utils'
import { EXTERNAL_LINKS } from '@/portfolio'
import styles from './versionDropdown.module.scss'

function DocIcon(): React.ReactElement {
  return (
    <svg
      className={styles.docIcon}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2zm0 14H5V5c0-.806.55-.988 1-1h13v12z" />
    </svg>
  )
}

function GitBranchIcon(): React.ReactElement {
  return (
    <svg
      className={styles.branchIcon}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
    </svg>
  )
}

function ChevronIcon({ isOpen }: { isOpen: boolean }): React.ReactElement {
  return (
    <svg
      className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
    </svg>
  )
}

export function VersionDropdown(): React.ReactElement {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, () => setIsOpen(false))

  return (
    <div ref={ref} className={styles.dropdown}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <DocIcon />
        <GitBranchIcon />
        <span className={styles.label}>{t('version.stable')}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className={styles.menu} role="menu">
          <a
            href={EXTERNAL_LINKS.GITHUB}
            className={styles.item}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
          >
            {t('version.github')}
            <span className={styles.external}>↗</span>
          </a>
          <a
            href={EXTERNAL_LINKS.RESUME}
            className={styles.item}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
          >
            {t('version.resume')}
            <span className={styles.external}>↗</span>
          </a>
          <a
            href={`mailto:${EXTERNAL_LINKS.EMAIL}`}
            className={styles.item}
            role="menuitem"
          >
            {t('version.contact')}
          </a>
        </div>
      )}
    </div>
  )
}
