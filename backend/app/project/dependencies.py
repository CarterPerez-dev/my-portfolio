"""
ⒸAngelaMos | 2025
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import ProjectService


def get_project_service(db: DBSession) -> ProjectService:
    """
    Dependency to inject ProjectService instance.
    """
    return ProjectService(db)


ProjectServiceDep = Annotated[ProjectService, Depends(get_project_service)]
