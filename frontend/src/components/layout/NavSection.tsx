/**
 * ©AngelaMos | 2025
 * NavSection.tsx
 */

import { type ReactNode, useState } from 'react'
import styles from './navSection.module.scss'

interface NavSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function NavSection({
  title,
  children,
  defaultOpen = false,
}: NavSectionProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  )
}
