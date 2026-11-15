"""Provider-neutral analysis boundaries for bibliographic candidates."""

from hashlib import sha256
from typing import Protocol

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import LiteratureAnalysisRecord, LiteraturePaperRecord
from app.schemas import PaperAnalysis, PaperAnalysisItem


class AnalysisProvider(Protocol):
    """Define the backend-only contract for a future analysis provider."""

    provider_id: str

    def analyze(self, *, paper_id: str, text: str, input_basis: str) -> list[PaperAnalysisItem]:
        """Return traceable candidate items without changing their review status."""


def analysis_for_paper(record: LiteraturePaperRecord) -> PaperAnalysis:
    """Return a deterministic no-provider state with input provenance."""
    if not record.abstract_text:
        return PaperAnalysis(
            status="not_requested",
            input_basis="not_prepared",
            input_sha256=None,
            prompt_version=None,
            model_id=None,
            generated_at=None,
            items=[],
            failure_reason=None,
        )
    digest = sha256(record.abstract_text.encode("utf-8")).hexdigest()
    return PaperAnalysis(
        status="not_requested",
        input_basis="abstract",
        input_sha256=digest,
        prompt_version=None,
        model_id=None,
        generated_at=None,
        items=[],
        failure_reason=None,
    )


def analysis_from_database(session: Session, record: LiteraturePaperRecord) -> PaperAnalysis:
    """Return the newest persisted analysis or the deterministic empty state."""
    persisted = session.scalar(
        select(LiteratureAnalysisRecord)
        .where(LiteratureAnalysisRecord.paper_id == record.id)
        .order_by(
            LiteratureAnalysisRecord.created_at.desc(),
            LiteratureAnalysisRecord.id.desc(),
        )
        .limit(1)
    )
    if persisted is None:
        return analysis_for_paper(record)
    return PaperAnalysis(
        status=persisted.status,
        input_basis=persisted.input_basis,
        input_sha256=persisted.input_sha256,
        prompt_version=persisted.prompt_version,
        model_id=persisted.model_id,
        generated_at=persisted.generated_at,
        items=[PaperAnalysisItem.model_validate(item) for item in persisted.items],
        failure_reason=persisted.failure_reason,
    )


def persist_analysis(
    session: Session, *, paper_id: str, analysis: PaperAnalysis
) -> LiteratureAnalysisRecord:
    """Stage one analysis result for the caller's transaction."""
    record = LiteratureAnalysisRecord(
        paper_id=paper_id,
        input_basis=analysis.input_basis,
        input_sha256=analysis.input_sha256,
        prompt_version=analysis.prompt_version,
        model_id=analysis.model_id,
        status=analysis.status,
        generated_at=analysis.generated_at,
        items=[item.model_dump(mode="json") for item in analysis.items],
        failure_reason=analysis.failure_reason,
    )
    session.add(record)
    return record
