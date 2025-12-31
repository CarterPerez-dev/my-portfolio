"""
ⒸAngelaMos | 2025
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import ExperienceService


def get_experience_service(db: DBSession) -> ExperienceService:
    """
    Dependency to inject ExperienceService instance.
    """
    return ExperienceService(db)


ExperienceServiceDep = Annotated[ExperienceService,
                                 Depends(get_experience_service)]
