"""
ⒸAngelaMos | 2025
repository.py
"""

from collections.abc import Sequence

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

import config
from config import Language
from core.base_repository import BaseRepository

from .Project import Project


class ProjectRepository(BaseRepository[Project]):
    """
    Repository for Project model database operations
    """
    model = Project

    @classmethod
    async def get_by_slug_and_language(
        cls,
        session: AsyncSession,
        slug: str,
        language: Language,
    ) -> Project | None:
        """
        Get a single project by slug and language
        Primary lookup for public project pages
        """
        result = await session.execute(
            select(Project).where(Project.slug == slug
                                  ).where(Project.language == language)
        )
        return result.scalars().first()

    @classmethod
    async def get_visible_by_language(
        cls,
        session: AsyncSession,
        language: Language,
        skip: int = config.PAGINATION_DEFAULT_SKIP,
        limit: int = config.PAGINATION_DEFAULT_LIMIT,
    ) -> Sequence[Project]:
        """
        Get all visible (complete) projects for a language
        Ordered by display_order for consistent nav/listing
        """
        result = await session.execute(
            select(Project).where(Project.language == language).order_by(
                Project.display_order
            ).offset(skip).limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_featured_by_language(
        cls,
        session: AsyncSession,
        language: Language,
        limit: int = config.PAGINATION_FEATURED_LIMIT,
    ) -> Sequence[Project]:
        """
        Get featured projects for a language.
        Used for overview page highlights.
        """
        result = await session.execute(
            select(Project).where(Project.language == language).where(
                Project.is_complete == True
            ).where(Project.is_featured == True).order_by(
                Project.display_order
            ).limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def count_visible_by_language(
        cls,
        session: AsyncSession,
        language: Language,
    ) -> int:
        """
        Count visible projects for pagination
        """
        result = await session.execute(
            select(func.count()
                   ).select_from(Project).where(Project.language == language)
        )
        return result.scalar_one()

    @classmethod
    async def get_all_slugs(
        cls,
        session: AsyncSession,
    ) -> Sequence[str]:
        """
        Get all unique project slugs.
        Useful for generating nav or validating slugs
        """
        result = await session.execute(select(Project.slug).distinct())
        return result.scalars().all()

    @classmethod
    async def slug_exists(
        cls,
        session: AsyncSession,
        slug: str,
    ) -> bool:
        """
        Check if a project slug exists
        """
        result = await session.execute(
            select(Project.id).where(Project.slug == slug).limit(1)
        )
        return result.scalars().first() is not None
