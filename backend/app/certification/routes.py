"""
ⒸAngelaMos | 2025
routes.py
"""

from uuid import UUID

from fastapi import APIRouter, Query

import config
from config import CertificationCategory
from core.dependencies import QueryLanguage
from core.responses import NOT_FOUND_404
from .dependencies import CertificationServiceDep
from .schemas import (
    CertificationBriefResponse,
    CertificationListResponse,
    CertificationResponse,
)


router = APIRouter(prefix = "/certifications", tags = ["certifications"])


@router.get(
    "",
    response_model = CertificationListResponse,
)
async def list_certifications(
    service: CertificationServiceDep,
    lang: QueryLanguage,
    skip: int = Query(default = config.PAGINATION_DEFAULT_SKIP,
                      ge = 0),
    limit: int = Query(
        default = config.PAGINATION_DEFAULT_LIMIT,
        ge = 1,
        le = config.PAGINATION_MAX_LIMIT
    ),
) -> CertificationListResponse:
    """
    List all visible certifications for the specified language.
    """
    return await service.list_visible(lang, skip, limit)


@router.get(
    "/active",
    response_model = list[CertificationResponse],
)
async def list_active_certifications(
    service: CertificationServiceDep,
    lang: QueryLanguage,
) -> list[CertificationResponse]:
    """
    List non-expired certifications.
    """
    return await service.list_active(lang)


@router.get(
    "/badges",
    response_model = list[CertificationBriefResponse],
)
async def get_certification_badges(
    service: CertificationServiceDep,
    lang: QueryLanguage,
) -> list[CertificationBriefResponse]:
    """
    Get brief certification data for overview badges.
    """
    return await service.get_badges(lang)


@router.get(
    "/category/{category}",
    response_model = list[CertificationResponse],
)
async def list_certifications_by_category(
    service: CertificationServiceDep,
    category: CertificationCategory,
    lang: QueryLanguage,
) -> list[CertificationResponse]:
    """
    List certifications by category.
    """
    return await service.list_by_category(category, lang)


@router.get(
    "/{certification_id}",
    response_model = CertificationResponse,
    responses = {**NOT_FOUND_404},
)
async def get_certification(
    service: CertificationServiceDep,
    certification_id: UUID,
) -> CertificationResponse:
    """
    Get a single certification by ID.
    """
    return await service.get_by_id(certification_id)
