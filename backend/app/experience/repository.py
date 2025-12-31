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
from .Experience import Experience


class ExperienceRepository(BaseRepository[Experience]):
    """
    Repository for Experience model database operations.
    """
    model = Experience

    @classmethod
    async def get_visible_by_language(
        cls,
        session: AsyncSession,
        language: Language,
        skip: int = config.PAGINATION_DEFAULT_SKIP,
        limit: int = config.PAGINATION_DEFAULT_LIMIT,
    ) -> Sequence[Experience]:
        """
        Get all visible experiences for a language.
        Ordered by display_order for consistent timeline.
        """
        result = await session.execute(
            select(Experience).where(Experience.language == language).where(
                Experience.is_visible == True
            ).order_by(Experience.display_order).offset(skip).limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_current_by_language(
        cls,
        session: AsyncSession,
        language: Language,
    ) -> Sequence[Experience]:
        """
        Get current (ongoing) positions for a language.
        """
        result = await session.execute(
            select(Experience).where(Experience.language == language).where(
                Experience.is_visible == True
            ).where(Experience.is_current == True).order_by(
                Experience.display_order
            )
        )
        return result.scalars().all()

    @classmethod
    async def count_visible_by_language(
        cls,
        session: AsyncSession,
        language: Language,
    ) -> int:
        """
        Count visible experiences for pagination.
        """
        result = await session.execute(
            select(func.count()).select_from(Experience).where(
                Experience.language == language
            ).where(Experience.is_visible == True)
        )
        return result.scalar_one()
