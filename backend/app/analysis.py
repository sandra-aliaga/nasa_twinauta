"""Provider-neutral analysis boundaries for bibliographic candidates."""

from datetime import UTC, datetime
from hashlib import sha256
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.analysis_providers import PROMPT_VERSION, AnalysisDraft, AnalysisProvider, ProviderError
from app.database import LiteratureAnalysisRecord, LiteraturePaperRecord
from app.schemas import PaperAnalysis, PaperAnalysisItem, PaperSummary


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


def latest_analysis(
    session: Session, record: LiteraturePaperRecord
) -> LiteratureAnalysisRecord | None:
    """Find the latest result for the current available input text."""
    current = analysis_for_paper(record)
    if current.input_sha256 is None:
        return None
    return session.scalar(
        select(LiteratureAnalysisRecord)
        .where(
            LiteratureAnalysisRecord.paper_id == record.id,
            LiteratureAnalysisRecord.input_basis == current.input_basis,
            LiteratureAnalysisRecord.input_sha256 == current.input_sha256,
        )
        .order_by(
            LiteratureAnalysisRecord.created_at.desc(),
            LiteratureAnalysisRecord.id.desc(),
        )
        .limit(1)
    )


def project_analysis(persisted: LiteratureAnalysisRecord) -> PaperAnalysis:
    """Project a stored attempt without changing its review status."""
    return PaperAnalysis.model_validate(
        {
            "status": persisted.status,
            "input_basis": persisted.input_basis,
            "input_sha256": persisted.input_sha256,
            "prompt_version": persisted.prompt_version,
            "model_id": persisted.model_id,
            "generated_at": persisted.generated_at,
            "items": persisted.items,
            "failure_reason": persisted.failure_reason,
        }
    )


def analysis_from_database(session: Session, record: LiteraturePaperRecord) -> PaperAnalysis:
    """Reuse only analyses of the current available input text."""
    persisted = latest_analysis(session, record)
    return project_analysis(persisted) if persisted else analysis_for_paper(record)


def analysis_documents(
    session: Session, record: LiteraturePaperRecord
) -> tuple[PaperAnalysis, PaperSummary]:
    """Read analysis and summary from the same immutable stored attempt."""
    persisted = latest_analysis(session, record)
    analysis = project_analysis(persisted) if persisted else analysis_for_paper(record)
    if persisted and persisted.status == "ready" and persisted.summary is not None:
        return analysis, PaperSummary.model_validate(persisted.summary)
    return analysis, PaperSummary(
        status="unavailable",
        text=None,
        basis="not_prepared",
        method="not_prepared",
        review_status="pending",
        source_locators=[],
        limitations=["No hay un resumen preparado para la versión actual del texto."],
    )


def persist_analysis(
    session: Session,
    *,
    paper_id: str,
    analysis: PaperAnalysis,
    summary: PaperSummary | None = None,
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
        summary=summary.model_dump(mode="json") if summary else None,
        failure_reason=analysis.failure_reason,
    )
    session.add(record)
    return record


def validate_draft(draft: AnalysisDraft, text: str) -> None:
    """Require literal support; semantic and clinical review remain human tasks."""
    normalized = " ".join(text.split())
    excerpts = [draft.summary_excerpt, *(item.source_excerpt for item in draft.items)]
    for excerpt in excerpts:
        quote = " ".join(excerpt.split())
        if not quote or quote not in normalized:
            raise ProviderError("Generated content contains an unsupported source excerpt.")
    if not draft.summary.strip() or any(not item.text.strip() for item in draft.items):
        raise ProviderError("Generated content contains empty text.")


def analyze_paper(
    session: Session,
    paper_id: str,
    provider: AnalysisProvider,
    *,
    force: bool = False,
) -> str:
    """Execute an explicit preparation job; never run from a read endpoint."""
    paper = session.get(LiteraturePaperRecord, paper_id)
    if paper is None:
        raise ValueError("The selected paper does not exist in the migrated database.")
    current = analysis_for_paper(paper)
    if current.input_sha256 is None or paper.abstract_text is None:
        return "skipped_no_abstract"
    text = paper.abstract_text
    model_id = f"{provider.provider_id}/{provider.model}"
    cached = latest_analysis(session, paper)
    if (
        cached is not None
        and cached.status == "ready"
        and cached.prompt_version == PROMPT_VERSION
        and cached.model_id == model_id
        and cached.summary is not None
        and not force
    ):
        return "cached"
    attempt = PaperAnalysis.model_validate(
        {
            **current.model_dump(),
            "status": "running",
            "model_id": model_id,
            "prompt_version": PROMPT_VERSION,
        }
    )
    persist_analysis(session, paper_id=paper_id, analysis=attempt)
    session.commit()
    summary = None
    try:
        draft = provider.analyze(paper_id=paper_id, text=text)
        validate_draft(draft, text)
        session.expire_all()
        latest = session.get(LiteraturePaperRecord, paper_id)
        if latest is None or analysis_for_paper(latest).input_sha256 != current.input_sha256:
            raise ProviderError("The abstract changed while the analysis was running.")
        run_id = uuid4().hex
        items = [
            PaperAnalysisItem(
                id=f"{paper_id}:{run_id}:{index}",
                kind=item.kind,
                text=item.text,
                source_locator="abstract",
                source_excerpt=item.source_excerpt,
                review_status="pending",
                limitations=["Extraído solo del abstract; requiere revisión científica."],
            )
            for index, item in enumerate(draft.items)
        ]
        attempt = PaperAnalysis.model_validate(
            {
                **attempt.model_dump(),
                "status": "ready",
                "generated_at": datetime.now(UTC),
                "items": items,
            }
        )
        summary = PaperSummary(
            status="available",
            text=draft.summary,
            basis="abstract",
            method="llm_assisted",
            review_status="pending",
            source_locators=["abstract: " + draft.summary_excerpt],
            limitations=["Resumen generado; pendiente de revisión. No evalúa al astronauta."],
        )
    except (ProviderError, ValueError, OSError) as error:
        reason = str(error) if isinstance(error, ProviderError) else "Analysis preparation failed."
        attempt = PaperAnalysis.model_validate(
            {**attempt.model_dump(), "status": "failed", "failure_reason": reason[:2000]}
        )
    persist_analysis(session, paper_id=paper_id, analysis=attempt, summary=summary)
    session.commit()
    return attempt.status
