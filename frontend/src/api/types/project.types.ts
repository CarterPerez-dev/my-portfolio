// ===================
// © AngelaMos | 2025
// project.types.ts
// ===================

import { z } from 'zod'
import {
  baseResponseSchema,
  Language,
  PortfolioResponseError,
  ProjectStatus,
} from './common.types'

export const projectResponseSchema = baseResponseSchema.extend({
  slug: z.string(),
  language: z.nativeEnum(Language),
  title: z.string(),
  subtitle: z.string().nullable(),
  description: z.string(),
  technical_details: z.string().nullable(),
  tech_stack: z.array(z.string()),
  github_url: z.string().nullable(),
  demo_url: z.string().nullable(),
  website_url: z.string().nullable(),
  docs_url: z.string().nullable(),
  blog_url: z.string().nullable(),
  pypi_url: z.string().nullable(),
  npm_url: z.string().nullable(),
  ios_url: z.string().nullable(),
  android_url: z.string().nullable(),
  code_snippet: z.string().nullable(),
  code_language: z.string().nullable(),
  code_filename: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  banner_url: z.string().nullable(),
  screenshots: z.array(z.string()).nullable(),
  stars_count: z.number().int().nullable(),
  forks_count: z.number().int().nullable(),
  downloads_count: z.number().int().nullable(),
  users_count: z.number().int().nullable(),
  display_order: z.number().int(),
  is_complete: z.boolean(),
  is_featured: z.boolean(),
  status: z.nativeEnum(ProjectStatus).nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
})

export const projectBriefResponseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  status: z.nativeEnum(ProjectStatus).nullable(),
  is_featured: z.boolean(),
})

export const projectListResponseSchema = z.object({
  items: z.array(projectResponseSchema),
  total: z.number().int(),
  skip: z.number().int(),
  limit: z.number().int(),
})

export const projectNavResponseSchema = z.object({
  items: z.array(projectBriefResponseSchema),
  total: z.number().int(),
})

export type ProjectResponse = z.infer<typeof projectResponseSchema>
export type ProjectBriefResponse = z.infer<typeof projectBriefResponseSchema>
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>
export type ProjectNavResponse = z.infer<typeof projectNavResponseSchema>

export const isValidProjectResponse = (
  data: unknown
): data is ProjectResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return projectResponseSchema.safeParse(data).success
}

export const isValidProjectListResponse = (
  data: unknown
): data is ProjectListResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return projectListResponseSchema.safeParse(data).success
}

export const isValidProjectNavResponse = (
  data: unknown
): data is ProjectNavResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return projectNavResponseSchema.safeParse(data).success
}

export const isValidProjectArrayResponse = (
  data: unknown
): data is ProjectResponse[] => {
  if (!Array.isArray(data)) return false
  return data.every((item) => projectResponseSchema.safeParse(item).success)
}

export class ProjectResponseError extends PortfolioResponseError {
  constructor(message: string, endpoint?: string) {
    super(message, endpoint)
    this.name = 'ProjectResponseError'
    Object.setPrototypeOf(this, ProjectResponseError.prototype)
  }
}

export const PROJECT_ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid project data from server',
  INVALID_LIST_RESPONSE: 'Invalid project list data from server',
  INVALID_NAV_RESPONSE: 'Invalid project navigation data from server',
  NOT_FOUND: 'Project not found',
} as const
