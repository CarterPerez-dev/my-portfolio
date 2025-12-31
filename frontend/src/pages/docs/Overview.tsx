/**
 * ©AngelaMos | 2025
 * Overview.tsx
 */

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DocsLayout, type TocItem } from '@/components/layout'
import { ROUTES } from '@/config'
import { getOverviewContent, getQuickStartContent } from '@/content'
import { useLanguage } from '@/core/lib'
import { EXTERNAL_LINKS, PORTFOLIO_STATS } from '@/portfolio'
import styles from './overview.module.scss'

const LINK_URLS: Record<string, string> = {
  github: EXTERNAL_LINKS.GITHUB,
  linkedin: EXTERNAL_LINKS.LINKEDIN,
  email: `mailto:${EXTERNAL_LINKS.EMAIL}`,
  resume: EXTERNAL_LINKS.RESUME,
}

const TOC_ITEMS: TocItem[] = [
  { id: 'connect', title: 'Connect', level: 2 },
  { id: 'download', title: 'Download', level: 2 },
  { id: 'featured-projects', title: 'Featured Projects', level: 2 },
]

export function Overview(): React.ReactElement {
  const { t } = useTranslation()
  const language = useLanguage()
  const overview = getOverviewContent(language)
  const quickStart = getQuickStartContent(language)

  return (
    <DocsLayout tocItems={TOC_ITEMS}>
      <header className={styles.header}>
        <h1 className={styles.title}>{overview.title}</h1>
        <div className={styles.badges}>
          <a
            href={EXTERNAL_LINKS.GITHUB}
            className={styles.badge}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.badgeLabel}>{t('overview.projects')}</span>
            <span className={styles.badgeValue}>{PORTFOLIO_STATS.PROJECTS}</span>
          </a>
          <a
            href={EXTERNAL_LINKS.GITHUB}
            className={styles.badge}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.badgeLabel}>{t('overview.commits')}</span>
            <span className={styles.badgeValue}>{PORTFOLIO_STATS.COMMITS}</span>
          </a>
          <a
            href={EXTERNAL_LINKS.GITHUB}
            className={styles.badge}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.badgeLabel}>{t('overview.certs')}</span>
            <span className={styles.badgeValue}>{PORTFOLIO_STATS.CERTS}</span>
          </a>
        </div>
      </header>

      <section className={styles.intro}>
        <p className={styles.paragraph}>{overview.intro}</p>
        <p className={styles.paragraph}>{overview.stack}</p>
        <p className={styles.paragraph}>{overview.focus}</p>
      </section>

      <section className={styles.section}>
        <h2 id="connect" className={styles.sectionTitle}>
          {quickStart.sections.connect.title}
        </h2>
        <div className={styles.linkGrid}>
          {quickStart.sections.connect.items.map((item) => (
            <a
              key={item.key}
              href={LINK_URLS[item.key]}
              className={styles.linkCard}
              target={item.key !== 'email' ? '_blank' : undefined}
              rel={item.key !== 'email' ? 'noopener noreferrer' : undefined}
            >
              <span className={styles.linkLabel}>{item.label}</span>
              <span className={styles.linkDescription}>{item.description}</span>
              <span className={styles.linkArrow}>→</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 id="download" className={styles.sectionTitle}>
          {quickStart.sections.download.title}
        </h2>
        <div className={styles.linkGrid}>
          {quickStart.sections.download.items.map((item) => (
            <a
              key={item.key}
              href={LINK_URLS[item.key]}
              className={styles.linkCard}
              download={item.key === 'resume'}
            >
              <span className={styles.linkLabel}>{item.label}</span>
              <span className={styles.linkDescription}>{item.description}</span>
              <span className={styles.linkArrow}>↓</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 id="featured-projects" className={styles.sectionTitle}>
          {quickStart.sections.featured.title}
        </h2>
        <div className={styles.projectGrid}>
          {quickStart.sections.featured.items.map((item) => (
            <Link
              key={item.slug}
              to={ROUTES.PROJECTS.DETAIL(item.slug)}
              className={styles.projectCard}
            >
              <span className={styles.projectSlug}>{item.slug}</span>
              <span className={styles.projectDescription}>
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </DocsLayout>
  )
}
