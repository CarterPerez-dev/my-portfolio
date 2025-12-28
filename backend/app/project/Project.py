"""
ⒸAngelaMos | 2025
Project.py
"""

from datetime import date

from sqlalchemy import (
    Date,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from config import (
    DEFAULT_DISPLAY_ORDER,
    LANGUAGE_CODE_MAX_LENGTH,
    PROJECT_CODE_FILENAME_MAX_LENGTH,
    PROJECT_CODE_LANGUAGE_MAX_LENGTH,
    PROJECT_DESCRIPTION_MAX_LENGTH,
    PROJECT_SLUG_MAX_LENGTH,
    PROJECT_STATUS_MAX_LENGTH,
    PROJECT_SUBTITLE_MAX_LENGTH,
    PROJECT_TITLE_MAX_LENGTH,
    URL_MAX_LENGTH,
    Language,
    ProjectStatus,
    SafeEnum,
)
from core.Base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)


class Project(Base, UUIDMixin, TimestampMixin):
    """
    Portfolio project model with i18n support.
    Each row represents one project in one language.
    """
    __tablename__ = "projects"

    slug: Mapped[str] = mapped_column(
        String(PROJECT_SLUG_MAX_LENGTH),
        index = True,
    )
    language: Mapped[Language] = mapped_column(
        SafeEnum(Language, unknown_value = Language.UNKNOWN),
        default = Language.ENGLISH,
    )

    title: Mapped[str] = mapped_column(
        String(PROJECT_TITLE_MAX_LENGTH),
    )
    subtitle: Mapped[str | None] = mapped_column(
        String(PROJECT_SUBTITLE_MAX_LENGTH),
        default = None,
    )
    description: Mapped[str] = mapped_column(
        String(PROJECT_DESCRIPTION_MAX_LENGTH),
    )
    technical_details: Mapped[str | None] = mapped_column(
        Text,
        default = None,
    )

    tech_stack: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default = list,
    )

    github_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    demo_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    website_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    docs_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    blog_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    pypi_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    npm_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    ios_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    android_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )

    code_snippet: Mapped[str | None] = mapped_column(
        Text,
        default = None,
    )
    code_language: Mapped[str | None] = mapped_column(
        String(PROJECT_CODE_LANGUAGE_MAX_LENGTH),
        default = None,
    )
    code_filename: Mapped[str | None] = mapped_column(
        String(PROJECT_CODE_FILENAME_MAX_LENGTH),
        default = None,
    )

    thumbnail_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    banner_url: Mapped[str | None] = mapped_column(
        String(URL_MAX_LENGTH),
        default = None,
    )
    screenshots: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        default = None,
    )

    stars_count: Mapped[int | None] = mapped_column(
        default = None,
    )
    forks_count: Mapped[int | None] = mapped_column(
        default = None,
    )
    downloads_count: Mapped[int | None] = mapped_column(
        default = None,
    )
    users_count: Mapped[int | None] = mapped_column(
        default = None,
    )

    display_order: Mapped[int] = mapped_column(
        default = DEFAULT_DISPLAY_ORDER,
    )
    is_complete: Mapped[bool] = mapped_column(
        default = True,
    )
    is_featured: Mapped[bool] = mapped_column(
        default = False,
    )
    status: Mapped[ProjectStatus | None] = mapped_column(
        SafeEnum(ProjectStatus, unknown_value = ProjectStatus.UNKNOWN),
        default = None,
    )
    start_date: Mapped[date | None] = mapped_column(
        Date,
        default = None,
    )
    end_date: Mapped[date | None] = mapped_column(
        Date,
        default = None,
    )

    __table_args__ = (
        UniqueConstraint("slug", "language", name = "uq_projects_slug_language"),
    )
