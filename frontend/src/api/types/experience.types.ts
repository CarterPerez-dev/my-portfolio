// ===================
// © AngelaMos | 2025
// experience.types.ts
// ===================

import { z } from 'zod'
import {
  baseResponseSchema,
  EmploymentType,
  Language,
  PortfolioResponseError,
} from './common.types'

export const experienceResponseSchema = baseResponseSchema.extend({
  language: z.nativeEnum(Language),
  company: z.string(),
  company_url: z.string().nullable(),
  company_logo_url: z.string().nullable(),
  location: z.string().nullable(),
  role: z.string(),
  department: z.string().nullable(),
  employment_type: z.nativeEnum(EmploymentType).nullable(),
  start_date: z.string(),
  end_date: z.string().nullable(),
  is_current: z.boolean(),
  description: z.string(),
  responsibilities: z.array(z.string()).nullable(),
  achievements: z.array(z.string()).nullable(),
  tech_stack: z.array(z.string()).nullable(),
  display_order: z.number().int(),
  is_visible: z.boolean(),
})

export const experienceBriefResponseSchema = z.object({
  company: z.string(),
  role: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable(),
  is_current: z.boolean(),
})

export const experienceListResponseSchema = z.object({
  items: z.array(experienceResponseSchema),
  total: z.number().int(),
  skip: z.number().int(),
  limit: z.number().int(),
})

export type ExperienceResponse = z.infer<typeof experienceResponseSchema>
export type ExperienceBriefResponse = z.infer<
  typeof experienceBriefResponseSchema
>
export type ExperienceListResponse = z.infer<typeof experienceListResponseSchema>

export const isValidExperienceResponse = (
  data: unknown
): data is ExperienceResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return experienceResponseSchema.safeParse(data).success
}

export const isValidExperienceListResponse = (
  data: unknown
): data is ExperienceListResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return experienceListResponseSchema.safeParse(data).success
}

export const isValidExperienceBriefArrayResponse = (
  data: unknown
): data is ExperienceBriefResponse[] => {
  if (!Array.isArray(data)) return false
  return data.every(
    (item) => experienceBriefResponseSchema.safeParse(item).success
  )
}

export const isValidExperienceArrayResponse = (
  data: unknown
): data is ExperienceResponse[] => {
  if (!Array.isArray(data)) return false
  return data.every((item) => experienceResponseSchema.safeParse(item).success)
}

export class ExperienceResponseError extends PortfolioResponseError {
  constructor(message: string, endpoint?: string) {
    super(message, endpoint)
    this.name = 'ExperienceResponseError'
    Object.setPrototypeOf(this, ExperienceResponseError.prototype)
  }
}

export const EXPERIENCE_ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid experience data from server',
  INVALID_LIST_RESPONSE: 'Invalid experience list data from server',
  INVALID_TIMELINE_RESPONSE: 'Invalid experience timeline data from server',
  NOT_FOUND: 'Experience not found',
} as const
