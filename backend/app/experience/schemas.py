"""
ⒸAngelaMos | 2025
schemas.py
"""

from datetime import date

from config import (
    EmploymentType,
    Language,
)
from core.base_schema import (
    BaseSchema,
    BaseResponseSchema,
)


class ExperienceResponse(BaseResponseSchema):
    """
    Full experience response for experience detail/timeline
    """
    language: Language
    company: str
    company_url: str | None
    company_logo_url: str | None
    location: str | None
    role: str
    department: str | None
    employment_type: EmploymentType | None
    start_date: date
    end_date: date | None
    is_current: bool
    description: str
    responsibilities: list[str] | None
    achievements: list[str] | None
    tech_stack: list[str] | None
    display_order: int
    is_visible: bool


class ExperienceBriefResponse(BaseSchema):
    """
    Brief experience response for timeline overview
    """
    company: str
    role: str
    start_date: date
    end_date: date | None
    is_current: bool


class ExperienceListResponse(BaseSchema):
    """
    Paginated experience list response
    """
    items: list[ExperienceResponse]
    total: int
    skip: int
    limit: int
