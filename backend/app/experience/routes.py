"""
ⒸAngelaMos | 2025
routes.py
"""

from uuid import UUID

from fastapi import APIRouter, Query

import config
from core.dependencies import QueryLanguage
from core.responses import NOT_FOUND_404
from .dependencies import ExperienceServiceDep
from .schemas import (
    ExperienceBriefResponse,
    ExperienceListResponse,
    ExperienceResponse,
)


router = APIRouter(prefix = "/experiences", tags = ["experiences"])


@router.get(
    "",
    response_model = ExperienceListResponse,
)
async def list_experiences(
    service: ExperienceServiceDep,
    lang: QueryLanguage,
    skip: int = Query(default = config.PAGINATION_DEFAULT_SKIP,
                      ge = 0),
    limit: int = Query(
        default = config.PAGINATION_DEFAULT_LIMIT,
        ge = 1,
        le = config.PAGINATION_MAX_LIMIT
    ),
) -> ExperienceListResponse:
    """
    List all visible experiences for the specified language.
    """
    return await service.list_visible(lang, skip, limit)


@router.get(
    "/current",
    response_model = list[ExperienceResponse],
)
async def list_current_experiences(
    service: ExperienceServiceDep,
    lang: QueryLanguage,
) -> list[ExperienceResponse]:
    """
    List current (ongoing) positions.
    """
    return await service.list_current(lang)


@router.get(
    "/timeline",
    response_model = list[ExperienceBriefResponse],
)
async def get_experience_timeline(
    service: ExperienceServiceDep,
    lang: QueryLanguage,
) -> list[ExperienceBriefResponse]:
    """
    Get brief experience data for timeline display.
    """
    return await service.get_timeline(lang)


@router.get(
    "/{experience_id}",
    response_model = ExperienceResponse,
    responses = {**NOT_FOUND_404},
)
async def get_experience(
    service: ExperienceServiceDep,
    experience_id: UUID,
) -> ExperienceResponse:
    """
    Get a single experience by ID.
    """
    return await service.get_by_id(experience_id)
