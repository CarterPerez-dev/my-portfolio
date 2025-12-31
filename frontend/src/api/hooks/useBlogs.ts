// ===================
// © AngelaMos | 2025
// useBlogs.ts
// ===================

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  BLOG_ERROR_MESSAGES,
  type BlogBriefResponse,
  type BlogCategory,
  type BlogListResponse,
  type BlogResponse,
  BlogResponseError,
  isValidBlogArrayResponse,
  isValidBlogBriefArrayResponse,
  isValidBlogListResponse,
  isValidBlogResponse,
  type Language,
} from '@/api/types'
import { API_ENDPOINTS, QUERY_KEYS } from '@/config'
import { apiClient, QUERY_STRATEGIES } from '@/core/api'
import { useLanguage } from '@/core/lib'

export const blogQueries = {
  all: () => QUERY_KEYS.BLOGS.ALL,
  list: (lang: Language) => QUERY_KEYS.BLOGS.LIST(lang),
  featured: (lang: Language) => QUERY_KEYS.BLOGS.FEATURED(lang),
  nav: (lang: Language) => QUERY_KEYS.BLOGS.NAV(lang),
  byCategory: (category: BlogCategory, lang: Language) =>
    QUERY_KEYS.BLOGS.BY_CATEGORY(category, lang),
  byId: (id: string, lang: Language) => QUERY_KEYS.BLOGS.BY_ID(id, lang),
} as const

const fetchBlogs = async (lang: Language): Promise<BlogListResponse> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.BLOGS.LIST, {
    params: { lang },
  })
  const data: unknown = response.data

  if (!isValidBlogListResponse(data)) {
    throw new BlogResponseError(
      BLOG_ERROR_MESSAGES.INVALID_LIST_RESPONSE,
      API_ENDPOINTS.BLOGS.LIST
    )
  }

  return data
}

const fetchFeaturedBlogs = async (
  lang: Language,
  limit?: number
): Promise<BlogResponse[]> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.BLOGS.FEATURED, {
    params: { lang, limit },
  })
  const data: unknown = response.data

  if (!isValidBlogArrayResponse(data)) {
    throw new BlogResponseError(
      BLOG_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.BLOGS.FEATURED
    )
  }

  return data
}

const fetchBlogsNav = async (lang: Language): Promise<BlogBriefResponse[]> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.BLOGS.NAV, {
    params: { lang },
  })
  const data: unknown = response.data

  if (!isValidBlogBriefArrayResponse(data)) {
    throw new BlogResponseError(
      BLOG_ERROR_MESSAGES.INVALID_NAV_RESPONSE,
      API_ENDPOINTS.BLOGS.NAV
    )
  }

  return data
}

const fetchBlogsByCategory = async (
  category: BlogCategory,
  lang: Language
): Promise<BlogResponse[]> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.BLOGS.BY_CATEGORY(category),
    { params: { lang } }
  )
  const data: unknown = response.data

  if (!isValidBlogArrayResponse(data)) {
    throw new BlogResponseError(
      BLOG_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.BLOGS.BY_CATEGORY(category)
    )
  }

  return data
}

const fetchBlogById = async (
  id: string,
  lang: Language
): Promise<BlogResponse> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.BLOGS.BY_ID(id), {
    params: { lang },
  })
  const data: unknown = response.data

  if (!isValidBlogResponse(data)) {
    throw new BlogResponseError(
      BLOG_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.BLOGS.BY_ID(id)
    )
  }

  return data
}

export const useBlogs = (
  lang?: Language
): UseQueryResult<BlogListResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: blogQueries.list(language),
    queryFn: () => fetchBlogs(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useFeaturedBlogs = (
  limit?: number,
  lang?: Language
): UseQueryResult<BlogResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: blogQueries.featured(language),
    queryFn: () => fetchFeaturedBlogs(language, limit),
    ...QUERY_STRATEGIES.static,
  })
}

export const useBlogsNav = (
  lang?: Language
): UseQueryResult<BlogBriefResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: blogQueries.nav(language),
    queryFn: () => fetchBlogsNav(language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useBlogsByCategory = (
  category: BlogCategory,
  lang?: Language
): UseQueryResult<BlogResponse[], Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: blogQueries.byCategory(category, language),
    queryFn: () => fetchBlogsByCategory(category, language),
    ...QUERY_STRATEGIES.static,
  })
}

export const useBlog = (
  id: string,
  lang?: Language
): UseQueryResult<BlogResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: blogQueries.byId(id, language),
    queryFn: () => fetchBlogById(id, language),
    enabled: id.length > 0,
    ...QUERY_STRATEGIES.static,
  })
}
