/**
 * ©AngelaMos | 2025
 * PrevNextNav.tsx
 */

import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useProjectsNav } from '@/api/hooks'
import { ROUTES } from '@/config'
import styles from './prevNextNav.module.scss'

interface NavItem {
  path: string
  label: string
  translationKey?: string
}

const STATIC_NAV_ORDER: NavItem[] = [
  { path: ROUTES.HOME, label: 'Overview', translationKey: 'nav.overview' },
]

const BACKGROUND_NAV: NavItem[] = [
  {
    path: ROUTES.BACKGROUND.EXPERIENCE,
    label: 'Experience',
    translationKey: 'nav.experience',
  },
  {
    path: ROUTES.BACKGROUND.CERTIFICATIONS,
    label: 'Certifications',
    translationKey: 'nav.certifications',
  },
]

interface PrevNextNavProps {
  currentPath?: string
}

export function PrevNextNav({
  currentPath,
}: PrevNextNavProps): React.ReactElement | null {
  const { t } = useTranslation()
  const location = useLocation()
  const { data: projectsNav } = useProjectsNav()

  const path = currentPath ?? location.pathname

  const projectNavItems: NavItem[] = (projectsNav?.items ?? []).map((p) => ({
    path: ROUTES.PROJECTS.DETAIL(p.slug),
    label: p.title,
  }))

  const fullNavOrder: NavItem[] = [
    ...STATIC_NAV_ORDER,
    ...projectNavItems,
    ...BACKGROUND_NAV,
  ]

  const currentIndex = fullNavOrder.findIndex((item) => item.path === path)

  if (currentIndex === -1) {
    return null
  }

  const prevItem = currentIndex > 0 ? fullNavOrder[currentIndex - 1] : null
  const nextItem =
    currentIndex < fullNavOrder.length - 1 ? fullNavOrder[currentIndex + 1] : null

  if (!prevItem && !nextItem) {
    return null
  }

  return (
    <nav className={styles.nav} aria-label="Page navigation">
      <div className={styles.prev}>
        {prevItem && (
          <Link to={prevItem.path} className={styles.link}>
            <span className={styles.direction}>
              <ChevronLeftIcon />
              {t('common.previous')}
            </span>
            <span className={styles.title}>
              {prevItem.translationKey
                ? t(prevItem.translationKey)
                : prevItem.label}
            </span>
          </Link>
        )}
      </div>
      <div className={styles.next}>
        {nextItem && (
          <Link to={nextItem.path} className={styles.link}>
            <span className={styles.direction}>
              {t('common.next')}
              <ChevronRightIcon />
            </span>
            <span className={styles.title}>
              {nextItem.translationKey
                ? t(nextItem.translationKey)
                : nextItem.label}
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}

function ChevronLeftIcon(): React.ReactElement {
  return (
    <svg
      className={styles.chevron}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
    </svg>
  )
}

function ChevronRightIcon(): React.ReactElement {
  return (
    <svg
      className={styles.chevron}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
    </svg>
  )
}
