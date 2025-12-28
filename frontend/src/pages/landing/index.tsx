/**
 * ©AngelaMos | 2025
 * index.tsx
 */

import styles from './landing.module.scss'

export function Component(): React.ReactElement {
  return (
    <div className={styles.page}>
      <span className={styles.tmp}>temp</span>
    </div>
  )
}

Component.displayName = 'Landing'
