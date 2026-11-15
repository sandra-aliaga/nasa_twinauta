"""Search and project bibliographic candidates stored in PostgreSQL."""

import base64
import binascii
import json
from typing import Any, Literal

from sqlalchemy import Text, cast, or_, select
from sqlalchemy.orm import Session

from app.analysis import analysis_documents
from app.database import AssessmentRecord, LiteraturePaperRecord
from app.errors import DomainError, not_found
from app.schemas import (
    GraphView,
    Page,
    PaperAccess,
    PaperApplicability,
    PaperCard,
    PaperDetail,
    PaperIdentifiers,
    PaperPage,
)

CORPUS_VERSION = "candidate-corpus-2026-11-14"
DEFAULT_LIMIT = 25
MAX_LIMIT = 100


def _invalid_request(message: str, details: list[str] | None = None) -> DomainError:
    return DomainError(422, "invalid_request", message, details)


def _encode_cursor(offset: int, fingerprint: str) -> str:
    payload = {"corpus_version": CORPUS_VERSION, "offset": offset, "fingerprint": fingerprint}
    encoded = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode())
    return encoded.decode().rstrip("=")


def _decode_cursor(cursor: str, fingerprint: str) -> int:
    try:
        padded = cursor + "=" * (-len(cursor) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded).decode())
        offset = payload["offset"]
        cursor_version = payload["corpus_version"]
        cursor_fingerprint = payload["fingerprint"]
    except (binascii.Error, UnicodeDecodeError, json.JSONDecodeError, KeyError, TypeError):
        raise _invalid_request("El cursor no es válido.") from None
    if (
        cursor_version != CORPUS_VERSION
        or cursor_fingerprint != fingerprint
        or not isinstance(offset, int)
        or offset < 0
    ):
        raise DomainError(
            409,
            "cursor_conflict",
            "El cursor no corresponde a los filtros o versión del corpus.",
        )
    return offset


def _fingerprint(filters: dict[str, Any]) -> str:
    return json.dumps(filters, sort_keys=True, separators=(",", ":"))


type PaperEnvironment = Literal[
    "spaceflight", "bed_rest", "terrestrial_exercise", "other", "mixed", "unknown"
]


def _environment(value: str) -> PaperEnvironment:
    environments: dict[str, PaperEnvironment] = {
        "spaceflight": "spaceflight",
        "head_down_bed_rest": "bed_rest",
        "horizontal_bed_rest": "bed_rest",
        "bed_rest": "bed_rest",
    }
    return environments.get(value, "mixed" if "_" in value else "unknown")


def _sections(topics: list[str]) -> list[GraphView]:
    sections: list[GraphView] = []
    if any(
        topic in topics for topic in ("status", "evolution", "measurement_protocol", "mechanisms")
    ):
        sections.append("evidence")
    if any(topic in topics for topic in ("status", "evolution", "population_transfer", "recovery")):
        sections.append("scenario")
    if "countermeasures" in topics:
        sections.append("actions")
    return sections or ["evidence"]


def _paper_card(record: LiteraturePaperRecord) -> PaperCard:
    payload = record.payload
    classification = payload.get("classification", {})
    authors = [author["fullName"] for author in record.authors if author.get("fullName")]
    title_and_abstract = f"{record.title} {record.abstract_text or ''}".lower()
    region_ids = (
        ["quadriceps"]
        if any(term in title_and_abstract for term in ("quadriceps", "vastus lateralis"))
        else []
    )
    indicator_ids = (
        ["quadriceps_csa_relative"]
        if any(
            term in title_and_abstract
            for term in ("cross-sectional area", "cross sectional area", "muscle atrophy")
        )
        else []
    )
    if "torque" in title_and_abstract:
        indicator_ids.append("knee_extension_torque")
    return PaperCard(
        id=record.id,
        title=record.title,
        authors=authors,
        year=record.publication_year,
        identifiers=PaperIdentifiers.model_validate(record.identifiers),
        sections=_sections(classification.get("topics", [])),
        region_ids=region_ids,
        study_design=None,
        environment=_environment(classification.get("environment", "")),
        review_status="reviewed" if record.review_status == "reviewed" else "pending",
        access=PaperAccess(
            landing_url=record.source_url or record.doi_url or "https://europepmc.org",
            full_text_url=record.pmc_url,
            pdf_url=None,
            availability="open_access"
            if payload.get("is_open_access_reported_by_index")
            else "landing_only",
            license=None,
            full_text_cached=False,
            pdf_cached=False,
            local_document_url=None,
        ),
        indicator_ids=indicator_ids,
    )


def get_paper_detail(
    session: Session, paper_id: str, assessment_id: str | None = None
) -> PaperDetail:
    """Return one candidate with explicit non-audited and non-evaluated states."""
    record = session.get(LiteraturePaperRecord, paper_id)
    if record is None:
        raise not_found("el paper")
    validate_assessment(session, assessment_id)
    paper = _paper_card(record)
    abstract = record.abstract_text or None
    analysis, summary = analysis_documents(session, record)
    return PaperDetail(
        paper=paper,
        abstract=abstract,
        summary=summary,
        population_description=None,
        cohort_ids=[],
        cohort_overlap_status="unknown",
        statistics=[],
        limitations=[
            "Registro bibliográfico candidato; no se auditó el texto completo.",
            "No contiene estadísticas extraídas ni una acción habilitada.",
        ],
        corpus_version=record.corpus_version,
        analysis=analysis,
        applicability=PaperApplicability(
            assessment_id=assessment_id,
            status="not_evaluated",
            explanation=(
                "La aplicabilidad contextual aún no está implementada; "
                "la ficha bibliográfica no autoriza una conclusión individual."
            ),
            considered_observation_ids=[],
            checks=[],
            rule_id=None,
            rule_version=None,
            review_status="pending",
        ),
    )


def validate_assessment(session: Session, assessment_id: str | None) -> None:
    """Reject unknown context without inferring individual applicability."""
    if assessment_id is not None and session.get(AssessmentRecord, assessment_id) is None:
        raise not_found("la evaluación")


def matching_papers(
    session: Session,
    *,
    q: str | None,
    region_id: str | None,
    view: str | None,
    review_status: str | None,
    year_from: int | None,
    year_to: int | None,
    indicator_id: str | None,
    module_id: str | None,
    limit: int,
) -> list[tuple[LiteraturePaperRecord, PaperCard]]:
    """Apply the same query, classification and filters to lists and graphs."""
    if limit < 1 or limit > MAX_LIMIT:
        raise _invalid_request("El límite debe estar entre 1 y 100.")
    if year_from is not None and year_to is not None and year_from > year_to:
        raise _invalid_request("year_from no puede ser mayor que year_to.")
    if region_id not in (None, "quadriceps"):
        raise _invalid_request("La región solicitada no está publicada.")
    if indicator_id not in (None, "quadriceps_csa_relative", "knee_extension_torque"):
        raise _invalid_request("El indicador solicitado no está publicado.")
    if module_id not in (None, "quadriceps_health"):
        raise _invalid_request("El módulo solicitado no está publicado.")
    if view not in (None, "evidence", "scenario", "actions"):
        raise _invalid_request("La vista solicitada no es válida.")
    if review_status not in (None, "pending", "reviewed"):
        raise _invalid_request("El estado de revisión solicitado no es válido.")

    normalized_q = q.strip() if q and q.strip() else None
    query = select(LiteraturePaperRecord)
    conditions = []
    if normalized_q:
        term = f"%{normalized_q}%"
        conditions.append(
            or_(
                LiteraturePaperRecord.title.ilike(term),
                LiteraturePaperRecord.abstract_text.ilike(term),
                cast(LiteraturePaperRecord.payload, Text).ilike(term),
            )
        )
    if year_from is not None:
        conditions.append(LiteraturePaperRecord.publication_year >= year_from)
    if year_to is not None:
        conditions.append(LiteraturePaperRecord.publication_year <= year_to)
    if review_status:
        conditions.append(
            LiteraturePaperRecord.review_status
            == ("reviewed" if review_status == "reviewed" else "identified_not_fulltext_audited")
        )
    if conditions:
        query = query.where(*conditions)

    records = session.scalars(
        query.order_by(
            LiteraturePaperRecord.publication_year.desc(), LiteraturePaperRecord.id.asc()
        )
    ).all()
    matches = []
    for record in records:
        card = _paper_card(record)
        if region_id and region_id not in card.region_ids:
            continue
        if indicator_id and indicator_id not in card.indicator_ids:
            continue
        # A thematic module match does not require an extracted measurement.
        if module_id and "quadriceps" not in card.region_ids:
            continue
        if view and view not in card.sections:
            continue
        matches.append((record, card))
    return matches


def search_papers(
    session: Session,
    *,
    q: str | None,
    region_id: str | None,
    view: str | None,
    review_status: str | None,
    year_from: int | None,
    year_to: int | None,
    indicator_id: str | None,
    module_id: str | None,
    cursor: str | None,
    limit: int,
) -> PaperPage:
    """Search candidates with stable ordering and an opaque filter-bound cursor."""
    matches = matching_papers(
        session,
        q=q,
        region_id=region_id,
        view=view,
        review_status=review_status,
        year_from=year_from,
        year_to=year_to,
        indicator_id=indicator_id,
        module_id=module_id,
        limit=limit,
    )
    filters = {
        "q": q.strip() if q else "",
        "region_id": region_id,
        "view": view,
        "review_status": review_status,
        "year_from": year_from,
        "year_to": year_to,
        "indicator_id": indicator_id,
        "module_id": module_id,
    }
    fingerprint = _fingerprint(filters)
    offset = _decode_cursor(cursor, fingerprint) if cursor else 0
    cards = [card for _, card in matches]
    total = len(cards)
    page_records = cards[offset : offset + limit]
    has_more = offset + limit < total
    next_cursor = _encode_cursor(offset + limit, fingerprint) if has_more else None
    return PaperPage(
        corpus_version=CORPUS_VERSION,
        items=page_records,
        total_matching=total,
        page=Page(next_cursor=next_cursor, has_more=has_more),
    )
