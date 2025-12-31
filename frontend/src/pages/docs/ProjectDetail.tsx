/**
 * ©AngelaMos | 2025
 * ProjectDetail.tsx
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useProject } from '@/api/hooks'
import type { ProjectResponse } from '@/api/types'
import { DocsLayout, type TocItem } from '@/components/layout'
import { Markdown } from '@/components/ui/Markdown'
import { extractHeadings } from '@/core/utils'
import styles from './project.detail.module.scss'

interface ProjectLinksProps {
  project: ProjectResponse
}

function ProjectLinks({ project }: ProjectLinksProps): React.ReactElement | null {
  const links = [
    { url: project.github_url, label: 'GitHub' },
    { url: project.demo_url, label: 'Demo' },
    { url: project.website_url, label: 'Website' },
    { url: project.docs_url, label: 'Docs' },
    { url: project.pypi_url, label: 'PyPI' },
    { url: project.npm_url, label: 'npm' },
  ].filter((link): link is { url: string; label: string } => link.url != null)

  if (links.length === 0) return null

  return (
    <div className={styles.links}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
          <span className={styles.linkArrow}>↗</span>
        </a>
      ))}
    </div>
  )
}

interface FeaturedSnippetProps {
  code: string
  language: string | null
  filename: string | null
}

function FeaturedSnippet({
  code,
  language,
  filename,
}: FeaturedSnippetProps): React.ReactElement {
  const { t } = useTranslation()
  const markdown = `\`\`\`${language ?? ''}\n${code}\n\`\`\``

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('projects.featuredSnippet')}</h2>
      {filename != null && <p className={styles.filename}>{filename}</p>}
      <Markdown content={markdown} />
    </section>
  )
}

export function ProjectDetail(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const { data: project, isLoading, error } = useProject(slug ?? '')

  const tocItems: TocItem[] = useMemo(() => {
    if (project?.technical_details == null) return []
    return extractHeadings(project.technical_details)
  }, [project?.technical_details])

  if (isLoading) {
    return (
      <DocsLayout showToc={false}>
        <div className={styles.loading}>{t('common.loading')}</div>
      </DocsLayout>
    )
  }

  if (error != null || project == null) {
    return (
      <DocsLayout showToc={false}>
        <div className={styles.error}>{t('errors.projectNotFound')}</div>
      </DocsLayout>
    )
  }

  return (
    <DocsLayout tocItems={tocItems}>
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        {project.subtitle != null && (
          <p className={styles.subtitle}>{project.subtitle}</p>
        )}
        <ProjectLinks project={project} />
      </header>

      <section className={styles.section}>
        <p className={styles.description}>{project.description}</p>
      </section>

      {project.tech_stack.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('projects.techStack')}</h2>
          <div className={styles.techStack}>
            {project.tech_stack.map((tech) => (
              <span key={tech} className={styles.techBadge}>
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {project.technical_details != null && (
        <section className={styles.section}>
          <Markdown content={project.technical_details} />
        </section>
      )}

      {project.code_snippet != null && (
        <FeaturedSnippet
          code={project.code_snippet}
          language={project.code_language}
          filename={project.code_filename}
        />
      )}
    </DocsLayout>
  )
}
