"""
ⒸAngelaMos | 2025
routes.py
"""

from uuid import UUID

from fastapi import APIRouter, Query

import config
from config import BlogCategory
from core.dependencies import QueryLanguage
from core.responses import NOT_FOUND_404
from .dependencies import BlogServiceDep
from .schemas import (
    BlogBriefResponse,
    BlogListResponse,
    BlogResponse,
)


router = APIRouter(prefix = "/blogs", tags = ["blogs"])


@router.get(
    "",
    response_model = BlogListResponse,
)
async def list_blogs(
    service: BlogServiceDep,
    lang: QueryLanguage,
    skip: int = Query(default = config.PAGINATION_DEFAULT_SKIP,
                      ge = 0),
    limit: int = Query(
        default = config.PAGINATION_DEFAULT_LIMIT,
        ge = 1,
        le = config.PAGINATION_MAX_LIMIT
    ),
) -> BlogListResponse:
    """
    List all visible blog posts for the specified language.
    """
    return await service.list_visible(lang, skip, limit)


@router.get(
    "/featured",
    response_model = list[BlogResponse],
)
async def list_featured_blogs(
    service: BlogServiceDep,
    lang: QueryLanguage,
    limit: int = Query(
        default = config.PAGINATION_FEATURED_LIMIT,
        ge = 1,
        le = config.PAGINATION_FEATURED_MAX_LIMIT
    ),
) -> list[BlogResponse]:
    """
    List featured blog posts for the overview page.
    """
    return await service.list_featured(lang, limit)


@router.get(
    "/nav",
    response_model = list[BlogBriefResponse],
)
async def get_blog_nav(
    service: BlogServiceDep,
    lang: QueryLanguage,
) -> list[BlogBriefResponse]:
    """
    Get brief blog data for sidebar navigation.
    """
    return await service.get_nav_items(lang)


@router.get(
    "/category/{category}",
    response_model = list[BlogResponse],
)
async def list_blogs_by_category(
    service: BlogServiceDep,
    category: BlogCategory,
    lang: QueryLanguage,
) -> list[BlogResponse]:
    """
    List blog posts by category.
    """
    return await service.list_by_category(category, lang)


@router.get(
    "/{blog_id}",
    response_model = BlogResponse,
    responses = {**NOT_FOUND_404},
)
async def get_blog(
    service: BlogServiceDep,
    blog_id: UUID,
) -> BlogResponse:
    """
    Get a single blog post by ID.
    """
    return await service.get_by_id(blog_id)
