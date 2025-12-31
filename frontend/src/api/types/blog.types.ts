// ===================
// © AngelaMos | 2025
// blog.types.ts
// ===================

import { z } from 'zod'
import {
  BlogCategory,
  baseResponseSchema,
  Language,
  PortfolioResponseError,
} from './common.types'

export const blogResponseSchema = baseResponseSchema.extend({
  language: z.nativeEnum(Language),
  title: z.string(),
  description: z.string(),
  external_url: z.string(),
  category: z.nativeEnum(BlogCategory).nullable(),
  tags: z.array(z.string()).nullable(),
  thumbnail_url: z.string().nullable(),
  published_date: z.string().nullable(),
  read_time_minutes: z.number().int().nullable(),
  views_count: z.number().int().nullable(),
  display_order: z.number().int(),
  is_visible: z.boolean(),
  is_featured: z.boolean(),
})

export const blogBriefResponseSchema = z.object({
  title: z.string(),
  external_url: z.string(),
  category: z.nativeEnum(BlogCategory).nullable(),
  is_featured: z.boolean(),
})

export const blogListResponseSchema = z.object({
  items: z.array(blogResponseSchema),
  total: z.number().int(),
  skip: z.number().int(),
  limit: z.number().int(),
})

export type BlogResponse = z.infer<typeof blogResponseSchema>
export type BlogBriefResponse = z.infer<typeof blogBriefResponseSchema>
export type BlogListResponse = z.infer<typeof blogListResponseSchema>

export const isValidBlogResponse = (data: unknown): data is BlogResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return blogResponseSchema.safeParse(data).success
}

export const isValidBlogListResponse = (
  data: unknown
): data is BlogListResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return blogListResponseSchema.safeParse(data).success
}

export const isValidBlogBriefArrayResponse = (
  data: unknown
): data is BlogBriefResponse[] => {
  if (!Array.isArray(data)) return false
  return data.every((item) => blogBriefResponseSchema.safeParse(item).success)
}

export const isValidBlogArrayResponse = (
  data: unknown
): data is BlogResponse[] => {
  if (!Array.isArray(data)) return false
  return data.every((item) => blogResponseSchema.safeParse(item).success)
}

export class BlogResponseError extends PortfolioResponseError {
  constructor(message: string, endpoint?: string) {
    super(message, endpoint)
    this.name = 'BlogResponseError'
    Object.setPrototypeOf(this, BlogResponseError.prototype)
  }
}

export const BLOG_ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid blog data from server',
  INVALID_LIST_RESPONSE: 'Invalid blog list data from server',
  INVALID_NAV_RESPONSE: 'Invalid blog navigation data from server',
  NOT_FOUND: 'Blog not found',
} as const
