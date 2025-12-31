"""
ⒸAngelaMos | 2025
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import SearchService


async def get_search_service(session: DBSession) -> SearchService:
    """
    Dependency to get search service with database session
    """
    return SearchService(session)


SearchServiceDep = Annotated[SearchService, Depends(get_search_service)]
