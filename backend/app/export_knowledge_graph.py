"""Export the current editorial graph views using local files and no database."""

import argparse
import json
import tempfile
from hashlib import sha256
from pathlib import Path
from typing import Any

from app.catalog import candidate_papers, knowledge_base_metadata
from app.database import LiteraturePaperRecord
from app.knowledge_graph import paper_neighbors, project_graph_page
from app.papers import CORPUS_VERSION, MAX_LIMIT, _fingerprint, _paper_card
from app.schemas import GraphView


def local_records() -> list[LiteraturePaperRecord]:
    """Create transient records for the shared projection without a Session or engine."""
    return sorted(
        [
            LiteraturePaperRecord(
                id=paper["id"],
                title=paper["title"],
                publication_year=int(paper["publication_year"]),
                identifiers=paper["identifiers"],
                authors=paper["authors"],
                abstract_text=paper["abstract_text"],
                source_url=paper.get("source_url"),
                doi_url=paper.get("doi_url"),
                pmc_url=paper.get("pmc_url"),
                review_status=paper["review_status"],
                payload=paper,
            )
            for paper in candidate_papers()
        ],
        key=lambda record: (-record.publication_year, record.id),
    )


def export_graphs(
    output_dir: Path, *, paper_id: str | None = None, page_size: int = 25
) -> dict[str, Any]:
    """Publish complete pages of all three views without overwriting earlier exports."""
    if not 1 <= page_size <= MAX_LIMIT:
        raise ValueError("Page size must be between 1 and 100.")
    metadata = knowledge_base_metadata()
    if metadata.corpus_version != CORPUS_VERSION:
        raise ValueError("Installed corpus version is unsupported by the current graph projection.")
    records = local_records()
    selected = next((record for record in records if record.id == paper_id), None)
    if paper_id is not None and selected is None:
        raise ValueError("Selected paper is not in the installed corpus.")
    cards = [(record, _paper_card(record)) for record in records]
    target = output_dir.resolve()
    if target.exists():
        raise ValueError("Output already exists; choose a new destination.")
    target.parent.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, Any] = {
        "format_version": "editorial-graph-export-1.0",
        "corpus_version": metadata.corpus_version,
        "paper_id": paper_id,
        "page_size": page_size,
        "views": {},
        "files": {},
        "scope": (
            "Editorial topics only, without AI, scientific support/contradiction or "
            "individual applicability. The export uses local source files, not the current "
            "database. Merge page nodes and edges by id within the same corpus version. "
            "Consult the file list for pagination; live cursors require matching persisted data."
        ),
    }
    with tempfile.TemporaryDirectory(prefix=".graph-stage-", dir=target.parent) as temporary:
        stage = Path(temporary) / "graphs"
        stage.mkdir()

        def write_json(name: str, payload: Any) -> None:
            content = (json.dumps(payload, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
            (stage / name).write_bytes(content)
            manifest["files"][name] = {
                "sha256": sha256(content).hexdigest(),
                "size_bytes": len(content),
            }

        write_json("paper-cards.json", [card.model_dump(mode="json") for _, card in cards])
        views: tuple[GraphView, ...] = ("evidence", "scenario", "actions")
        for view in views:
            matches = paper_neighbors(
                [(record, card) for record, card in cards if view in card.sections], selected
            )
            fingerprint = _fingerprint(
                {
                    "q": "",
                    "region_id": None,
                    "view": view,
                    "review_status": None,
                    "year_from": None,
                    "year_to": None,
                    "paper_id": paper_id,
                    "assessment_id": None,
                    "indicator_id": None,
                    "module_id": None,
                }
            )
            filenames = []
            for number, offset in enumerate(range(0, max(1, len(matches)), page_size), start=1):
                page = project_graph_page(
                    matches,
                    view=view,
                    assessment_id=None,
                    offset=offset,
                    limit=page_size,
                    fingerprint=fingerprint,
                )
                filename = f"{view}-{number:03d}.json"
                write_json(filename, page.model_dump(mode="json"))
                filenames.append(filename)
            manifest["views"][view] = {"papers_matching": len(matches), "pages": filenames}
        (stage / "manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        if target.exists():
            raise ValueError("Output appeared during preparation; nothing was overwritten.")
        stage.rename(target)
    return manifest


def main() -> None:
    """Export snapshots for local inspection or frontend fixtures, without HTTP calls."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--paper-id")
    parser.add_argument("--page-size", type=int, default=25)
    args = parser.parse_args()
    try:
        manifest = export_graphs(args.output_dir, paper_id=args.paper_id, page_size=args.page_size)
    except (OSError, ValueError) as error:
        parser.exit(1, f"Graph export failed: {type(error).__name__}.\n")
    for view, data in manifest["views"].items():
        print(f"{view}: {data['papers_matching']} papers, {len(data['pages'])} pages.")
    print(f"Directory: {args.output_dir.resolve()}")


if __name__ == "__main__":
    main()
