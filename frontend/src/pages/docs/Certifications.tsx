/**
 * ©AngelaMos | 2025
 * Certifications.tsx
 */

import { useTranslation } from 'react-i18next'
import { useCertifications } from '@/api/hooks'
import type { CertificationResponse } from '@/api/types'
import { DocsLayout } from '@/components/layout'
import styles from './certifications.module.scss'

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

interface CertificationCardProps {
  certification: CertificationResponse
}

function CertificationCard({
  certification,
}: CertificationCardProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.certName}>{certification.name}</h3>
        <p className={styles.issuer}>{certification.issuer}</p>
        <div className={styles.meta}>
          <span className={styles.date}>
            {formatDate(certification.date_obtained)}
          </span>
          {certification.expiry_date != null && (
            <span
              className={`${styles.expiry} ${certification.is_expired ? styles.expired : ''}`}
            >
              {certification.is_expired
                ? t('certifications.expired')
                : `${t('certifications.expires')} ${formatDate(certification.expiry_date)}`}
            </span>
          )}
        </div>
      </div>
      <div className={styles.cardActions}>
        {certification.verification_url != null && (
          <a
            href={certification.verification_url}
            className={styles.verifyLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('certifications.verify')}
            <span className={styles.linkArrow}>↗</span>
          </a>
        )}
        {certification.credential_id != null && (
          <span className={styles.credentialId}>
            ID: {certification.credential_id}
          </span>
        )}
      </div>
    </article>
  )
}

export function Certifications(): React.ReactElement {
  const { t } = useTranslation()
  const { data, isLoading, error } = useCertifications()

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
        <div className={styles.error}>{t('errors.certificationsNotFound')}</div>
      </DocsLayout>
    )
  }

  return (
    <DocsLayout showToc={false}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('nav.certifications')}</h1>
        <p className={styles.count}>
          {data.total} {t('certifications.total')}
        </p>
      </header>

      <div className={styles.grid}>
        {data.items.map((certification) => (
          <CertificationCard
            key={certification.id}
            certification={certification}
          />
        ))}
      </div>
    </DocsLayout>
  )
}
