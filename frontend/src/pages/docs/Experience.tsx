/**
 * ©AngelaMos | 2025
 * Experience.tsx
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useExperiences } from '@/api/hooks'
import type { ExperienceResponse } from '@/api/types'
import { DocsLayout, type TocItem } from '@/components/layout'
import { Markdown } from '@/components/ui/Markdown'
import styles from './experience.module.scss'

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const generateCompanyId = (company: string): string =>
  company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

interface ExperienceCardProps {
  experience: ExperienceResponse
}

function ExperienceCard({ experience }: ExperienceCardProps): React.ReactElement {
  const { t } = useTranslation()
  const companyId = generateCompanyId(experience.company)
  const startDate = formatDate(experience.start_date)
  const endDate = experience.is_current
    ? t('experience.present')
    : experience.end_date != null
      ? formatDate(experience.end_date)
      : ''

  return (
    <article className={styles.card} id={companyId}>
      <header className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <h2 className={styles.company}>{experience.company}</h2>
          <span className={styles.dates}>
            {startDate} - {endDate}
          </span>
        </div>
        <p className={styles.role}>{experience.role}</p>
        {experience.location != null && (
          <p className={styles.location}>{experience.location}</p>
        )}
      </header>

      <div className={styles.cardContent}>
        <Markdown content={experience.description} />
      </div>

      {experience.tech_stack != null && experience.tech_stack.length > 0 && (
        <div className={styles.techStack}>
          {experience.tech_stack.map((tech) => (
            <span key={tech} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export function Experience(): React.ReactElement {
  const { t } = useTranslation()
  const { data, isLoading, error } = useExperiences()

  const tocItems: TocItem[] = useMemo(() => {
    if (data?.items == null) return []
    return data.items.map((exp) => ({
      id: generateCompanyId(exp.company),
      title: exp.company,
      level: 2,
    }))
  }, [data?.items])

  if (isLoading) {
    return (
      <DocsLayout showToc={false}>
        <div className={styles.loading}>{t('common.loading')}</div>
      </DocsLayout>
    )
  }

  if (error != null || data == null) {
    return (
      <DocsLayout showToc={false}>
        <div className={styles.error}>{t('errors.experienceNotFound')}</div>
      </DocsLayout>
    )
  }

  return (
    <DocsLayout tocItems={tocItems}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('nav.experience')}</h1>
      </header>

      <div className={styles.timeline}>
        {data.items.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </DocsLayout>
  )
}
