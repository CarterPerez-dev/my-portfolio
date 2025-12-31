"""
ⒸAngelaMos | 2025
test_projects.py
"""

import pytest
from httpx import AsyncClient

from project.Project import Project


URL_PROJECTS = "/v1/projects"
URL_PROJECTS_FEATURED = "/v1/projects/featured"
URL_PROJECTS_NAV = "/v1/projects/nav"


@pytest.mark.asyncio
async def test_list_projects_empty(client: AsyncClient):
    """
    List projects returns empty list when no projects exist
    """
    response = await client.get(URL_PROJECTS)

    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_list_projects_with_data(
    client: AsyncClient,
    test_project: Project
):
    """
    List projects returns project data
    """
    response = await client.get(URL_PROJECTS)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["slug"] == test_project.slug
    assert data["items"][0]["title"] == test_project.title


@pytest.mark.asyncio
async def test_list_projects_with_language(
    client: AsyncClient,
    test_project: Project
):
    """
    List projects filters by language
    """
    response = await client.get(f"{URL_PROJECTS}?lang=en")

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1


@pytest.mark.asyncio
async def test_list_featured_projects_empty(
    client: AsyncClient,
    test_project: Project
):
    """
    Featured projects returns empty when no featured projects
    """
    response = await client.get(URL_PROJECTS_FEATURED)

    assert response.status_code == 200
    data = response.json()
    assert data == []


@pytest.mark.asyncio
async def test_list_featured_projects_with_data(
    client: AsyncClient,
    featured_project: Project,
):
    """
    Featured projects returns featured project data
    """
    response = await client.get(URL_PROJECTS_FEATURED)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_featured"] is True


@pytest.mark.asyncio
async def test_get_project_nav(client: AsyncClient, test_project: Project):
    """
    Project nav returns brief project data
    """
    response = await client.get(URL_PROJECTS_NAV)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["slug"] == test_project.slug


@pytest.mark.asyncio
async def test_get_project_by_slug(client: AsyncClient, test_project: Project):
    """
    Get project by slug returns project data
    """
    response = await client.get(f"{URL_PROJECTS}/{test_project.slug}")

    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == test_project.slug
    assert data["title"] == test_project.title
    assert data["description"] == test_project.description


@pytest.mark.asyncio
async def test_get_project_by_slug_not_found(client: AsyncClient):
    """
    Get non-existent project returns 404
    """
    response = await client.get(f"{URL_PROJECTS}/non-existent-slug")

    assert response.status_code == 404
