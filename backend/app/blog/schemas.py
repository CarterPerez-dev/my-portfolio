"""
ⒸAngelaMos | 2025
schemas.py
"""

from datetime import date

from config import (
    BlogCategory,
    Language,
)
from core.base_schema import (
    BaseSchema,
    BaseResponseSchema,
)


class BlogResponse(BaseResponseSchema):
    """
    Full blog response for blog listings.
    """
    language: Language
    title: str
    description: str
    external_url: str
    category: BlogCategory | None
    tags: list[str] | None
    thumbnail_url: str | None
    published_date: date | None
    read_time_minutes: int | None
    views_count: int | None
    display_order: int
    is_visible: bool
    is_featured: bool


class BlogBriefResponse(BaseSchema):
    """
    Brief blog response for sidebar navigation.
    """
    title: str
    external_url: str
    category: BlogCategory | None
    is_featured: bool


class BlogListResponse(BaseSchema):
    """
    Paginated blog list response.
    """
    items: list[BlogResponse]
    total: int
    skip: int
    limit: int
