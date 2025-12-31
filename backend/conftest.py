"""
©AngelaMos | 2025
conftest.py

Test configuration, fixtures, and factories
"""

import sys
from pathlib import Path


sys.path.insert(0, str(Path(__file__).parent / "app"))

import hashlib
import secrets
from datetime import (
    UTC,
    date,
    datetime,
    timedelta,
)
from uuid import uuid4
from collections.abc import AsyncIterator

import pytest
from httpx import (
    AsyncClient,
    ASGITransport,
)
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
)

from core.security import (
    hash_password,
    create_access_token,
)
from config import UserRole
from core.database import get_db_session

from core.Base import Base
from user.User import User
from auth.RefreshToken import RefreshToken
from project.Project import Project
from experience.Experience import Experience
from certification.Certification import Certification
from blog.Blog import Blog
from config import (
    Language,
    ProjectStatus,
    EmploymentType,
    CertificationCategory,
    BlogCategory,
)


TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost:9366/test_db"


@pytest.fixture
async def db_session() -> AsyncIterator[AsyncSession]:
    """
    Per test session with fresh tables
    """
    engine = create_async_engine(TEST_DATABASE_URL, echo = False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession(engine, expire_on_commit = False) as session:
        yield session

    await engine.dispose()


@pytest.fixture
async def client(db_session: AsyncSession) -> AsyncIterator[AsyncClient]:
    """
    Async HTTP client with DB session override
    """
    from factory import create_app

    app = create_app()

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db_session] = override_get_db

    async with AsyncClient(
            transport = ASGITransport(app = app),
            base_url = "http://test",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(access_token: str) -> dict[str, str]:
    """
    Authorization headers for authenticated requests
    """
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def admin_auth_headers(admin_access_token: str) -> dict[str, str]:
    """
    Authorization headers for admin requests
    """
    return {"Authorization": f"Bearer {admin_access_token}"}


class UserFactory:
    """
    Factory for creating test users
    """
    _counter = 0

    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        *,
        email: str | None = None,
        password: str = "TestPass123",
        full_name: str | None = None,
        role: UserRole = UserRole.USER,
        is_active: bool = True,
        is_verified: bool = True,
    ) -> User:
        cls._counter += 1

        user = User(
            email = email or f"user{cls._counter}@test.com",
            hashed_password = await hash_password(password),
            full_name = full_name or f"Test User {cls._counter}",
            role = role,
            is_active = is_active,
            is_verified = is_verified,
        )
        session.add(user)
        await session.flush()
        await session.refresh(user)
        return user

    @classmethod
    def reset(cls) -> None:
        cls._counter = 0


class RefreshTokenFactory:
    """
    Factory for creating test refresh tokens
    """
    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        user: User,
        *,
        is_revoked: bool = False,
        expires_delta: timedelta = timedelta(days = 7),
    ) -> tuple[RefreshToken,
               str]:
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()

        token = RefreshToken(
            user_id = user.id,
            token_hash = token_hash,
            family_id = uuid4(),
            expires_at = datetime.now(UTC) + expires_delta,
            is_revoked = is_revoked,
        )
        session.add(token)
        await session.flush()
        await session.refresh(token)
        return token, raw_token


@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    """
    Standard test user
    """
    return await UserFactory.create(db_session)


@pytest.fixture
async def admin_user(db_session: AsyncSession) -> User:
    """
    Admin test user
    """
    return await UserFactory.create(
        db_session,
        email = "admin@test.com",
        role = UserRole.ADMIN,
    )


@pytest.fixture
async def inactive_user(db_session: AsyncSession) -> User:
    """
    Inactive test user
    """
    return await UserFactory.create(
        db_session,
        email = "inactive@test.com",
        is_active = False,
    )


@pytest.fixture
def access_token(test_user: User) -> str:
    """
    Valid access token for test_user
    """
    return create_access_token(test_user.id, test_user.token_version)


@pytest.fixture
def admin_access_token(admin_user: User) -> str:
    """
    Valid access token for admin_user
    """
    return create_access_token(admin_user.id, admin_user.token_version)


@pytest.fixture
async def refresh_token_pair(
    db_session: AsyncSession,
    test_user: User,
) -> tuple[RefreshToken,
           str]:
    """
    Refresh token DB record and raw token string
    """
    return await RefreshTokenFactory.create(db_session, test_user)


@pytest.fixture
async def expired_refresh_token_pair(
    db_session: AsyncSession,
    test_user: User,
) -> tuple[RefreshToken,
           str]:
    """
    Expired refresh token for testing
    """
    return await RefreshTokenFactory.create(
        db_session,
        test_user,
        expires_delta = timedelta(days = -1),
    )


@pytest.fixture
async def revoked_refresh_token_pair(
    db_session: AsyncSession,
    test_user: User,
) -> tuple[RefreshToken,
           str]:
    """
    Revoked refresh token for testing
    """
    return await RefreshTokenFactory.create(
        db_session,
        test_user,
        is_revoked = True,
    )


class ProjectFactory:
    """
    Factory for creating test projects
    """
    _counter = 0

    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        *,
        slug: str | None = None,
        language: Language = Language.ENGLISH,
        title: str | None = None,
        description: str | None = None,
        tech_stack: list[str] | None = None,
        is_featured: bool = False,
        status: ProjectStatus = ProjectStatus.ACTIVE,
    ) -> Project:
        cls._counter += 1

        project = Project(
            slug = slug or f"test-project-{cls._counter}",
            language = language,
            title = title or f"Test Project {cls._counter}",
            description = description
            or f"Description for project {cls._counter}",
            tech_stack = tech_stack or ["Python",
                                        "FastAPI"],
            is_featured = is_featured,
            status = status,
        )
        session.add(project)
        await session.flush()
        await session.refresh(project)
        return project

    @classmethod
    def reset(cls) -> None:
        cls._counter = 0


class ExperienceFactory:
    """
    Factory for creating test experiences
    """
    _counter = 0

    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        *,
        language: Language = Language.ENGLISH,
        company: str | None = None,
        role: str | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
        is_current: bool = False,
        description: str | None = None,
        employment_type: EmploymentType = EmploymentType.FULL_TIME,
        is_visible: bool = True,
    ) -> Experience:
        cls._counter += 1

        experience = Experience(
            language = language,
            company = company or f"Test Company {cls._counter}",
            role = role or f"Software Engineer {cls._counter}",
            start_date = start_date or date(2023,
                                            1,
                                            1),
            end_date = end_date,
            is_current = is_current,
            description = description
            or f"Experience description {cls._counter}",
            employment_type = employment_type,
            is_visible = is_visible,
        )
        session.add(experience)
        await session.flush()
        await session.refresh(experience)
        return experience

    @classmethod
    def reset(cls) -> None:
        cls._counter = 0


class CertificationFactory:
    """
    Factory for creating test certifications
    """
    _counter = 0

    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        *,
        language: Language = Language.ENGLISH,
        name: str | None = None,
        issuer: str | None = None,
        date_obtained: date | None = None,
        expiry_date: date | None = None,
        is_expired: bool = False,
        category: CertificationCategory = CertificationCategory.CLOUD,
        is_visible: bool = True,
    ) -> Certification:
        cls._counter += 1

        certification = Certification(
            language = language,
            name = name or f"Test Certification {cls._counter}",
            issuer = issuer or f"Test Issuer {cls._counter}",
            date_obtained = date_obtained or date(2024,
                                                  1,
                                                  1),
            expiry_date = expiry_date,
            is_expired = is_expired,
            category = category,
            is_visible = is_visible,
        )
        session.add(certification)
        await session.flush()
        await session.refresh(certification)
        return certification

    @classmethod
    def reset(cls) -> None:
        cls._counter = 0


class BlogFactory:
    """
    Factory for creating test blogs
    """
    _counter = 0

    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        *,
        language: Language = Language.ENGLISH,
        title: str | None = None,
        description: str | None = None,
        external_url: str | None = None,
        category: BlogCategory = BlogCategory.TUTORIAL,
        is_visible: bool = True,
        is_featured: bool = False,
    ) -> Blog:
        cls._counter += 1

        blog = Blog(
            language = language,
            title = title or f"Test Blog {cls._counter}",
            description = description or f"Blog description {cls._counter}",
            external_url = external_url
            or f"https://blog.test.com/post-{cls._counter}",
            category = category,
            is_visible = is_visible,
            is_featured = is_featured,
        )
        session.add(blog)
        await session.flush()
        await session.refresh(blog)
        return blog

    @classmethod
    def reset(cls) -> None:
        cls._counter = 0


@pytest.fixture
async def test_project(db_session: AsyncSession) -> Project:
    """
    Standard test project
    """
    return await ProjectFactory.create(db_session)


@pytest.fixture
async def featured_project(db_session: AsyncSession) -> Project:
    """
    Featured test project
    """
    return await ProjectFactory.create(db_session, is_featured = True)


@pytest.fixture
async def test_experience(db_session: AsyncSession) -> Experience:
    """
    Standard test experience
    """
    return await ExperienceFactory.create(db_session)


@pytest.fixture
async def current_experience(db_session: AsyncSession) -> Experience:
    """
    Current ongoing experience
    """
    return await ExperienceFactory.create(db_session, is_current = True)


@pytest.fixture
async def test_certification(db_session: AsyncSession) -> Certification:
    """
    Standard test certification
    """
    return await CertificationFactory.create(db_session)


@pytest.fixture
async def test_blog(db_session: AsyncSession) -> Blog:
    """
    Standard test blog
    """
    return await BlogFactory.create(db_session)


@pytest.fixture
async def featured_blog(db_session: AsyncSession) -> Blog:
    """
    Featured test blog
    """
    return await BlogFactory.create(db_session, is_featured = True)


@pytest.fixture(autouse = True)
def reset_factories():
    """
    Reset factory counters between tests
    """
    yield
    UserFactory.reset()
    ProjectFactory.reset()
    ExperienceFactory.reset()
    CertificationFactory.reset()
    BlogFactory.reset()
