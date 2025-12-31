"""
ⒸAngelaMos | 2025
Blog.py
"""

from datetime import date

from sqlalchemy import (
    Date,
    String,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

import config
from config import (
    BlogCategory,
    Language,
    SafeEnum,
)
from core.Base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)


class Blog(Base, UUIDMixin, TimestampMixin):
    """
    External blog post reference model with i18n support.
    Each row represents one blog post link in one language.
    """
    __tablename__ = "blogs"

    language: Mapped[Language] = mapped_column(
        SafeEnum(Language,
                 unknown_value = Language.UNKNOWN),
        default = Language.ENGLISH,
    )

    title: Mapped[str] = mapped_column(
        String(config.BLOG_TITLE_MAX_LENGTH),
    )
    description: Mapped[str] = mapped_column(
        String(config.BLOG_DESCRIPTION_MAX_LENGTH),
    )
    external_url: Mapped[str] = mapped_column(
        String(config.URL_MAX_LENGTH),
    )

    category: Mapped[BlogCategory | None] = mapped_column(
        SafeEnum(BlogCategory,
                 unknown_value = BlogCategory.UNKNOWN),
        default = None,
    )
    tags: Mapped[list[str] | None] = mapped_column(
        ARRAY(String(config.TAG_MAX_LENGTH)),
        default = None,
    )

    thumbnail_url: Mapped[str | None] = mapped_column(
        String(config.URL_MAX_LENGTH),
        default = None,
    )

    published_date: Mapped[date | None] = mapped_column(
        Date,
        default = None,
    )

    read_time_minutes: Mapped[int | None] = mapped_column(
        default = None,
    )
    views_count: Mapped[int | None] = mapped_column(
        default = None,
    )

    display_order: Mapped[int] = mapped_column(
        default = config.DEFAULT_DISPLAY_ORDER,
    )
    is_visible: Mapped[bool] = mapped_column(
        default = True,
    )
    is_featured: Mapped[bool] = mapped_column(
        default = False,
    )
