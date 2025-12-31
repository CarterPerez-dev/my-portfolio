// ===================
// © AngelaMos | 2025
// common.types.ts
// ===================

import { z } from 'zod'

export const Language = {
  UNKNOWN: 'unknown',
  ENGLISH: 'en',
  MANDARIN: 'zh',
  HINDI: 'hi',
  SPANISH: 'es',
  FRENCH: 'fr',
  ARABIC: 'ar',
  PORTUGUESE: 'pt',
} as const

export type Language = (typeof Language)[keyof typeof Language]

export const ProjectStatus = {
  UNKNOWN: 'unknown',
  ACTIVE: 'active',
  MAINTAINED: 'maintained',
  ARCHIVED: 'archived',
  DEPRECATED: 'deprecated',
} as const

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]

export const EmploymentType = {
  UNKNOWN: 'unknown',
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  INTERNSHIP: 'internship',
} as const

export type EmploymentType = (typeof EmploymentType)[keyof typeof EmploymentType]

export const CertificationCategory = {
  UNKNOWN: 'unknown',
  SECURITY: 'security',
  CLOUD: 'cloud',
  PROGRAMMING: 'programming',
  NETWORKING: 'networking',
  DATABASE: 'database',
  DEVOPS: 'devops',
} as const

export type CertificationCategory =
  (typeof CertificationCategory)[keyof typeof CertificationCategory]

export const BlogCategory = {
  UNKNOWN: 'unknown',
  TUTORIAL: 'tutorial',
  DEEP_DIVE: 'deep_dive',
  CAREER: 'career',
  PROJECT: 'project',
  OPINION: 'opinion',
} as const

export type BlogCategory = (typeof BlogCategory)[keyof typeof BlogCategory]

export const baseResponseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
})

export interface PaginationParams {
  skip?: number
  limit?: number
}

export interface FeaturedParams {
  limit?: number
}

export const DEFAULT_LANGUAGE: Language = Language.ENGLISH
export const DEFAULT_SKIP = 0
export const DEFAULT_LIMIT = 100
export const DEFAULT_FEATURED_LIMIT = 10

export class PortfolioResponseError extends Error {
  readonly endpoint?: string

  constructor(message: string, endpoint?: string) {
    super(message)
    this.name = 'PortfolioResponseError'
    this.endpoint = endpoint
    Object.setPrototypeOf(this, PortfolioResponseError.prototype)
  }
}
