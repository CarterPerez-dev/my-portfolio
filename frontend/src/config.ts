// ===================
// © AngelaMos | 2025
// config.ts
// ===================
const API_VERSION = 'v1'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/${API_VERSION}/auth/login`,
    REFRESH: `/${API_VERSION}/auth/refresh`,
    LOGOUT: `/${API_VERSION}/auth/logout`,
    LOGOUT_ALL: `/${API_VERSION}/auth/logout-all`,
    ME: `/${API_VERSION}/auth/me`,
    CHANGE_PASSWORD: `/${API_VERSION}/auth/change-password`,
  },
  USERS: {
    BASE: `/${API_VERSION}/users`,
    BY_ID: (id: string) => `/${API_VERSION}/users/${id}`,
    ME: `/${API_VERSION}/users/me`,
    REGISTER: `/${API_VERSION}/users`,
  },
  ADMIN: {
    USERS: {
      LIST: `/${API_VERSION}/admin/users`,
      CREATE: `/${API_VERSION}/admin/users`,
      BY_ID: (id: string) => `/${API_VERSION}/admin/users/${id}`,
      UPDATE: (id: string) => `/${API_VERSION}/admin/users/${id}`,
      DELETE: (id: string) => `/${API_VERSION}/admin/users/${id}`,
    },
  },
  PROJECTS: {
    LIST: `/${API_VERSION}/projects`,
    FEATURED: `/${API_VERSION}/projects/featured`,
    NAV: `/${API_VERSION}/projects/nav`,
    BY_SLUG: (slug: string) => `/${API_VERSION}/projects/${slug}`,
  },
  EXPERIENCES: {
    LIST: `/${API_VERSION}/experiences`,
    CURRENT: `/${API_VERSION}/experiences/current`,
    TIMELINE: `/${API_VERSION}/experiences/timeline`,
    BY_ID: (id: string) => `/${API_VERSION}/experiences/${id}`,
  },
  CERTIFICATIONS: {
    LIST: `/${API_VERSION}/certifications`,
    ACTIVE: `/${API_VERSION}/certifications/active`,
    BADGES: `/${API_VERSION}/certifications/badges`,
    BY_CATEGORY: (category: string) =>
      `/${API_VERSION}/certifications/category/${category}`,
    BY_ID: (id: string) => `/${API_VERSION}/certifications/${id}`,
  },
  BLOGS: {
    LIST: `/${API_VERSION}/blogs`,
    FEATURED: `/${API_VERSION}/blogs/featured`,
    NAV: `/${API_VERSION}/blogs/nav`,
    BY_CATEGORY: (category: string) =>
      `/${API_VERSION}/blogs/category/${category}`,
    BY_ID: (id: string) => `/${API_VERSION}/blogs/${id}`,
  },
  SEARCH: `/${API_VERSION}/search`,
} as const

export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'] as const,
    ME: () => [...QUERY_KEYS.AUTH.ALL, 'me'] as const,
  },
  USERS: {
    ALL: ['users'] as const,
    BY_ID: (id: string) => [...QUERY_KEYS.USERS.ALL, 'detail', id] as const,
    ME: () => [...QUERY_KEYS.USERS.ALL, 'me'] as const,
  },
  ADMIN: {
    ALL: ['admin'] as const,
    USERS: {
      ALL: () => [...QUERY_KEYS.ADMIN.ALL, 'users'] as const,
      LIST: (page: number, size: number) =>
        [...QUERY_KEYS.ADMIN.USERS.ALL(), 'list', { page, size }] as const,
      BY_ID: (id: string) =>
        [...QUERY_KEYS.ADMIN.USERS.ALL(), 'detail', id] as const,
    },
  },
  PROJECTS: {
    ALL: ['projects'] as const,
    LIST: (lang: string) => [...QUERY_KEYS.PROJECTS.ALL, 'list', lang] as const,
    FEATURED: (lang: string) =>
      [...QUERY_KEYS.PROJECTS.ALL, 'featured', lang] as const,
    NAV: (lang: string) => [...QUERY_KEYS.PROJECTS.ALL, 'nav', lang] as const,
    BY_SLUG: (slug: string, lang: string) =>
      [...QUERY_KEYS.PROJECTS.ALL, 'detail', slug, lang] as const,
  },
  EXPERIENCES: {
    ALL: ['experiences'] as const,
    LIST: (lang: string) =>
      [...QUERY_KEYS.EXPERIENCES.ALL, 'list', lang] as const,
    CURRENT: (lang: string) =>
      [...QUERY_KEYS.EXPERIENCES.ALL, 'current', lang] as const,
    TIMELINE: (lang: string) =>
      [...QUERY_KEYS.EXPERIENCES.ALL, 'timeline', lang] as const,
    BY_ID: (id: string, lang: string) =>
      [...QUERY_KEYS.EXPERIENCES.ALL, 'detail', id, lang] as const,
  },
  CERTIFICATIONS: {
    ALL: ['certifications'] as const,
    LIST: (lang: string) =>
      [...QUERY_KEYS.CERTIFICATIONS.ALL, 'list', lang] as const,
    ACTIVE: (lang: string) =>
      [...QUERY_KEYS.CERTIFICATIONS.ALL, 'active', lang] as const,
    BADGES: (lang: string) =>
      [...QUERY_KEYS.CERTIFICATIONS.ALL, 'badges', lang] as const,
    BY_CATEGORY: (category: string, lang: string) =>
      [...QUERY_KEYS.CERTIFICATIONS.ALL, 'category', category, lang] as const,
    BY_ID: (id: string, lang: string) =>
      [...QUERY_KEYS.CERTIFICATIONS.ALL, 'detail', id, lang] as const,
  },
  BLOGS: {
    ALL: ['blogs'] as const,
    LIST: (lang: string) => [...QUERY_KEYS.BLOGS.ALL, 'list', lang] as const,
    FEATURED: (lang: string) =>
      [...QUERY_KEYS.BLOGS.ALL, 'featured', lang] as const,
    NAV: (lang: string) => [...QUERY_KEYS.BLOGS.ALL, 'nav', lang] as const,
    BY_CATEGORY: (category: string, lang: string) =>
      [...QUERY_KEYS.BLOGS.ALL, 'category', category, lang] as const,
    BY_ID: (id: string, lang: string) =>
      [...QUERY_KEYS.BLOGS.ALL, 'detail', id, lang] as const,
  },
  SEARCH: {
    ALL: ['search'] as const,
    QUERY: (q: string, lang: string) =>
      [...QUERY_KEYS.SEARCH.ALL, q, lang] as const,
  },
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  UNAUTHORIZED: '/unauthorized',
  OVERVIEW: '/overview',
  QUICK_START: '/quick-start',
  PROJECTS: {
    INDEX: '/projects',
    DETAIL: (slug: string) => `/projects/${slug}`,
  },
  BACKGROUND: {
    EXPERIENCE: '/background/experience',
    CERTIFICATIONS: '/background/certifications',
  },
  SEARCH: '/search',
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    USER_DETAIL: (id: string) => `/admin/users/${id}`,
  },
} as const

export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  UI: 'ui-storage',
  LANGUAGE: 'language-storage',
} as const

export const QUERY_CONFIG = {
  STALE_TIME: {
    USER: 1000 * 60 * 5,
    STATIC: Infinity,
    FREQUENT: 1000 * 30,
    PORTFOLIO: 1000 * 60 * 60 * 24,
  },
  GC_TIME: {
    DEFAULT: 1000 * 60 * 30,
    LONG: 1000 * 60 * 60,
    PORTFOLIO: 1000 * 60 * 60 * 24,
  },
  RETRY: {
    DEFAULT: 3,
    NONE: 0,
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER: 500,
} as const

export const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 20,
  MAX_SIZE: 100,
} as const

export type ApiEndpoint = typeof API_ENDPOINTS
export type QueryKey = typeof QUERY_KEYS
export type Route = typeof ROUTES
