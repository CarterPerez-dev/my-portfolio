"""
ⒸAngelaMos | 2025
service.py
"""

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

import config
from config import Language
from core.exceptions import ProjectNotFound
from .repository import ProjectRepository
from .schemas import (
    ProjectBriefResponse,
    ProjectListResponse,
    ProjectNavResponse,
    ProjectResponse,
)


class ProjectService:
    """
    Business logic for project operations
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, project_id: UUID) -> ProjectResponse:
        """
        Get project by ID
        """
        project = await ProjectRepository.get_by_id(self.session, project_id)
        if not project:
            raise ProjectNotFound(str(project_id))
        return ProjectResponse.model_validate(project)

    async def get_by_slug(
        self,
        slug: str,
        language: Language,
    ) -> ProjectResponse:
        """
        Get project by slug and language
        Primary lookup for public project pages
        """
        project = await ProjectRepository.get_by_slug_and_language(
            self.session,
            slug,
            language,
        )
        if not project:
            raise ProjectNotFound(slug)
        return ProjectResponse.model_validate(project)

    async def list_visible(
        self,
        language: Language,
        skip: int = config.PAGINATION_DEFAULT_SKIP,
        limit: int = config.PAGINATION_DEFAULT_LIMIT,
    ) -> ProjectListResponse:
        """
        List visible projects for a language
        """
        projects = await ProjectRepository.get_visible_by_language(
            self.session,
            language,
            skip,
            limit,
        )
        total = await ProjectRepository.count_visible_by_language(
            self.session,
            language,
        )
        return ProjectListResponse(
            items = [ProjectResponse.model_validate(p) for p in projects],
            total = total,
            skip = skip,
            limit = limit,
        )

    async def list_featured(
        self,
        language: Language,
        limit: int = config.PAGINATION_FEATURED_LIMIT,
    ) -> list[ProjectResponse]:
        """
        List featured projects for a language
        Used for overview page highlights
        """
        projects = await ProjectRepository.get_featured_by_language(
            self.session,
            language,
            limit,
        )
        return [ProjectResponse.model_validate(p) for p in projects]

    async def get_nav_items(
        self,
        language: Language,
    ) -> ProjectNavResponse:
        """
        Get minimal project data for sidebar navigation
        """
        projects = await ProjectRepository.get_visible_by_language(
            self.session,
            language,
        )
        total = await ProjectRepository.count_visible_by_language(
            self.session,
            language,
        )
        return ProjectNavResponse(
            items = [ProjectBriefResponse.model_validate(p) for p in projects],
            total = total,
        )
