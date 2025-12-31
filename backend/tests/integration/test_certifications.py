"""
ⒸAngelaMos | 2025
test_certifications.py
"""

import pytest
from httpx import AsyncClient

from certification.Certification import Certification


URL_CERTIFICATIONS = "/v1/certifications"
URL_CERTIFICATIONS_ACTIVE = "/v1/certifications/active"
URL_CERTIFICATIONS_BADGES = "/v1/certifications/badges"


@pytest.mark.asyncio
async def test_list_certifications_empty(client: AsyncClient):
    """
    List certifications returns empty list when no certifications exist
    """
    response = await client.get(URL_CERTIFICATIONS)

    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_list_certifications_with_data(
    client: AsyncClient,
    test_certification: Certification,
):
    """
    List certifications returns certification data
    """
    response = await client.get(URL_CERTIFICATIONS)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == test_certification.name
    assert data["items"][0]["issuer"] == test_certification.issuer


@pytest.mark.asyncio
async def test_list_active_certifications(
    client: AsyncClient,
    test_certification: Certification,
):
    """
    Active certifications returns non-expired certs
    """
    response = await client.get(URL_CERTIFICATIONS_ACTIVE)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_expired"] is False


@pytest.mark.asyncio
async def test_get_certification_badges(
    client: AsyncClient,
    test_certification: Certification,
):
    """
    Certification badges returns brief certification data
    """
    response = await client.get(URL_CERTIFICATIONS_BADGES)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == test_certification.name
    assert data[0]["issuer"] == test_certification.issuer


@pytest.mark.asyncio
async def test_list_certifications_by_category(
    client: AsyncClient,
    test_certification: Certification,
):
    """
    List certifications by category returns filtered results
    """
    response = await client.get(f"{URL_CERTIFICATIONS}/category/cloud")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["category"] == "cloud"


@pytest.mark.asyncio
async def test_get_certification_by_id(
    client: AsyncClient,
    test_certification: Certification,
):
    """
    Get certification by ID returns certification data
    """
    response = await client.get(f"{URL_CERTIFICATIONS}/{test_certification.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_certification.name
    assert data["issuer"] == test_certification.issuer


@pytest.mark.asyncio
async def test_get_certification_by_id_not_found(client: AsyncClient):
    """
    Get non-existent certification returns 404
    """
    response = await client.get(
        f"{URL_CERTIFICATIONS}/00000000-0000-0000-0000-000000000000"
    )

    assert response.status_code == 404
