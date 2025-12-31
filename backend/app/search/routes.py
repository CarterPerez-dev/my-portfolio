"""
ⒸAngelaMos | 2025
routes.py
"""

from fastapi import APIRouter, Query

from core.dependencies import QueryLanguage
from .dependencies import SearchServiceDep
from .schemas import SearchResponse


router = APIRouter(prefix = "/search", tags = ["search"])


@router.get(
    "",
    response_model = SearchResponse,
)
async def search(
    service: SearchServiceDep,
    q: str = Query(min_length = 2,
                   max_length = 100),
    lang: QueryLanguage | None = None,
    limit: int = Query(default = 20,
                       ge = 1,
                       le = 50),
) -> SearchResponse:
    """
    Full-text search across all portfolio content.
    Searches projects, experiences, and certifications.
    Returns highlighted excerpts.
    """
    return await service.search(q, lang, limit)
