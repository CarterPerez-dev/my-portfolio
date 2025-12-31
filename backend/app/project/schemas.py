"""
ⒸAngelaMos | 2025
schemas.py
"""

from datetime import date

from config import (
    Language,
    ProjectStatus,
)
from core.base_schema import (
    BaseSchema,
    BaseResponseSchema,
)


class ProjectResponse(BaseResponseSchema):
    """
    Full project response for project detail pages
    """
    slug: str
    language: Language
    title: str
    subtitle: str | None
    description: str
    technical_details: str | None
    tech_stack: list[str]
    github_url: str | None
    demo_url: str | None
    website_url: str | None
    docs_url: str | None
    blog_url: str | None
    pypi_url: str | None
    npm_url: str | None
    ios_url: str | None
    android_url: str | None
    code_snippet: str | None
    code_language: str | None
    code_filename: str | None
    thumbnail_url: str | None
    banner_url: str | None
    screenshots: list[str] | None
    stars_count: int | None
    forks_count: int | None
    downloads_count: int | None
    users_count: int | None
    display_order: int
    is_complete: bool
    is_featured: bool
    status: ProjectStatus | None
    start_date: date | None
    end_date: date | None


class ProjectBriefResponse(BaseSchema):
    """
    Brief project response for navigation/sidebar listings
    """
    slug: str
    title: str
    subtitle: str | None
    status: ProjectStatus | None
    is_featured: bool


class ProjectListResponse(BaseSchema):
    """
    Paginated project list response
    """
    items: list[ProjectResponse]
    total: int
    skip: int
    limit: int


class ProjectNavResponse(BaseSchema):
    """
    Minimal project data for sidebar navigation
    """
    items: list[ProjectBriefResponse]
    total: int
