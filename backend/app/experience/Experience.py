"""
ⒸAngelaMos | 2025
Experience.py
"""

from datetime import date

from sqlalchemy import (
    Date,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

import config
from config import (
    EmploymentType,
    Language,
    SafeEnum,
)
from core.Base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)


class Experience(Base, UUIDMixin, TimestampMixin):
    """
    Work experience model with i18n support.
    Each row represents one job/role in one language.
    """
    __tablename__ = "experiences"

    language: Mapped[Language] = mapped_column(
        SafeEnum(Language,
                 unknown_value = Language.UNKNOWN),
        default = Language.ENGLISH,
    )

    company: Mapped[str] = mapped_column(
        String(config.EXPERIENCE_COMPANY_MAX_LENGTH),
    )
    company_url: Mapped[str | None] = mapped_column(
        String(config.URL_MAX_LENGTH),
        default = None,
    )
    company_logo_url: Mapped[str | None] = mapped_column(
        String(config.URL_MAX_LENGTH),
        default = None,
    )
    location: Mapped[str | None] = mapped_column(
        String(config.EXPERIENCE_LOCATION_MAX_LENGTH),
        default = None,
    )

    role: Mapped[str] = mapped_column(
        String(config.EXPERIENCE_ROLE_MAX_LENGTH),
    )
    department: Mapped[str | None] = mapped_column(
        String(config.EXPERIENCE_DEPARTMENT_MAX_LENGTH),
        default = None,
    )
    employment_type: Mapped[EmploymentType | None] = mapped_column(
        SafeEnum(EmploymentType,
                 unknown_value = EmploymentType.UNKNOWN),
        default = None,
    )

    start_date: Mapped[date] = mapped_column(
        Date,
    )
    end_date: Mapped[date | None] = mapped_column(
        Date,
        default = None,
    )
    is_current: Mapped[bool] = mapped_column(
        default = False,
    )

    description: Mapped[str] = mapped_column(
        Text,
    )
    responsibilities: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        default = None,
    )
    achievements: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        default = None,
    )
    tech_stack: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        default = None,
    )

    display_order: Mapped[int] = mapped_column(
        default = config.DEFAULT_DISPLAY_ORDER,
    )
    is_visible: Mapped[bool] = mapped_column(
        default = True,
    )
