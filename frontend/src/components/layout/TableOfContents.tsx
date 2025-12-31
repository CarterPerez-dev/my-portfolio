/**
 * ©AngelaMos | 2025
 * TableOfContents.tsx
 */

import { useTranslation } from 'react-i18next'
import styles from './tableOfContents.module.scss'

export interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({
  items,
}: TableOfContentsProps): React.ReactElement {
  const { t } = useTranslation()

  const handleClick = (id: string): void => {
    const element = document.getElementById(id)
    if (element != null) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={styles.toc} aria-label={t('nav.onThisPage')}>
      <h4 className={styles.title}>{t('nav.onThisPage')}</h4>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <button
              type="button"
              className={`${styles.link} ${item.level > 2 ? styles.nested : ''}`}
              onClick={() => handleClick(item.id)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
