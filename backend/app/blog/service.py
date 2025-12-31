"""
ⒸAngelaMos | 2025
service.py
"""

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

import config
from config import (
    BlogCategory,
    Language,
)
from core.exceptions import BlogNotFound
from .repository import BlogRepository
from .schemas import (
    BlogBriefResponse,
    BlogListResponse,
    BlogResponse,
)


class BlogService:
    """
    Business logic for blog operations.
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, blog_id: UUID) -> BlogResponse:
        """
        Get blog post by ID.
        """
        blog = await BlogRepository.get_by_id(self.session, blog_id)
        if not blog:
            raise BlogNotFound(str(blog_id))
        return BlogResponse.model_validate(blog)

    async def list_visible(
        self,
        language: Language,
        skip: int = config.PAGINATION_DEFAULT_SKIP,
        limit: int = config.PAGINATION_DEFAULT_LIMIT,
    ) -> BlogListResponse:
        """
        List visible blog posts for a language.
        """
        blogs = await BlogRepository.get_visible_by_language(
            self.session,
            language,
            skip,
            limit,
        )
        total = await BlogRepository.count_visible_by_language(
            self.session,
            language,
        )
        return BlogListResponse(
            items = [BlogResponse.model_validate(b) for b in blogs],
            total = total,
            skip = skip,
            limit = limit,
        )

    async def list_featured(
        self,
        language: Language,
        limit: int = config.PAGINATION_FEATURED_LIMIT,
    ) -> list[BlogResponse]:
        """
        List featured blog posts for a language.
        Used for overview page highlights.
        """
        blogs = await BlogRepository.get_featured_by_language(
            self.session,
            language,
            limit,
        )
        return [BlogResponse.model_validate(b) for b in blogs]

    async def list_by_category(
        self,
        category: BlogCategory,
        language: Language,
    ) -> list[BlogResponse]:
        """
        List blog posts by category and language.
        """
        blogs = await BlogRepository.get_by_category_and_language(
            self.session,
            category,
            language,
        )
        return [BlogResponse.model_validate(b) for b in blogs]

    async def get_nav_items(
        self,
        language: Language,
    ) -> list[BlogBriefResponse]:
        """
        Get brief blog data for sidebar navigation.
        """
        blogs = await BlogRepository.get_visible_by_language(
            self.session,
            language,
        )
        return [BlogBriefResponse.model_validate(b) for b in blogs]
