// ===================
// © AngelaMos | 2025
// certification.types.ts
// ===================

import { z } from 'zod'
import {
  baseResponseSchema,
  CertificationCategory,
  Language,
  PortfolioResponseError,
} from './common.types'

export const certificationResponseSchema = baseResponseSchema.extend({
  language: z.nativeEnum(Language),
  name: z.string(),
  issuer: z.string(),
  issuer_url: z.string().nullable(),
  issuer_logo_url: z.string().nullable(),
  credential_id: z.string().nullable(),
  verification_url: z.string().nullable(),
  date_obtained: z.string(),
  expiry_date: z.string().nullable(),
  is_expired: z.boolean(),
  badge_image_url: z.string().nullable(),
  category: z.nativeEnum(CertificationCategory).nullable(),
  display_order: z.number().int(),
  is_visible: z.boolean(),
})

export const certificationBriefResponseSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  badge_image_url: z.string().nullable(),
  category: z.nativeEnum(CertificationCategory).nullable(),
  is_expired: z.boolean(),
})

export const certificationListResponseSchema = z.object({
  items: z.array(certificationResponseSchema),
  total: z.number().int(),
  skip: z.number().int(),
  limit: z.number().int(),
})

export type CertificationResponse = z.infer<typeof certificationResponseSchema>
export type CertificationBriefResponse = z.infer<
  typeof certificationBriefResponseSchema
>
export type CertificationListResponse = z.infer<
  typeof certificationListResponseSchema
>

export const isValidCertificationResponse = (
  data: unknown
): data is CertificationResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return certificationResponseSchema.safeParse(data).success
}

export const isValidCertificationListResponse = (
  data: unknown
): data is CertificationListResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false
  return certificationListResponseSchema.safeParse(data).success
}

export const isValidCertificationBriefArrayResponse = (
  data: unknown
): data is CertificationBriefResponse[] => {
  if (!Array.isArray(data)) return false
  return data.every(
    (item) => certificationBriefResponseSchema.safeParse(item).success
  )
}

export const isValidCertificationArrayResponse = (
  data: unknown
): data is CertificationResponse[] => {
  if (!Array.isArray(data)) return false
  return data.every((item) => certificationResponseSchema.safeParse(item).success)
}

export class CertificationResponseError extends PortfolioResponseError {
  constructor(message: string, endpoint?: string) {
    super(message, endpoint)
    this.name = 'CertificationResponseError'
    Object.setPrototypeOf(this, CertificationResponseError.prototype)
  }
}

export const CERTIFICATION_ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid certification data from server',
  INVALID_LIST_RESPONSE: 'Invalid certification list data from server',
  INVALID_BADGES_RESPONSE: 'Invalid certification badges data from server',
  NOT_FOUND: 'Certification not found',
} as const
