"""
ⒸAngelaMos | 2025
repository.py
"""

from collections.abc import Sequence

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

import config
from core.base_repository import BaseRepository
from .Blog import Blog


class BlogRepository(BaseRepository[Blog]):
    """
    Repository for Blog model database operations.
    """
    model = Blog

    @classmethod
    async def get_visible_by_language(
        cls,
        session: AsyncSession,
        language: config.Language,
        skip: int = config.PAGINATION_DEFAULT_SKIP,
        limit: int = config.PAGINATION_DEFAULT_LIMIT,
    ) -> Sequence[Blog]:
        """
        Get all visible blog posts for a language.
        Ordered by display_order for consistent listing.
        """
        result = await session.execute(
            select(Blog).where(Blog.language == language).where(
                Blog.is_visible == True
            ).order_by(Blog.display_order).offset(skip).limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_featured_by_language(
        cls,
        session: AsyncSession,
        language: config.Language,
        limit: int = config.PAGINATION_FEATURED_LIMIT,
    ) -> Sequence[Blog]:
        """
        Get featured blog posts for a language.
        Used for overview page highlights.
        """
        result = await session.execute(
            select(Blog).where(Blog.language == language).where(
                Blog.is_visible == True
            ).where(Blog.is_featured == True).order_by(Blog.display_order
                                                       ).limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_by_category_and_language(
        cls,
        session: AsyncSession,
        category: config.BlogCategory,
        language: config.Language,
    ) -> Sequence[Blog]:
        """
        Get blog posts by category and language.
        """
        result = await session.execute(
            select(Blog).where(Blog.language == language).where(
                Blog.category == category
            ).where(Blog.is_visible == True).order_by(Blog.display_order)
        )
        return result.scalars().all()

    @classmethod
    async def count_visible_by_language(
        cls,
        session: AsyncSession,
        language: config.Language,
    ) -> int:
        """
        Count visible blog posts for pagination.
        """
        result = await session.execute(
            select(func.count()).select_from(Blog).where(
                Blog.language == language
            ).where(Blog.is_visible == True)
        )
        return result.scalar_one()
