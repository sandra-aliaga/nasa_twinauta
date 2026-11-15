"""Import prepared summaries without model calls or automatic schema changes."""

import argparse
import json
from hashlib import sha256
from pathlib import Path
from typing import Any
from uuid import NAMESPACE_URL, uuid5

from pydantic import AwareDatetime, TypeAdapter
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.analysis import validate_draft
from app.analysis_providers import REUSABLE_PROMPT_VERSIONS, AnalysisDraft
from app.catalog import candidate_papers, knowledge_base_metadata
from app.config import get_settings
from app.database import LiteratureAnalysisRecord, LiteraturePaperRecord, create_database_engine
from app.schemas import PaperAnalysisItem, PaperSummary


def load_prepared(directory: Path) -> list[dict[str, Any]]:
    """Validate all selected source files before opening a database transaction."""
    manifest = json.loads((directory / "manifest.json").read_bytes())
    if manifest.get("status") != "ready_for_review":
        raise ValueError("Select a completed preparation batch.")
    if manifest.get("corpus_version") != knowledge_base_metadata().corpus_version:
        raise ValueError("Preparation belongs to a different corpus.")
    if manifest.get("clinical_action_eligible") is not False:
        raise ValueError("Preparation must not authorize clinical actions.")
    generated_at = TypeAdapter(AwareDatetime).validate_python(manifest["finished_at"])
    corpus = {paper["id"]: paper for paper in candidate_papers()}
    seen = set()
    prepared = []
    for entry in manifest["records"]:
        paper_id = entry["paper_id"]
        if paper_id not in corpus or paper_id in seen:
            raise ValueError("Unknown or duplicate paper in the preparation manifest.")
        seen.add(paper_id)
        paper = corpus[paper_id]
        if entry["status"] == "skipped_no_abstract" and not paper["abstract_text"]:
            continue
        if entry["status"] not in {"ready", "reused"}:
            raise ValueError("Preparation contains unfinished or invalid entries.")
        document = json.loads((directory / f"{paper_id}.json").read_bytes())
        digest = sha256((paper["abstract_text"] or "").encode()).hexdigest()
        if (
            document.get("paper_id") != paper_id
            or document.get("input_sha256") != digest
            or document.get("abstract") != paper["abstract_text"]
            or document.get("prompt_version") not in REUSABLE_PROMPT_VERSIONS
            or document.get("review_status") != "pending"
        ):
            raise ValueError("Prepared analysis does not match the current source/provenance.")
        model_id = document.get("model_id")
        if not isinstance(model_id, str) or not model_id.strip() or len(model_id) > 200:
            raise ValueError("Preparation must identify its model.")
        draft = AnalysisDraft.model_validate(document["analysis"])
        validate_draft(draft, paper["abstract_text"])
        identity = {
            "paper_id": paper_id,
            "input_sha256": digest,
            "model_id": model_id,
            "prompt_version": document["prompt_version"],
            "analysis": draft.model_dump(),
        }
        record_id = str(uuid5(NAMESPACE_URL, json.dumps(identity, sort_keys=True)))
        prepared.append(
            {
                "id": record_id,
                "paper_id": paper_id,
                "input_basis": "abstract",
                "input_sha256": digest,
                "prompt_version": document["prompt_version"],
                "model_id": model_id,
                "status": "ready",
                "generated_at": generated_at,
                "items": [
                    PaperAnalysisItem(
                        id=f"{paper_id}:{record_id}:{index}",
                        kind=item.kind,
                        text=item.text,
                        source_locator="abstract",
                        source_excerpt=item.source_excerpt,
                        review_status="pending",
                        limitations=["Contenido preparado a partir del abstract."],
                    ).model_dump(mode="json")
                    for index, item in enumerate(draft.items)
                ],
                "summary": PaperSummary(
                    status="available",
                    text=draft.summary,
                    basis="abstract",
                    method="llm_assisted",
                    review_status="pending",
                    source_locators=["abstract: " + draft.summary_excerpt],
                    limitations=[
                        "Síntesis de abstract; la aplicabilidad individual se evalúa por separado.",
                        "La fecha registrada corresponde al cierre del lote de preparación.",
                    ],
                ).model_dump(mode="json"),
                "failure_reason": None,
            }
        )
    return prepared


def import_prepared(
    session: Session, prepared: list[dict[str, Any]], corpus_version: str
) -> dict[str, int]:
    """Stage an atomic, idempotent import; the caller owns commit/rollback."""
    imported = reused = 0
    for values in prepared:
        paper = session.get(
            LiteraturePaperRecord, values["paper_id"], with_for_update={"read": True}
        )
        if (
            paper is None
            or paper.corpus_version != corpus_version
            or sha256((paper.abstract_text or "").encode()).hexdigest() != values["input_sha256"]
        ):
            raise ValueError("Database paper differs from the selected prepared source.")
        result = session.execute(
            insert(LiteratureAnalysisRecord)
            .values(**values)
            .on_conflict_do_nothing(index_elements=[LiteratureAnalysisRecord.id])
            .returning(LiteratureAnalysisRecord.id)
        )
        if result.scalar_one_or_none() is not None:
            imported += 1
        else:
            reused += 1
    return {"imported": imported, "already_present": reused}


def main() -> None:
    """Preview files by default; only --execute writes to a migrated database."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    engine = None
    try:
        prepared = load_prepared(args.directory)
        result = {"status": "preview", "papers": len(prepared), "provider_calls": 0}
        if args.execute:
            engine = create_database_engine(get_settings())
            with Session(engine) as session, session.begin():
                result = {
                    **result,
                    "status": "imported",
                    **import_prepared(session, prepared, knowledge_base_metadata().corpus_version),
                }
    except (OSError, ValueError, KeyError, TypeError, SQLAlchemyError) as error:
        parser.exit(1, f"Import unavailable: {type(error).__name__}; no automatic migration.\n")
    finally:
        if engine is not None:
            engine.dispose()
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
