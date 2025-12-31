/**
 * ©AngelaMos | 2025
 * Sidebar.tsx
 */

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { useBlogsNav, useProjectsNav } from '@/api/hooks'
import { ROUTES } from '@/config'
import { EXTERNAL_LINKS, PORTFOLIO_VERSION } from '@/portfolio'
import { NavSection } from './NavSection'
import { Search } from './Search'
import styles from './sidebar.module.scss'
import { VersionDropdown } from './VersionDropdown'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps): React.ReactElement {
  const { t } = useTranslation()
  const { data: projectsNav } = useProjectsNav()
  const { data: blogsNav } = useBlogsNav()
  const location = useLocation()

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally triggers on pathname change to close mobile sidebar
  useEffect(() => {
    onClose?.()
  }, [location.pathname, onClose])

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <div className={styles.photo}>
          <img src="/photo-avatar.png" alt="Carter Perez" />
        </div>
        <div className={styles.identity}>
          <span className={styles.name}>Carter Perez</span>
          <span className={styles.version}>{`{${PORTFOLIO_VERSION}}`}</span>
          <a
            href={EXTERNAL_LINKS.API_DOCS}
            className={styles.apiLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            API Docs <span className={styles.apiArrow}>→</span>
          </a>
        </div>
      </div>

      <Search />

      <nav className={styles.nav}>
        <NavLink to={ROUTES.HOME} className={styles.navItemPrimary} end>
          {t('nav.overview')}
        </NavLink>

        <NavSection title={t('nav.projects')}>
          {projectsNav?.items.map((project) => (
            <NavLink
              key={project.slug}
              to={ROUTES.PROJECTS.DETAIL(project.slug)}
              className={styles.navItem}
            >
              {project.title}
            </NavLink>
          ))}
        </NavSection>

        <NavSection title={t('nav.background')}>
          <NavLink to={ROUTES.BACKGROUND.EXPERIENCE} className={styles.navItem}>
            {t('nav.experience')}
          </NavLink>
          <NavLink
            to={ROUTES.BACKGROUND.CERTIFICATIONS}
            className={styles.navItem}
          >
            {t('nav.certifications')}
          </NavLink>
        </NavSection>

        <NavSection title={t('nav.writing')}>
          {blogsNav?.map((blog) => (
            <a
              key={blog.external_url}
              href={blog.external_url}
              className={styles.navItemExternal}
              target="_blank"
              rel="noopener noreferrer"
            >
              {blog.title}
              <span className={styles.externalIcon}>→</span>
            </a>
          ))}
        </NavSection>
      </nav>

      <div className={styles.footer}>
        <VersionDropdown />
      </div>
    </aside>
  )
}
