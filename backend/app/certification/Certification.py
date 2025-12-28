"""
ⒸAngelaMos | 2025
Certification.py
"""

from datetime import date

from sqlalchemy import (
    Date,
    String,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from config import (
    CERTIFICATION_CREDENTIAL_ID_MAX_LENGTH,
    CERTIFICATION_ISSUER_MAX_LENGTH,
    CERTIFICATION_NAME_MAX_LENGTH,
    DEFAULT_DISPLAY_ORDER,
    URL_MAX_LENGTH,
    CertificationCategory,
    Language,
    SafeEnum,
)
from core.Base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)


class Certification(Base, UUIDMixin, TimestampMixin):
    """
    Professional certification model with i18n support.
    Each row represents one certification in one language.
    """
    __tablename__ = "certifications"

    language: Mapped[Language] = mapped_column(
        SafeEnum(Language, unknown_value = Language.UNKNOWN),
        default = Language.ENGLISH,
    )

    name: Mapped[str] = mapped_column(
        String(CERTIFICATION_NAME_MAX_LENGTH),
    )
    issuer: Mapped[str] = mapped_column(
        String(CERTIFICATION_ISSUER_MAX_LENGTH),
    )
    issuer_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    issuer_logo_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )

    credential_id: Mapped[str | None] = mapped_column(
        String(CERTIFICATION_CREDENTIAL_ID_MAX_LENGTH),
        default = None,
    )
    verification_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )

    date_obtained: Mapped[date] = mapped_column(
        Date,
    )
    expiry_date: Mapped[date | None] = mapped_column(
        Date,
        default = None,
    )
    is_expired: Mapped[bool] = mapped_column(
        default = False,
    )

    badge_image_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )

    category: Mapped[CertificationCategory | None] = mapped_column(
        SafeEnum(CertificationCategory, unknown_value = CertificationCategory.UNKNOWN),
        default = None,
    )

    display_order: Mapped[int] = mapped_column(
        default = DEFAULT_DISPLAY_ORDER,
    )
    is_visible: Mapped[bool] = mapped_column(
        default = True,
    )
