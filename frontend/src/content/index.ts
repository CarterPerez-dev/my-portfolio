// ===================
// © AngelaMos | 2025
// index.ts
// ===================

import type { Language } from '@/api/types'
import overviewEn from './overview.en.json'
import overviewEs from './overview.es.json'
import overviewFr from './overview.fr.json'
import overviewHi from './overview.hi.json'
import overviewPt from './overview.pt.json'
import overviewZh from './overview.zh.json'
import quickStartEn from './quickStart.en.json'
import quickStartEs from './quickStart.es.json'
import quickStartFr from './quickStart.fr.json'
import quickStartHi from './quickStart.hi.json'
import quickStartPt from './quickStart.pt.json'
import quickStartZh from './quickStart.zh.json'

export interface OverviewContent {
  title: string
  intro: string
  stack: string
  focus: string
}

export interface QuickStartLinkItem {
  label: string
  description: string
  key: string
}

export interface QuickStartProjectItem {
  slug: string
  description: string
}

export interface QuickStartContent {
  title: string
  description: string
  sections: {
    connect: {
      title: string
      items: QuickStartLinkItem[]
    }
    download: {
      title: string
      items: QuickStartLinkItem[]
    }
    featured: {
      title: string
      items: QuickStartProjectItem[]
    }
  }
}

const overviewContent: Record<Language, OverviewContent> = {
  en: overviewEn,
  zh: overviewZh,
  hi: overviewHi,
  es: overviewEs,
  fr: overviewFr,
  pt: overviewPt,
  ar: overviewEn,
  unknown: overviewEn,
}

const quickStartContent: Record<Language, QuickStartContent> = {
  en: quickStartEn,
  zh: quickStartZh,
  hi: quickStartHi,
  es: quickStartEs,
  fr: quickStartFr,
  pt: quickStartPt,
  ar: quickStartEn,
  unknown: quickStartEn,
}

export const getOverviewContent = (lang: Language): OverviewContent =>
  overviewContent[lang] ?? overviewContent.en

export const getQuickStartContent = (lang: Language): QuickStartContent =>
  quickStartContent[lang] ?? quickStartContent.en
