"""
ⒸAngelaMos | 2025
service.py
"""

from sqlalchemy.ext.asyncio import AsyncSession

from config import Language
from .repository import SearchRepository
from .schemas import SearchResponse


class SearchService:
    """
    Business logic for search operations
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def search(
        self,
        query: str,
        language: Language | None,
        limit: int = 20,
    ) -> SearchResponse:
        """
        Search across all portfolio content
        """
        results = await SearchRepository.search_all(
            self.session,
            query,
            language or Language.ENGLISH,
            limit,
        )

        return SearchResponse(
            query = query,
            total = len(results),
            results = results,
        )
