/**
 * ©AngelaMos | 2025
 * SearchResults.tsx
 */

import { Link, useSearchParams } from 'react-router-dom'
import { useSearch } from '@/api/hooks'
import { DocsLayout } from '@/components/layout'
import styles from './search.results.module.scss'

export function SearchResults(): React.ReactElement {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { data, isLoading, isError } = useSearch(query)

  return (
    <DocsLayout showToc={false} showPrevNext={false}>
      <div className={styles.container}>
        <h1 className={styles.title}>Search Results</h1>

        {query.length < 2 ? (
          <p className={styles.message}>Enter at least 2 characters to search.</p>
        ) : isLoading ? (
          <p className={styles.message}>Searching...</p>
        ) : isError ? (
          <p className={styles.message}>Something went wrong. Try again.</p>
        ) : data && data.total === 0 ? (
          <p className={styles.message}>
            No results found for "<span className={styles.query}>{query}</span>"
          </p>
        ) : data ? (
          <>
            <p className={styles.meta}>
              Found {data.total} result{data.total !== 1 ? 's' : ''} for "
              <span className={styles.query}>{query}</span>"
            </p>

            <ul className={styles.results}>
              {data.results.map((result, index) => (
                <li key={`${result.url}-${index}`} className={styles.resultItem}>
                  <Link to={result.url} className={styles.resultLink}>
                    <span className={styles.resultTitle}>{result.title}</span>
                    <span className={styles.resultType}>{result.type}</span>
                  </Link>
                  <p
                    className={styles.resultExcerpt}
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: backend ts_headline returns sanitized HTML with mark tags
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </DocsLayout>
  )
}
