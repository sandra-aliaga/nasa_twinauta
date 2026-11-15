"""Build non-causal discovery graph pages from the local literature corpus."""

from typing import Any

from sqlalchemy.orm import Session

from app.database import LiteraturePaperRecord
from app.errors import not_found
from app.papers import (
    CORPUS_VERSION,
    _decode_cursor,
    _encode_cursor,
    _fingerprint,
    matching_papers,
    validate_assessment,
)
from app.schemas import (
    GraphCounts,
    GraphPage,
    KnowledgeEdge,
    KnowledgeNode,
    PaperCard,
)


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
    validate_assessment(session, assessment_id)
    selected = session.get(LiteraturePaperRecord, paper_id) if paper_id is not None else None
    if paper_id is not None and selected is None:
        raise not_found("el paper")
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
    normalized_q = q.strip() if q and q.strip() else None
    filters = {
        "q": normalized_q or "",
        "region_id": region_id,
        "view": view,
        "review_status": review_status,
        "year_from": year_from,
        "year_to": year_to,
        "paper_id": paper_id,
        "assessment_id": assessment_id,
        "indicator_id": indicator_id,
        "module_id": module_id,
    }
    fingerprint = _fingerprint(filters)
    offset = _decode_cursor(cursor, fingerprint) if cursor else 0

    matches = paper_neighbors(matches, selected)
    return project_graph_page(
        matches,
        view=view,
        assessment_id=assessment_id,
        offset=offset,
        limit=limit,
        fingerprint=fingerprint,
    )


def paper_neighbors(
    matches: list[tuple[LiteraturePaperRecord, PaperCard]],
    selected: LiteraturePaperRecord | None,
) -> list[tuple[LiteraturePaperRecord, PaperCard]]:
    """Select the seed and shared-topic candidates without inferring causal relations."""
    if selected is None:
        return matches
    selected_topics = set(selected.payload.get("classification", {}).get("topics", []))
    return [
        (record, card)
        for record, card in matches
        if record.id == selected.id
        or selected_topics.intersection(record.payload.get("classification", {}).get("topics", []))
    ]


def project_graph_page(
    matches: list[tuple[LiteraturePaperRecord, PaperCard]],
    *,
    view: str,
    assessment_id: str | None,
    offset: int,
    limit: int,
    fingerprint: str,
) -> GraphPage:
    """Project already-filtered candidates identically for live and local consumers."""
    cards = [card for _, card in matches]
    total = len(cards)
    page_cards = cards[offset : offset + limit]
    page_ids = {card.id for card in page_cards}
    page_records = [record for record, _ in matches if record.id in page_ids]
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
