"""
ⒸAngelaMos | 2025
service.py
"""

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

import config
from config import (
    CertificationCategory,
    Language,
)
from core.exceptions import CertificationNotFound
from .repository import CertificationRepository
from .schemas import (
    CertificationBriefResponse,
    CertificationListResponse,
    CertificationResponse,
)


class CertificationService:
    """
    Business logic for certification operations.
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(
        self,
        certification_id: UUID,
    ) -> CertificationResponse:
        """
        Get certification by ID.
        """
        certification = await CertificationRepository.get_by_id(
            self.session,
            certification_id,
        )
        if not certification:
            raise CertificationNotFound(str(certification_id))
        return CertificationResponse.model_validate(certification)

    async def list_visible(
        self,
        language: Language,
        skip: int = config.PAGINATION_DEFAULT_SKIP,
        limit: int = config.PAGINATION_DEFAULT_LIMIT,
    ) -> CertificationListResponse:
        """
        List visible certifications for a language.
        """
        certifications = await CertificationRepository.get_visible_by_language(
            self.session,
            language,
            skip,
            limit,
        )
        total = await CertificationRepository.count_visible_by_language(
            self.session,
            language,
        )
        return CertificationListResponse(
            items = [
                CertificationResponse.model_validate(c) for c in certifications
            ],
            total = total,
            skip = skip,
            limit = limit,
        )

    async def list_active(
        self,
        language: Language,
    ) -> list[CertificationResponse]:
        """
        List non-expired certifications for a language.
        """
        certifications = await CertificationRepository.get_active_by_language(
            self.session,
            language,
        )
        return [CertificationResponse.model_validate(c) for c in certifications]

    async def list_by_category(
        self,
        category: CertificationCategory,
        language: Language,
    ) -> list[CertificationResponse]:
        """
        List certifications by category and language.
        """
        certifications = await CertificationRepository.get_by_category_and_language(
            self.session,
            category,
            language,
        )
        return [CertificationResponse.model_validate(c) for c in certifications]

    async def get_badges(
        self,
        language: Language,
    ) -> list[CertificationBriefResponse]:
        """
        Get brief certification data for overview badges.
        """
        certifications = await CertificationRepository.get_active_by_language(
            self.session,
            language,
        )
        return [
            CertificationBriefResponse.model_validate(c) for c in certifications
        ]
