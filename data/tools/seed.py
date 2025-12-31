#!/usr/bin/env python3
"""
AngelaMos | 2025
seed.py - Insert JSON seed files into PostgreSQL

Usage:
    python seed.py                    # Seed all domains
    python seed.py projects           # Seed only projects
    python seed.py --dry-run          # Validate without inserting
    python seed.py --clear projects   # Clear and reseed projects

Environment:
    DATABASE_URL                      # Full async URL (preferred)
    POSTGRES_USER, POSTGRES_PASSWORD, # Individual components
    POSTGRES_HOST, POSTGRES_DB        # (fallback)
"""

import asyncio
import json
import os
import sys
from datetime import date
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import delete
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
)

load_dotenv(Path(__file__).parent.parent.parent / ".env")

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "backend" / "app"))

from config import (
    BlogCategory,
    CertificationCategory,
    EmploymentType,
    Language,
    ProjectStatus,
)
from core.Base import Base
from auth.RefreshToken import RefreshToken  # noqa: F401
from user.User import User  # noqa: F401
from project.Project import Project
from experience.Experience import Experience
from certification.Certification import Certification
from blog.Blog import Blog


SEED_PATH = Path(__file__).parent.parent / "data"

DOMAIN_CONFIG = {
    "projects": {
        "model": Project,
        "folder": "projects",
        "enums": {
            "language": Language,
            "status": ProjectStatus,
        },
        "dates": ["start_date", "end_date"],
        "upsert_keys": ["slug", "language"],
    },
    "experiences": {
        "model": Experience,
        "file": "experience.json",
        "enums": {
            "language": Language,
            "employment_type": EmploymentType,
        },
        "dates": ["start_date", "end_date"],
    },
    "certifications": {
        "model": Certification,
        "file": "certifications.json",
        "enums": {
            "language": Language,
            "category": CertificationCategory,
        },
        "dates": ["date_obtained", "expiry_date"],
    },
    "blogs": {
        "model": Blog,
        "file": "blogs.json",
        "enums": {
            "language": Language,
            "category": BlogCategory,
        },
        "dates": ["published_date"],
    },
}

LANGUAGE_MAP = {
    "en": Language.ENGLISH,
    "es": Language.SPANISH,
    "fr": Language.FRENCH,
    "ar": Language.ARABIC,
    "pt": Language.PORTUGUESE,
    "zh": Language.MANDARIN,
    "hi": Language.HINDI,
}


def get_database_url(local: bool = False) -> str:
    """
    Build database URL from environment variables.
    local=True uses localhost with exposed port for running outside Docker.
    """
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "postgres")
    db = os.getenv("POSTGRES_DB", "app_db")

    if local:
        port = os.getenv("POSTGRES_HOST_PORT", "5432")
        host = "localhost"
    else:
        port = os.getenv("POSTGRES_CONTAINER_PORT", "5432")
        host = os.getenv("POSTGRES_HOST", "db")

    return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}"


class Colors:
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    CYAN = "\033[36m"
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"


def color(c: str, text: str) -> str:
    return f"{getattr(Colors, c.upper(), '')}{text}{Colors.RESET}"


def parse_date(value: str | None) -> date | None:
    if not value:
        return None
    parts = value.split("-")
    if len(parts) == 2:
        return date(int(parts[0]), int(parts[1]), 1)
    return date.fromisoformat(value)


def parse_enum(enum_class: type, value: str | None):
    if value is None:
        return None

    value_lower = value.lower()

    for member in enum_class:
        if member.value == value_lower or member.name.lower() == value_lower:
            return member

    return None


def transform_data(data: dict, config: dict) -> dict:
    result = data.copy()

    for field, enum_class in config["enums"].items():
        if field in result:
            result[field] = parse_enum(enum_class, result[field])

    for field in config["dates"]:
        if field in result:
            result[field] = parse_date(result[field])

    return result


def scan_seed_files(domain: str) -> list[tuple[Path, str, bool]]:
    """
    Scan for seed files, returning (path, lang_code, is_array_file).
    Supports both single-file arrays (experience.json) and folder structures (projects/).
    """
    config = DOMAIN_CONFIG[domain]
    files = []

    for lang_dir in SEED_PATH.iterdir():
        if not lang_dir.is_dir():
            continue

        lang_code = lang_dir.name

        if "file" in config:
            single_file = lang_dir / config["file"]
            if single_file.exists():
                files.append((single_file, lang_code, True))

        if "folder" in config:
            domain_dir = lang_dir / config["folder"]
            if domain_dir.exists():
                for json_file in domain_dir.glob("*.json"):
                    files.append((json_file, lang_code, False))

    return files


async def seed_domain(
    session: AsyncSession,
    domain: str,
    dry_run: bool = False,
    clear: bool = False,
) -> tuple[int, int]:
    config = DOMAIN_CONFIG[domain]
    model = config["model"]
    files = scan_seed_files(domain)

    if not files:
        print(f"  {color('dim', 'No files found')}")
        return 0, 0

    if clear and not dry_run:
        await session.execute(delete(model))
        print(f"  {color('yellow', 'Cleared existing records')}")

    inserted = 0
    errors = 0

    for file_path, lang_code, is_array_file in files:
        try:
            with open(file_path) as f:
                raw_data = json.load(f)

            records = raw_data if is_array_file else [raw_data]

            for idx, data in enumerate(records):
                try:
                    if "language" not in data or data["language"] is None:
                        data["language"] = lang_code

                    transformed = transform_data(data, config)

                    if dry_run:
                        label = f"{file_path.name}[{idx}]" if is_array_file else file_path.name
                        print(f"  {color('blue', '○')} {label} (dry-run)")
                    else:
                        upsert_keys = config.get("upsert_keys", [])
                        if upsert_keys:
                            stmt = insert(model).values(**transformed)
                            update_cols = {
                                k: v for k, v in transformed.items()
                                if k not in upsert_keys and k != "id"
                            }
                            stmt = stmt.on_conflict_do_update(
                                index_elements=upsert_keys,
                                set_=update_cols,
                            )
                            await session.execute(stmt)
                        else:
                            record = model(**transformed)
                            session.add(record)

                    inserted += 1

                except TypeError as e:
                    label = f"{file_path.name}[{idx}]" if is_array_file else file_path.name
                    print(f"  {color('red', '✗')} {label}: Field error - {e}")
                    errors += 1

            if not dry_run and is_array_file:
                print(f"  {color('green', '✓')} {file_path.name} ({len(records)} records)")
            elif not dry_run:
                print(f"  {color('green', '✓')} {file_path.name}")

        except json.JSONDecodeError as e:
            print(f"  {color('red', '✗')} {file_path.name}: Invalid JSON - {e}")
            errors += 1
        except Exception as e:
            print(f"  {color('red', '✗')} {file_path.name}: {e}")
            errors += 1

    return inserted, errors


async def main():
    args = sys.argv[1:]

    dry_run = "--dry-run" in args
    clear = "--clear" in args
    local = "--local" in args

    args = [a for a in args if not a.startswith("--")]

    filter_domain = args[0] if args else None

    db_url = get_database_url(local=local)

    print(f"\n{color('bold', '━━━ Seed Runner ━━━')}")
    print(f"{color('dim', f'Database: {db_url.split('@')[1]}')}")

    if dry_run:
        print(f"{color('yellow', 'DRY RUN - no changes will be made')}")

    engine = create_async_engine(db_url, echo=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession(engine, expire_on_commit=False) as session:
        total_inserted = 0
        total_errors = 0

        for domain, config in DOMAIN_CONFIG.items():
            if filter_domain and domain != filter_domain:
                continue

            print(f"\n{color('cyan', f'[{domain}]')}")

            inserted, errors = await seed_domain(
                session,
                domain,
                dry_run=dry_run,
                clear=clear,
            )

            total_inserted += inserted
            total_errors += errors

        if not dry_run and total_errors == 0:
            await session.commit()
            print(f"\n{color('green', '✓ Committed to database')}")
        elif total_errors > 0:
            await session.rollback()
            print(f"\n{color('red', '✗ Rolled back due to errors')}")

    await engine.dispose()

    print(f"\n{color('bold', '━━━ Summary ━━━')}")
    print(f"Inserted: {total_inserted} | Errors: {total_errors}")

    if total_errors > 0:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
