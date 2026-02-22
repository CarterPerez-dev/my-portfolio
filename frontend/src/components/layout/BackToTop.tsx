/**
 * ©AngelaMos | 2025
 * BackToTop.tsx
 */

import { useCallback } from 'react'
import styles from './back.to.top.module.scss'

export function BackToTop(): React.ReactElement {
  const handleScrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  return (
    <button
      type="button"
      className={styles.backToTop}
      onClick={handleScrollToTop}
      aria-label="Scroll to top"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={styles.icon}
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
