/**
 * ©AngelaMos | 2025
 * DocsLayout.tsx
 */

import { type ReactNode, useCallback, useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './layout.module.scss'
import { PrevNextNav } from './PrevNextNav'
import { Sidebar } from './Sidebar'
import { TableOfContents, type TocItem } from './TableOfContents'

interface DocsLayoutProps {
  children: ReactNode
  tocItems?: TocItem[]
  showToc?: boolean
  showPrevNext?: boolean
}

export function DocsLayout({
  children,
  tocItems = [],
  showToc = true,
  showPrevNext = true,
}: DocsLayoutProps): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tocDrawerOpen, setTocDrawerOpen] = useState(false)
  const hasToc = showToc && tocItems.length > 0

  const handleToggleSidebar = useCallback((): void => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const handleCloseSidebar = useCallback((): void => {
    setSidebarOpen(false)
  }, [])

  const handleToggleTocDrawer = useCallback((): void => {
    setTocDrawerOpen((prev) => !prev)
  }, [])

  const handleCloseTocDrawer = useCallback((): void => {
    setTocDrawerOpen(false)
  }, [])

  return (
    <div className={styles.layout}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={handleToggleSidebar}
        aria-label="Toggle menu"
      >
        <span className={styles.menuIcon} />
      </button>

      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <LanguageSwitcher
        showTocToggle={hasToc}
        onTocToggle={handleToggleTocDrawer}
      />

      <main className={styles.main}>
        <article className={styles.content}>
          {children}
          {showPrevNext && <PrevNextNav />}
        </article>
      </main>

      {hasToc && (
        <>
          <aside className={styles.toc}>
            <TableOfContents items={tocItems} />
          </aside>

          {tocDrawerOpen && (
            <div
              className={styles.tocOverlay}
              onClick={handleCloseTocDrawer}
              aria-hidden="true"
            />
          )}

          <aside
            className={`${styles.tocDrawer} ${tocDrawerOpen ? styles.tocDrawerOpen : ''}`}
          >
            <TableOfContents items={tocItems} />
          </aside>
        </>
      )}
    </div>
  )
}
