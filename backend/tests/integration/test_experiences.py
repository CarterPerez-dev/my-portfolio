"""
ⒸAngelaMos | 2025
test_experiences.py
"""

import pytest
from httpx import AsyncClient

from experience.Experience import Experience


URL_EXPERIENCES = "/v1/experiences"
URL_EXPERIENCES_CURRENT = "/v1/experiences/current"
URL_EXPERIENCES_TIMELINE = "/v1/experiences/timeline"


@pytest.mark.asyncio
async def test_list_experiences_empty(client: AsyncClient):
    """
    List experiences returns empty list when no experiences exist
    """
    response = await client.get(URL_EXPERIENCES)

    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_list_experiences_with_data(
    client: AsyncClient,
    test_experience: Experience,
):
    """
    List experiences returns experience data
    """
    response = await client.get(URL_EXPERIENCES)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["company"] == test_experience.company
    assert data["items"][0]["role"] == test_experience.role


@pytest.mark.asyncio
async def test_list_current_experiences_empty(
    client: AsyncClient,
    test_experience: Experience,
):
    """
    Current experiences returns empty when no current positions
    """
    response = await client.get(URL_EXPERIENCES_CURRENT)

    assert response.status_code == 200
    data = response.json()
    assert data == []


@pytest.mark.asyncio
async def test_list_current_experiences_with_data(
    client: AsyncClient,
    current_experience: Experience,
):
    """
    Current experiences returns ongoing positions
    """
    response = await client.get(URL_EXPERIENCES_CURRENT)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_current"] is True


@pytest.mark.asyncio
async def test_get_experience_timeline(
    client: AsyncClient,
    test_experience: Experience,
):
    """
    Experience timeline returns brief experience data
    """
    response = await client.get(URL_EXPERIENCES_TIMELINE)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["company"] == test_experience.company
    assert data[0]["role"] == test_experience.role


@pytest.mark.asyncio
async def test_get_experience_by_id(
    client: AsyncClient,
    test_experience: Experience,
):
    """
    Get experience by ID returns experience data
    """
    response = await client.get(f"{URL_EXPERIENCES}/{test_experience.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["company"] == test_experience.company
    assert data["role"] == test_experience.role
    assert data["description"] == test_experience.description


@pytest.mark.asyncio
async def test_get_experience_by_id_not_found(client: AsyncClient):
    """
    Get non-existent experience returns 404
    """
    response = await client.get(
        f"{URL_EXPERIENCES}/00000000-0000-0000-0000-000000000000"
    )

    assert response.status_code == 404
