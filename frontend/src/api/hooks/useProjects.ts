// ===================
// © AngelaMos | 2025
// useProjects.ts
// ===================

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  isValidProjectArrayResponse,
  isValidProjectListResponse,
  isValidProjectNavResponse,
  isValidProjectResponse,
  type Language,
  PROJECT_ERROR_MESSAGES,
  type ProjectListResponse,
  type ProjectNavResponse,
  type ProjectResponse,
  ProjectResponseError,
} from '@/api/types'
import { API_ENDPOINTS, QUERY_KEYS } from '@/config'
import { apiClient, QUERY_STRATEGIES } from '@/core/api'
import { useLanguage } from '@/core/lib'

export const projectQueries = {
  all: () => QUERY_KEYS.PROJECTS.ALL,
  list: (lang: Language) => QUERY_KEYS.PROJECTS.LIST(lang),
  featured: (lang: Language) => QUERY_KEYS.PROJECTS.FEATURED(lang),
  nav: (lang: Language) => QUERY_KEYS.PROJECTS.NAV(lang),
  bySlug: (slug: string, lang: Language) =>
    QUERY_KEYS.PROJECTS.BY_SLUG(slug, lang),
} as const

const fetchProjects = async (lang: Language): Promise<ProjectListResponse> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.PROJECTS.LIST, {
    params: { lang },
  })
  const data: unknown = response.data

  if (!isValidProjectListResponse(data)) {
    throw new ProjectResponseError(
      PROJECT_ERROR_MESSAGES.INVALID_LIST_RESPONSE,
      API_ENDPOINTS.PROJECTS.LIST
    )
  }

  return data
}

const fetchFeaturedProjects = async (
  lang: Language,
  limit?: number
): Promise<ProjectResponse[]> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.PROJECTS.FEATURED, {
    params: { lang, limit },
  })
  const data: unknown = response.data

  if (!isValidProjectArrayResponse(data)) {
    throw new ProjectResponseError(
      PROJECT_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.PROJECTS.FEATURED
    )
  }

  return data
}

const fetchProjectsNav = async (lang: Language): Promise<ProjectNavResponse> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.PROJECTS.NAV, {
    params: { lang },
  })
  const data: unknown = response.data

  if (!isValidProjectNavResponse(data)) {
    throw new ProjectResponseError(
      PROJECT_ERROR_MESSAGES.INVALID_NAV_RESPONSE,
      API_ENDPOINTS.PROJECTS.NAV
    )
  }

  return data
}

const fetchProjectBySlug = async (
  slug: string,
  lang: Language
): Promise<ProjectResponse> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.PROJECTS.BY_SLUG(slug),
    {
      params: { lang },
    }
  )
  const data: unknown = response.data

  if (!isValidProjectResponse(data)) {
    throw new ProjectResponseError(
      PROJECT_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.PROJECTS.BY_SLUG(slug)
    )
  }

  return data
}

export const useProjects = (
  lang?: Language
): UseQueryResult<ProjectListResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: projectQueries.list(language),
    queryFn: () => fetchProjects(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useFeaturedProjects = (
  limit?: number,
  lang?: Language
): UseQueryResult<ProjectResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: projectQueries.featured(language),
    queryFn: () => fetchFeaturedProjects(language, limit),
    ...QUERY_STRATEGIES.static,
  })
}

export const useProjectsNav = (
  lang?: Language
): UseQueryResult<ProjectNavResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: projectQueries.nav(language),
    queryFn: () => fetchProjectsNav(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useProject = (
  slug: string,
  lang?: Language
): UseQueryResult<ProjectResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: projectQueries.bySlug(slug, language),
    queryFn: () => fetchProjectBySlug(slug, language),
    enabled: slug.length > 0,
    ...QUERY_STRATEGIES.static,
  })
}
