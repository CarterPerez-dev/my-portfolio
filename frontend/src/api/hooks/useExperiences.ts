// ===================
// © AngelaMos | 2025
// useExperiences.ts
// ===================

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  EXPERIENCE_ERROR_MESSAGES,
  type ExperienceBriefResponse,
  type ExperienceListResponse,
  type ExperienceResponse,
  ExperienceResponseError,
  isValidExperienceArrayResponse,
  isValidExperienceBriefArrayResponse,
  isValidExperienceListResponse,
  isValidExperienceResponse,
  type Language,
} from '@/api/types'
import { API_ENDPOINTS, QUERY_KEYS } from '@/config'
import { apiClient, QUERY_STRATEGIES } from '@/core/api'
import { useLanguage } from '@/core/lib'

export const experienceQueries = {
  all: () => QUERY_KEYS.EXPERIENCES.ALL,
  list: (lang: Language) => QUERY_KEYS.EXPERIENCES.LIST(lang),
  current: (lang: Language) => QUERY_KEYS.EXPERIENCES.CURRENT(lang),
  timeline: (lang: Language) => QUERY_KEYS.EXPERIENCES.TIMELINE(lang),
  byId: (id: string, lang: Language) => QUERY_KEYS.EXPERIENCES.BY_ID(id, lang),
} as const

const fetchExperiences = async (
  lang: Language
): Promise<ExperienceListResponse> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.EXPERIENCES.LIST, {
    params: { lang },
  })
  const data: unknown = response.data

  if (!isValidExperienceListResponse(data)) {
    throw new ExperienceResponseError(
      EXPERIENCE_ERROR_MESSAGES.INVALID_LIST_RESPONSE,
      API_ENDPOINTS.EXPERIENCES.LIST
    )
  }

  return data
}

const fetchCurrentExperiences = async (
  lang: Language
): Promise<ExperienceResponse[]> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.EXPERIENCES.CURRENT,
    {
      params: { lang },
    }
  )
  const data: unknown = response.data

  if (!isValidExperienceArrayResponse(data)) {
    throw new ExperienceResponseError(
      EXPERIENCE_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.EXPERIENCES.CURRENT
    )
  }

  return data
}

const fetchExperienceTimeline = async (
  lang: Language
): Promise<ExperienceBriefResponse[]> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.EXPERIENCES.TIMELINE,
    {
      params: { lang },
    }
  )
  const data: unknown = response.data

  if (!isValidExperienceBriefArrayResponse(data)) {
    throw new ExperienceResponseError(
      EXPERIENCE_ERROR_MESSAGES.INVALID_TIMELINE_RESPONSE,
      API_ENDPOINTS.EXPERIENCES.TIMELINE
    )
  }

  return data
}

const fetchExperienceById = async (
  id: string,
  lang: Language
): Promise<ExperienceResponse> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.EXPERIENCES.BY_ID(id),
    {
      params: { lang },
    }
  )
  const data: unknown = response.data

  if (!isValidExperienceResponse(data)) {
    throw new ExperienceResponseError(
      EXPERIENCE_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.EXPERIENCES.BY_ID(id)
    )
  }

  return data
}

export const useExperiences = (
  lang?: Language
): UseQueryResult<ExperienceListResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: experienceQueries.list(language),
    queryFn: () => fetchExperiences(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useCurrentExperiences = (
  lang?: Language
): UseQueryResult<ExperienceResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: experienceQueries.current(language),
    queryFn: () => fetchCurrentExperiences(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useExperienceTimeline = (
  lang?: Language
): UseQueryResult<ExperienceBriefResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: experienceQueries.timeline(language),
    queryFn: () => fetchExperienceTimeline(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useExperience = (
  id: string,
  lang?: Language
): UseQueryResult<ExperienceResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: experienceQueries.byId(id, language),
    queryFn: () => fetchExperienceById(id, language),
    enabled: id.length > 0,
    ...QUERY_STRATEGIES.static,
  })
}
