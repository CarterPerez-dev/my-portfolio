/**
 * ©AngelaMos | 2025
 * Search.tsx
 */

import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config'
import styles from './search.module.scss'

export function Search(): React.ReactElement {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length >= 2) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder={t('common.searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={t('common.search')}
      />
    </form>
  )
}
