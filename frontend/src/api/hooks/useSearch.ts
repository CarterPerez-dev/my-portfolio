// ===================
// © AngelaMos | 2025
// useSearch.ts
// ===================

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  isValidSearchResponse,
  type Language,
  SEARCH_ERROR_MESSAGES,
  type SearchResponse,
  SearchResponseError,
} from '@/api/types'
import { API_ENDPOINTS, QUERY_KEYS } from '@/config'
import { apiClient, QUERY_STRATEGIES } from '@/core/api'
import { useLanguage } from '@/core/lib'

export const searchQueries = {
  all: () => QUERY_KEYS.SEARCH.ALL,
  query: (q: string, lang: Language) => QUERY_KEYS.SEARCH.QUERY(q, lang),
} as const

const fetchSearchResults = async (
  query: string,
  lang: Language
): Promise<SearchResponse> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.SEARCH, {
    params: { q: query, lang },
  })
  const data: unknown = response.data

  if (!isValidSearchResponse(data)) {
    throw new SearchResponseError(
      SEARCH_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.SEARCH
    )
  }

  return data
}

export const useSearch = (
  query: string,
  lang?: Language
): UseQueryResult<SearchResponse, Error> => {
  const currentLang = useLanguage()
  const language = lang ?? currentLang

  return useQuery({
    queryKey: searchQueries.query(query, language),
    queryFn: () => fetchSearchResults(query, language),
    enabled: query.length >= 2,
    ...QUERY_STRATEGIES.standard,
  })
}
