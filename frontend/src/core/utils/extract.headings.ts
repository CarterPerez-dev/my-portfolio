// ===================
// © AngelaMos | 2025
// extract.headings.ts
// ===================

import type { TocItem } from '@/components/layout/TableOfContents'

const HEADING_REGEX = /^(#{2,3})\s+(.+)$/gm

const generateId = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const extractHeadings = (markdown: string): TocItem[] => {
  const headings: TocItem[] = []
  const matches = markdown.matchAll(HEADING_REGEX)

  for (const match of matches) {
    const level = match[1].length
    const title = match[2].trim()
    const id = generateId(title)

    headings.push({ id, title, level })
  }

  return headings
}
