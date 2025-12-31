"""
ⒸAngelaMos | 2025
service.py
"""

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

import config
from config import Language
from core.exceptions import ExperienceNotFound
from .repository import ExperienceRepository
from .schemas import (
    ExperienceBriefResponse,
    ExperienceListResponse,
    ExperienceResponse,
)


class ExperienceService:
    """
    Business logic for experience operations.
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, experience_id: UUID) -> ExperienceResponse:
        """
        Get experience by ID.
        """
        experience = await ExperienceRepository.get_by_id(
            self.session,
            experience_id,
        )
        if not experience:
            raise ExperienceNotFound(str(experience_id))
        return ExperienceResponse.model_validate(experience)

    async def list_visible(
        self,
        language: Language,
        skip: int = config.PAGINATION_DEFAULT_SKIP,
        limit: int = config.PAGINATION_DEFAULT_LIMIT,
    ) -> ExperienceListResponse:
        """
        List visible experiences for a language.
        """
        experiences = await ExperienceRepository.get_visible_by_language(
            self.session,
            language,
            skip,
            limit,
        )
        total = await ExperienceRepository.count_visible_by_language(
            self.session,
            language,
        )
        return ExperienceListResponse(
            items = [ExperienceResponse.model_validate(e) for e in experiences],
            total = total,
            skip = skip,
            limit = limit,
        )

    async def list_current(
        self,
        language: Language,
    ) -> list[ExperienceResponse]:
        """
        List current (ongoing) positions for a language.
        """
        experiences = await ExperienceRepository.get_current_by_language(
            self.session,
            language,
        )
        return [ExperienceResponse.model_validate(e) for e in experiences]

    async def get_timeline(
        self,
        language: Language,
    ) -> list[ExperienceBriefResponse]:
        """
        Get brief experience data for timeline display.
        """
        experiences = await ExperienceRepository.get_visible_by_language(
            self.session,
            language,
        )
        return [ExperienceBriefResponse.model_validate(e) for e in experiences]
