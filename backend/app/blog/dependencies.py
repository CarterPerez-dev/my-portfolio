"""
ⒸAngelaMos | 2025
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import BlogService


def get_blog_service(db: DBSession) -> BlogService:
    """
    Dependency to inject BlogService instance.
    """
    return BlogService(db)


BlogServiceDep = Annotated[BlogService, Depends(get_blog_service)]
