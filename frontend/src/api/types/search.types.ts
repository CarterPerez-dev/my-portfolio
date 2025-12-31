// ===================
// © AngelaMos | 2025
// search.types.ts
// ===================

import { z } from 'zod'

export const SearchResultItemSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  url: z.string(),
  type: z.enum(['project', 'experience', 'certification']),
})

export const SearchResponseSchema = z.object({
  query: z.string(),
  total: z.number(),
  results: z.array(SearchResultItemSchema),
})

export type SearchResultItem = z.infer<typeof SearchResultItemSchema>
export type SearchResponse = z.infer<typeof SearchResponseSchema>

export const isValidSearchResponse = (data: unknown): data is SearchResponse =>
  SearchResponseSchema.safeParse(data).success

export const SEARCH_ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid search response from server',
} as const

export class SearchResponseError extends Error {
  readonly endpoint?: string

  constructor(message: string, endpoint?: string) {
    super(message)
    this.name = 'SearchResponseError'
    this.endpoint = endpoint
  }
}
