/**
 * ©AngelaMos | 2025
 * index.tsx
 */

import styles from './dashboard.module.scss'

export function Component(): React.ReactElement {
  return (
    <div className={styles.page}>
      <span className={styles.text}>COMING SOON</span>
    </div>
  )
}

Component.displayName = 'Dashboard'
