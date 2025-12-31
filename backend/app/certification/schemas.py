"""
ⒸAngelaMos | 2025
schemas.py
"""

from datetime import date

from config import (
    CertificationCategory,
    Language,
)
from core.base_schema import (
    BaseSchema,
    BaseResponseSchema,
)


class CertificationResponse(BaseResponseSchema):
    """
    Full certification response for certification listings.
    """
    language: Language
    name: str
    issuer: str
    issuer_url: str | None
    issuer_logo_url: str | None
    credential_id: str | None
    verification_url: str | None
    date_obtained: date
    expiry_date: date | None
    is_expired: bool
    badge_image_url: str | None
    category: CertificationCategory | None
    display_order: int
    is_visible: bool


class CertificationBriefResponse(BaseSchema):
    """
    Brief certification response for overview badges.
    """
    name: str
    issuer: str
    badge_image_url: str | None
    category: CertificationCategory | None
    is_expired: bool


class CertificationListResponse(BaseSchema):
    """
    Paginated certification list response.
    """
    items: list[CertificationResponse]
    total: int
    skip: int
    limit: int
