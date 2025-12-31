"""
ⒸAngelaMos | 2025
schemas.py
"""

from pydantic import BaseModel, Field


class SearchResultItem(BaseModel):
    """
    Single search result with highlighted excerpt
    """
    title: str
    excerpt: str
    url: str
    type: str = Field(description = "project, experience, or certification")


class SearchResponse(BaseModel):
    """
    Full search response
    """
    query: str
    total: int
    results: list[SearchResultItem]
