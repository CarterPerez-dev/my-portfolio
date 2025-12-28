"""
ⒸAngelaMos | 2025
enums.py
"""

from enum import Enum
from typing import Any

import sqlalchemy as sa


def enum_values_callable(enum_class: type[Enum]) -> list[str]:
    """
    Returns enum VALUES (not names) for SQLAlchemy storage

    Prevents the common trap where SQLAlchemy stores enum NAMES by default,
    causing database breakage if you rename an enum member
    """
    return [str(item.value) for item in enum_class]


class SafeEnum(sa.Enum):
    """
    SQLAlchemy Enum type that stores VALUES and handles unknown values gracefully

    https://blog.wrouesnel.com/posts/sqlalchemy-enums-careful-what-goes-into-the-database/
    """
    def __init__(self, *enums: type[Enum], **kw: Any) -> None:
        if "values_callable" not in kw:
            kw["values_callable"] = enum_values_callable
        super().__init__(*enums, **kw)
        self._unknown_value = (
            kw["_adapted_from"]._unknown_value
            if "_adapted_from" in kw else kw.get("unknown_value")
        )

    def _object_value_for_elem(self, elem: str) -> Enum:
        """
        Override to return unknown_value instead of raising LookupError
        """
        try:
            return self._object_lookup[elem]
        except LookupError:
            if self._unknown_value is not None:
                return self._unknown_value
            raise


class Environment(str, Enum):
    """
    Application environment.
    """
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class UserRole(str, Enum):
    """
    User roles for authorization.
    """
    UNKNOWN = "unknown"
    USER = "user"
    ADMIN = "admin"


class TokenType(str, Enum):
    """
    JWT token types.
    """
    ACCESS = "access"
    REFRESH = "refresh"


class HealthStatus(str, Enum):
    """
    Health check status values.
    """
    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"
    DEGRADED = "degraded"


class Language(str, Enum):
    """
    Supported languages for i18n content.
    Top 7 languages by total speakers worldwide.
    """
    UNKNOWN = "unknown"
    ENGLISH = "en"
    MANDARIN = "zh"
    HINDI = "hi"
    SPANISH = "es"
    FRENCH = "fr"
    ARABIC = "ar"
    PORTUGUESE = "pt"


class ProjectStatus(str, Enum):
    """
    Project lifecycle status.
    """
    UNKNOWN = "unknown"
    ACTIVE = "active"
    MAINTAINED = "maintained"
    ARCHIVED = "archived"
    DEPRECATED = "deprecated"


class EmploymentType(str, Enum):
    """
    Employment type for work experience.
    """
    UNKNOWN = "unknown"
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    FREELANCE = "freelance"
    INTERNSHIP = "internship"


class CertificationCategory(str, Enum):
    """
    Certification domain categories.
    """
    UNKNOWN = "unknown"
    SECURITY = "security"
    CLOUD = "cloud"
    PROGRAMMING = "programming"
    NETWORKING = "networking"
    DATABASE = "database"
    DEVOPS = "devops"


class BlogCategory(str, Enum):
    """
    Blog post categories.
    """
    UNKNOWN = "unknown"
    TUTORIAL = "tutorial"
    DEEP_DIVE = "deep_dive"
    CAREER = "career"
    PROJECT = "project"
    OPINION = "opinion"
