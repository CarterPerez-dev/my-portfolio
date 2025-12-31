"""
ⒸAngelaMos | 2025
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import CertificationService


def get_certification_service(db: DBSession) -> CertificationService:
    """
    Dependency to inject CertificationService instance.
    """
    return CertificationService(db)


CertificationServiceDep = Annotated[CertificationService,
                                    Depends(get_certification_service)]
