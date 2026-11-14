"""Build non-causal discovery graph pages from the local literature corpus."""

from typing import Any

from sqlalchemy import cast, or_, select
from sqlalchemy.orm import Session

from app.database import LiteraturePaperRecord
from app.errors import DomainError, not_found
from app.papers import (
    CORPUS_VERSION,
    MAX_LIMIT,
    _decode_cursor,
    _encode_cursor,
    _fingerprint,
    _paper_card,
)
from app.schemas import (
    GraphCounts,
    GraphPage,
    KnowledgeEdge,
    KnowledgeNode,
)


def _validate_filters(
    region_id: str | None,
    view: str,
    review_status: str | None,
    year_from: int | None,
    year_to: int | None,
    indicator_id: str | None,
    module_id: str | None,
    limit: int,
) -> None:
    if limit < 1 or limit > MAX_LIMIT:
        raise DomainError(422, "invalid_request", "El límite debe estar entre 1 y 100.")
    if year_from is not None and year_to is not None and year_from > year_to:
        raise DomainError(422, "invalid_request", "year_from no puede ser mayor que year_to.")
    if region_id not in (None, "quadriceps"):
        raise DomainError(422, "invalid_request", "La región solicitada no está publicada.")
    if indicator_id not in (None, "quadriceps_csa_relative", "knee_extension_torque"):
        raise DomainError(422, "invalid_request", "El indicador solicitado no está publicado.")
    if module_id not in (None, "quadriceps_health"):
        raise DomainError(422, "invalid_request", "El módulo solicitado no está publicado.")
    if view not in ("evidence", "scenario", "actions"):
        raise DomainError(422, "invalid_request", "La vista solicitada no es válida.")
    if review_status not in (None, "pending", "reviewed"):
        raise DomainError(422, "invalid_request", "El estado de revisión solicitado no es válido.")


def _topic_nodes_and_edges(
    records: list[LiteraturePaperRecord],
) -> tuple[list[KnowledgeNode], list[KnowledgeEdge]]:
    topics: dict[str, KnowledgeNode] = {}
    edges: list[KnowledgeEdge] = []
    for record in records:
        classification: dict[str, Any] = record.payload.get("classification", {})
        for topic in classification.get("topics", []):
            topic_id = f"topic:{topic}"
            topics.setdefault(
                topic_id,
                KnowledgeNode(
                    id=topic_id,
                    kind="topic",
                    label=topic,
                    paper_id=None,
                    entity_id=None,
                    review_status="pending",
                ),
            )
            edges.append(
                KnowledgeEdge(
                    id=f"edge:{record.id}:{topic}",
                    source=record.id,
                    target=topic_id,
                    relation="addresses",
                    basis="editorial_classification",
                    source_paper_ids=[record.id],
                    source_locators=["classification.topics"],
                    review_status="pending",
                )
            )
    return list(topics.values()), edges


def get_knowledge_graph(
    session: Session,
    *,
    q: str | None,
    region_id: str | None,
    view: str,
    review_status: str | None,
    year_from: int | None,
    year_to: int | None,
    paper_id: str | None,
    assessment_id: str | None,
    cursor: str | None,
    limit: int,
    indicator_id: str | None,
    module_id: str | None,
) -> GraphPage:
    """Return a paginated graph of bibliographic candidates and editorial topics."""
    _validate_filters(
        region_id, view, review_status, year_from, year_to, indicator_id, module_id, limit
    )
    normalized_q = q.strip() if q and q.strip() else None
    filters = {
        "q": normalized_q or "",
        "region_id": region_id,
        "view": view,
        "review_status": review_status,
        "year_from": year_from,
        "year_to": year_to,
        "paper_id": paper_id,
        "indicator_id": indicator_id,
        "module_id": module_id,
    }
    fingerprint = _fingerprint(filters)
    offset = _decode_cursor(cursor, fingerprint) if cursor else 0

    query = select(LiteraturePaperRecord)
    conditions = []
    if normalized_q:
        term = f"%{normalized_q}%"
        conditions.append(
            or_(
                LiteraturePaperRecord.title.ilike(term),
                LiteraturePaperRecord.abstract_text.ilike(term),
                cast(LiteraturePaperRecord.payload, str).ilike(term),
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
    if paper_id and not any(record.id == paper_id for record in records):
        if session.get(LiteraturePaperRecord, paper_id) is None:
            raise not_found("el paper")
    cards = [_paper_card(record) for record in records]
    if region_id:
        cards = [card for card in cards if region_id in card.region_ids]
    if indicator_id:
        cards = [card for card in cards if indicator_id in card.indicator_ids]
    if module_id:
        cards = [card for card in cards if "quadriceps" in card.region_ids]
    if view:
        cards = [card for card in cards if view in card.sections]
    eligible_ids = {card.id for card in cards}
    if paper_id:
        selected = next((record for record in records if record.id == paper_id), None)
        if selected is not None:
            selected_topics = set(selected.payload.get("classification", {}).get("topics", []))
            records = [
                record
                for record in records
                if record.id in eligible_ids
                and (
                    record.id == paper_id
                    or selected_topics.intersection(
                        record.payload.get("classification", {}).get("topics", [])
                    )
                )
            ]
            cards = [_paper_card(record) for record in records]
    total = len(cards)
    page_cards = cards[offset : offset + limit]
    page_ids = {card.id for card in page_cards}
    page_records = [record for record in records if record.id in page_ids]
    topic_nodes, topic_edges = _topic_nodes_and_edges(page_records)
    paper_nodes = [
        KnowledgeNode(
            id=card.id,
            kind="paper",
            label=card.title,
            paper_id=card.id,
            entity_id=None,
            review_status=card.review_status,
        )
        for card in page_cards
    ]
    has_more = offset + limit < total
    next_cursor = _encode_cursor(offset + limit, fingerprint) if has_more else None
    return GraphPage(
        corpus_version=CORPUS_VERSION,
        assessment_id=assessment_id,
        view=view,
        nodes=paper_nodes + topic_nodes,
        edges=topic_edges,
        page={"next_cursor": next_cursor, "has_more": has_more},
        scope_description=(
            "Relaciones temáticas editoriales del corpus candidato; no representan "
            "respaldo científico, causalidad ni independencia de cohortes."
        ),
        counts=GraphCounts(
            papers_matching=total,
            papers_returned=len(page_cards),
            papers_reviewed_returned=sum(card.review_status == "reviewed" for card in page_cards),
        ),
    )
