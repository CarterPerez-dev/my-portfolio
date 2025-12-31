"""
ⒸAngelaMos | 2025
repository.py
"""

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from config import Language
from .schemas import SearchResultItem


class SearchRepository:
    """
    Repository for full-text search across portfolio content
    """
    @classmethod
    async def search_all(
        cls,
        session: AsyncSession,
        query: str,
        language: Language,
        limit: int = 20,
    ) -> list[SearchResultItem]:
        """
        Full-text search across projects, experiences, and certifications.
        Returns results with highlighted excerpts.
        """
        search_query = text(
            """
            WITH search_results AS (
                SELECT
                    title,
                    ts_headline(
                        'english',
                        COALESCE(description, '') || ' ' || COALESCE(technical_details, ''),
                        plainto_tsquery('english', :query),
                        'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15, MaxFragments=2'
                    ) AS excerpt,
                    '/projects/' || slug AS url,
                    'project' AS type,
                    ts_rank(
                        to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(technical_details, '')),
                        plainto_tsquery('english', :query)
                    ) AS rank
                FROM projects
                WHERE language = :language
                AND to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(technical_details, ''))
                    @@ plainto_tsquery('english', :query)

                UNION ALL

                SELECT
                    company || ' - ' || role AS title,
                    ts_headline(
                        'english',
                        description,
                        plainto_tsquery('english', :query),
                        'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15, MaxFragments=2'
                    ) AS excerpt,
                    '/background/experience' AS url,
                    'experience' AS type,
                    ts_rank(
                        to_tsvector('english', company || ' ' || role || ' ' || description),
                        plainto_tsquery('english', :query)
                    ) AS rank
                FROM experiences
                WHERE language = :language
                AND is_visible = true
                AND to_tsvector('english', company || ' ' || role || ' ' || description)
                    @@ plainto_tsquery('english', :query)

                UNION ALL

                SELECT
                    name AS title,
                    ts_headline(
                        'english',
                        name || ' - ' || issuer,
                        plainto_tsquery('english', :query),
                        'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15, MaxFragments=2'
                    ) AS excerpt,
                    '/background/certifications' AS url,
                    'certification' AS type,
                    ts_rank(
                        to_tsvector('english', name || ' ' || issuer),
                        plainto_tsquery('english', :query)
                    ) AS rank
                FROM certifications
                WHERE language = :language
                AND is_visible = true
                AND to_tsvector('english', name || ' ' || issuer)
                    @@ plainto_tsquery('english', :query)
            )
            SELECT title, excerpt, url, type
            FROM search_results
            ORDER BY rank DESC
            LIMIT :limit
        """
        )

        result = await session.execute(
            search_query,
            {
                "query": query,
                "language": language.value,
                "limit": limit,
            }
        )

        rows = result.fetchall()
        return [
            SearchResultItem(
                title = row.title,
                excerpt = row.excerpt,
                url = row.url,
                type = row.type,
            ) for row in rows
        ]
