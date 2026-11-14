"""PostgreSQL tables for demo cases, immutable snapshots and action tracking."""

from datetime import datetime
from typing import Any

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, create_engine
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.config import Settings


class Base(DeclarativeBase):
    """Provide shared metadata for migrations."""


class CaseRecord(Base):
    """Store a versioned, read-only demo case and its source data."""

    __tablename__ = "demo_cases"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)


class AssessmentRecord(Base):
    """Preserve the scientific payload and graph views at creation time."""

    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    case_id: Mapped[str] = mapped_column(ForeignKey("demo_cases.id"), index=True)
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    graphs: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class ActionState(Base):
    """Keep mutable tracking outside the immutable assessment payload."""

    __tablename__ = "action_states"
    __table_args__ = (CheckConstraint("revision >= 0", name="action_revision_nonnegative"),)

    assessment_id: Mapped[str] = mapped_column(
        ForeignKey("assessments.id", ondelete="CASCADE"), primary_key=True
    )
    action_id: Mapped[str] = mapped_column(String(150), primary_key=True)
    execution_status: Mapped[str] = mapped_column(String(20), nullable=False)
    revision: Mapped[int] = mapped_column(Integer, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


def create_database_engine(settings: Settings) -> Engine:
    """Create a lazy connection pool without changing the database schema."""
    return create_engine(
        settings.database_url.get_secret_value(),
        pool_pre_ping=True,
        connect_args={"connect_timeout": 5},
    )
