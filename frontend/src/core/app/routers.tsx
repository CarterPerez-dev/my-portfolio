// ===================
// © AngelaMos | 2025
// routers.tsx
// ===================

import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { ROUTES } from '@/config'
import {
  Certifications,
  Experience,
  Overview,
  ProjectDetail,
  SearchResults,
} from '@/pages/docs'
import { ProtectedRoute } from './protected-route'

const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: <Overview />,
  },
  {
    path: `${ROUTES.PROJECTS.INDEX}/:slug`,
    element: <ProjectDetail />,
  },
  {
    path: ROUTES.BACKGROUND.EXPERIENCE,
    element: <Experience />,
  },
  {
    path: ROUTES.BACKGROUND.CERTIFICATIONS,
    element: <Certifications />,
  },
  {
    path: ROUTES.SEARCH,
    element: <SearchResults />,
  },
  {
    path: ROUTES.LOGIN,
    lazy: () => import('@/pages/login'),
  },
  {
    path: ROUTES.REGISTER,
    lazy: () => import('@/pages/register'),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        lazy: () => import('@/pages/dashboard'),
      },
    ],
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: <Overview />,
  },
  {
    path: '*',
    element: <Overview />,
  },
]

export const router = createBrowserRouter(routes)
