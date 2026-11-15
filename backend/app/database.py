"""PostgreSQL tables for demo cases, immutable snapshots and action tracking."""

from datetime import datetime
from typing import Any
from uuid import uuid4

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, create_engine, text
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


class PreparedContextRecord(Base):
    """Keep published context versions separate from assessment and action state."""

    __tablename__ = "prepared_contexts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    assessment_id: Mapped[str] = mapped_column(
        ForeignKey("assessments.id", ondelete="CASCADE"), index=True
    )
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )


class LiteraturePaperRecord(Base):
    """Store one bibliographic candidate independently from scientific assessments."""

    __tablename__ = "literature_papers"

    id: Mapped[str] = mapped_column(String(150), primary_key=True)
    corpus_version: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(1000), nullable=False)
    publication_year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    identifiers: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    authors: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, nullable=False)
    abstract_text: Mapped[str | None] = mapped_column(String, nullable=True)
    source_url: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    doi_url: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    pmc_url: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    publication_types: Mapped[list[str]] = mapped_column(JSONB, nullable=False)
    review_status: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    model_parameter_eligible: Mapped[bool] = mapped_column(nullable=False)
    clinical_action_eligible: Mapped[bool] = mapped_column(nullable=False)
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)


class LiteratureAnalysisRecord(Base):
    """Persist one provider result without promoting it to reviewed evidence."""

    __tablename__ = "literature_analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    paper_id: Mapped[str] = mapped_column(
        ForeignKey("literature_papers.id", ondelete="CASCADE"), index=True
    )
    input_basis: Mapped[str] = mapped_column(String(20), nullable=False)
    input_sha256: Mapped[str | None] = mapped_column(String(64), nullable=True)
    prompt_version: Mapped[str | None] = mapped_column(String(100), nullable=True)
    model_id: Mapped[str | None] = mapped_column(String(200), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    generated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    items: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, nullable=False)
    summary: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    failure_reason: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )


def create_database_engine(settings: Settings) -> Engine:
    """Create a lazy connection pool without changing the database schema."""
    return create_engine(
        settings.database_url.get_secret_value(),
        pool_pre_ping=True,
        connect_args={"connect_timeout": 5},
    )
