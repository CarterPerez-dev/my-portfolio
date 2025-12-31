"""
ⒸAngelaMos | 2025
test_blogs.py
"""

import pytest
from httpx import AsyncClient

from blog.Blog import Blog


URL_BLOGS = "/v1/blogs"
URL_BLOGS_FEATURED = "/v1/blogs/featured"
URL_BLOGS_NAV = "/v1/blogs/nav"


@pytest.mark.asyncio
async def test_list_blogs_empty(client: AsyncClient):
    """
    List blogs returns empty list when no blogs exist
    """
    response = await client.get(URL_BLOGS)

    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_list_blogs_with_data(client: AsyncClient, test_blog: Blog):
    """
    List blogs returns blog data
    """
    response = await client.get(URL_BLOGS)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == test_blog.title
    assert data["items"][0]["external_url"] == test_blog.external_url


@pytest.mark.asyncio
async def test_list_featured_blogs_empty(client: AsyncClient, test_blog: Blog):
    """
    Featured blogs returns empty when no featured blogs
    """
    response = await client.get(URL_BLOGS_FEATURED)

    assert response.status_code == 200
    data = response.json()
    assert data == []


@pytest.mark.asyncio
async def test_list_featured_blogs_with_data(
    client: AsyncClient,
    featured_blog: Blog,
):
    """
    Featured blogs returns featured blog data
    """
    response = await client.get(URL_BLOGS_FEATURED)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_featured"] is True


@pytest.mark.asyncio
async def test_get_blog_nav(client: AsyncClient, test_blog: Blog):
    """
    Blog nav returns brief blog data
    """
    response = await client.get(URL_BLOGS_NAV)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == test_blog.title


@pytest.mark.asyncio
async def test_list_blogs_by_category(client: AsyncClient, test_blog: Blog):
    """
    List blogs by category returns filtered results
    """
    response = await client.get(f"{URL_BLOGS}/category/tutorial")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["category"] == "tutorial"


@pytest.mark.asyncio
async def test_get_blog_by_id(client: AsyncClient, test_blog: Blog):
    """
    Get blog by ID returns blog data
    """
    response = await client.get(f"{URL_BLOGS}/{test_blog.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == test_blog.title
    assert data["description"] == test_blog.description
    assert data["external_url"] == test_blog.external_url


@pytest.mark.asyncio
async def test_get_blog_by_id_not_found(client: AsyncClient):
    """
    Get non-existent blog returns 404
    """
    response = await client.get(
        f"{URL_BLOGS}/00000000-0000-0000-0000-000000000000"
    )

    assert response.status_code == 404
