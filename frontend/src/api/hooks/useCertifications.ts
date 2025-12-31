// ===================
// © AngelaMos | 2025
// useCertifications.ts
// ===================

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  CERTIFICATION_ERROR_MESSAGES,
  type CertificationBriefResponse,
  type CertificationCategory,
  type CertificationListResponse,
  type CertificationResponse,
  CertificationResponseError,
  isValidCertificationArrayResponse,
  isValidCertificationBriefArrayResponse,
  isValidCertificationListResponse,
  isValidCertificationResponse,
  type Language,
} from '@/api/types'
import { API_ENDPOINTS, QUERY_KEYS } from '@/config'
import { apiClient, QUERY_STRATEGIES } from '@/core/api'
import { useLanguage } from '@/core/lib'

export const certificationQueries = {
  all: () => QUERY_KEYS.CERTIFICATIONS.ALL,
  list: (lang: Language) => QUERY_KEYS.CERTIFICATIONS.LIST(lang),
  active: (lang: Language) => QUERY_KEYS.CERTIFICATIONS.ACTIVE(lang),
  badges: (lang: Language) => QUERY_KEYS.CERTIFICATIONS.BADGES(lang),
  byCategory: (category: CertificationCategory, lang: Language) =>
    QUERY_KEYS.CERTIFICATIONS.BY_CATEGORY(category, lang),
  byId: (id: string, lang: Language) => QUERY_KEYS.CERTIFICATIONS.BY_ID(id, lang),
} as const

const fetchCertifications = async (
  lang: Language
): Promise<CertificationListResponse> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.CERTIFICATIONS.LIST,
    {
      params: { lang },
    }
  )
  const data: unknown = response.data

  if (!isValidCertificationListResponse(data)) {
    throw new CertificationResponseError(
      CERTIFICATION_ERROR_MESSAGES.INVALID_LIST_RESPONSE,
      API_ENDPOINTS.CERTIFICATIONS.LIST
    )
  }

  return data
}

const fetchActiveCertifications = async (
  lang: Language
): Promise<CertificationResponse[]> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.CERTIFICATIONS.ACTIVE,
    {
      params: { lang },
    }
  )
  const data: unknown = response.data

  if (!isValidCertificationArrayResponse(data)) {
    throw new CertificationResponseError(
      CERTIFICATION_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.CERTIFICATIONS.ACTIVE
    )
  }

  return data
}

const fetchCertificationBadges = async (
  lang: Language
): Promise<CertificationBriefResponse[]> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.CERTIFICATIONS.BADGES,
    {
      params: { lang },
    }
  )
  const data: unknown = response.data

  if (!isValidCertificationBriefArrayResponse(data)) {
    throw new CertificationResponseError(
      CERTIFICATION_ERROR_MESSAGES.INVALID_BADGES_RESPONSE,
      API_ENDPOINTS.CERTIFICATIONS.BADGES
    )
  }

  return data
}

const fetchCertificationsByCategory = async (
  category: CertificationCategory,
  lang: Language
): Promise<CertificationResponse[]> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.CERTIFICATIONS.BY_CATEGORY(category),
    { params: { lang } }
  )
  const data: unknown = response.data

  if (!isValidCertificationArrayResponse(data)) {
    throw new CertificationResponseError(
      CERTIFICATION_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.CERTIFICATIONS.BY_CATEGORY(category)
    )
  }

  return data
}

const fetchCertificationById = async (
  id: string,
  lang: Language
): Promise<CertificationResponse> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.CERTIFICATIONS.BY_ID(id),
    { params: { lang } }
  )
  const data: unknown = response.data

  if (!isValidCertificationResponse(data)) {
    throw new CertificationResponseError(
      CERTIFICATION_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.CERTIFICATIONS.BY_ID(id)
    )
  }

  return data
}

export const useCertifications = (
  lang?: Language
): UseQueryResult<CertificationListResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: certificationQueries.list(language),
    queryFn: () => fetchCertifications(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useActiveCertifications = (
  lang?: Language
): UseQueryResult<CertificationResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: certificationQueries.active(language),
    queryFn: () => fetchActiveCertifications(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useCertificationBadges = (
  lang?: Language
): UseQueryResult<CertificationBriefResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: certificationQueries.badges(language),
    queryFn: () => fetchCertificationBadges(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useCertificationsByCategory = (
  category: CertificationCategory,
  lang?: Language
): UseQueryResult<CertificationResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: certificationQueries.byCategory(category, language),
    queryFn: () => fetchCertificationsByCategory(category, language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useCertification = (
  id: string,
  lang?: Language
): UseQueryResult<CertificationResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: certificationQueries.byId(id, language),
    queryFn: () => fetchCertificationById(id, language),
    enabled: id.length > 0,
    ...QUERY_STRATEGIES.static,
  })
}
