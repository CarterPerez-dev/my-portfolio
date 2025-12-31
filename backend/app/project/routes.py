"""
ⒸAngelaMos | 2025
routes.py
"""

from fastapi import APIRouter, Query

import config
from core.dependencies import QueryLanguage
from core.responses import NOT_FOUND_404
from .dependencies import ProjectServiceDep
from .schemas import (
    ProjectListResponse,
    ProjectNavResponse,
    ProjectResponse,
)


router = APIRouter(prefix = "/projects", tags = ["projects"])


@router.get(
    "",
    response_model = ProjectListResponse,
)
async def list_projects(
    service: ProjectServiceDep,
    lang: QueryLanguage,
    skip: int = Query(default = config.PAGINATION_DEFAULT_SKIP,
                      ge = 0),
    limit: int = Query(
        default = config.PAGINATION_DEFAULT_LIMIT,
        ge = 1,
        le = config.PAGINATION_MAX_LIMIT
    ),
) -> ProjectListResponse:
    """
    List all visible projects for the specified language.
    """
    return await service.list_visible(lang, skip, limit)


@router.get(
    "/featured",
    response_model = list[ProjectResponse],
)
async def list_featured_projects(
    service: ProjectServiceDep,
    lang: QueryLanguage,
    limit: int = Query(
        default = config.PAGINATION_FEATURED_LIMIT,
        ge = 1,
        le = config.PAGINATION_FEATURED_MAX_LIMIT
    ),
) -> list[ProjectResponse]:
    """
    List featured projects for the overview page.
    """
    return await service.list_featured(lang, limit)


@router.get(
    "/nav",
    response_model = ProjectNavResponse,
)
async def get_project_nav(
    service: ProjectServiceDep,
    lang: QueryLanguage,
) -> ProjectNavResponse:
    """
    Get minimal project data for sidebar navigation.
    """
    return await service.get_nav_items(lang)


@router.get(
    "/{slug}",
    response_model = ProjectResponse,
    responses = {**NOT_FOUND_404},
)
async def get_project(
    service: ProjectServiceDep,
    slug: str,
    lang: QueryLanguage,
) -> ProjectResponse:
    """
    Get a single project by slug and language.
    """
    return await service.get_by_slug(slug, lang)
