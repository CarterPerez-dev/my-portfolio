"""
ⒸAngelaMos | 2025
repository.py
"""

from collections.abc import Sequence

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

import config
from core.base_repository import BaseRepository
from .Certification import Certification


class CertificationRepository(BaseRepository[Certification]):
    """
    Repository for Certification model database operations.
    """
    model = Certification

    @classmethod
    async def get_visible_by_language(
        cls,
        session: AsyncSession,
        language: config.Language,
        skip: int = config.PAGINATION_DEFAULT_SKIP,
        limit: int = config.PAGINATION_DEFAULT_LIMIT,
    ) -> Sequence[Certification]:
        """
        Get all visible certifications for a language.
        Ordered by display_order for consistent listing.
        """
        result = await session.execute(
            select(Certification).where(
                Certification.language == language
            ).where(Certification.is_visible == True).order_by(
                Certification.display_order
            ).offset(skip).limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_active_by_language(
        cls,
        session: AsyncSession,
        language: config.Language,
    ) -> Sequence[Certification]:
        """
        Get non-expired certifications for a language.
        """
        result = await session.execute(
            select(Certification).where(
                Certification.language == language
            ).where(Certification.is_visible == True).where(
                Certification.is_expired == False
            ).order_by(Certification.display_order)
        )
        return result.scalars().all()

    @classmethod
    async def get_by_category_and_language(
        cls,
        session: AsyncSession,
        category: config.CertificationCategory,
        language: config.Language,
    ) -> Sequence[Certification]:
        """
        Get certifications by category and language.
        """
        result = await session.execute(
            select(Certification).where(
                Certification.language == language
            ).where(Certification.category == category).where(
                Certification.is_visible == True
            ).order_by(Certification.display_order)
        )
        return result.scalars().all()

    @classmethod
    async def count_visible_by_language(
        cls,
        session: AsyncSession,
        language: config.Language,
    ) -> int:
        """
        Count visible certifications for pagination.
        """
        result = await session.execute(
            select(func.count()).select_from(Certification).where(
                Certification.language == language
            ).where(Certification.is_visible == True)
        )
        return result.scalar_one()
