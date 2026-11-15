"""Prepare selected local abstracts with explicit execution, reuse and per-paper progress."""

import argparse
import json
from datetime import UTC, datetime
from hashlib import sha256
from pathlib import Path
from typing import Any, NotRequired, TypedDict

from app.analysis import validate_draft
from app.analysis_providers import (
    PROMPT_VERSION,
    REUSABLE_PROMPT_VERSIONS,
    AnalysisDraft,
    HTTPAnalysisProvider,
    ProviderError,
)
from app.catalog import candidate_papers, knowledge_base_metadata
from app.config import get_settings
from app.prepare_context import write_document


class PreparationRecord(TypedDict):
    paper_id: str
    status: str
    usage: dict[str, int]
    failure_reason: NotRequired[str]


class AbstractManifest(TypedDict):
    status: str
    corpus_version: str
    model_id: str
    prompt_version: str
    maximum_calls: int
    calls_attempted: int
    review_status: str
    clinical_action_eligible: bool
    records: list[PreparationRecord]
    started_at: NotRequired[str]
    finished_at: NotRequired[str]
    reported_usage: NotRequired[dict[str, int]]


def cached_paper(
    paper: dict[str, Any], directories: list[Path], model_id: str
) -> dict[str, Any] | None:
    """Reuse only matching current inputs whose generated excerpts still validate."""
    digest = sha256(paper["abstract_text"].encode()).hexdigest()
    for directory in directories:
        path = directory / f"{paper['id']}.json"
        if not path.is_file():
            continue
        cached = json.loads(path.read_bytes())
        if (
            cached.get("paper_id") != paper["id"]
            or cached.get("input_sha256") != digest
            or cached.get("abstract") != paper["abstract_text"]
            or cached.get("model_id") != model_id
            or cached.get("prompt_version") not in REUSABLE_PROMPT_VERSIONS
        ):
            continue
        draft = AnalysisDraft.model_validate(cached["analysis"])
        validate_draft(draft, paper["abstract_text"])
        return {**cached, "reused_from": str(path), "charged_in_this_run": False}
    return None


def prepare_abstracts(
    paper_ids: list[str], output_dir: Path, reuse_dirs: list[Path], *, execute: bool
) -> AbstractManifest:
    """Process each requested paper once, preserving failures without automatic retries."""
    corpus = {paper["id"]: paper for paper in candidate_papers()}
    if (
        not paper_ids
        or len(paper_ids) != len(set(paper_ids))
        or not set(paper_ids).issubset(corpus)
    ):
        raise ValueError("Select distinct identifiers from the installed corpus.")
    provider = HTTPAnalysisProvider(get_settings())
    model_id = f"{provider.provider_id}/{provider.model}"
    records: list[PreparationRecord] = []
    cached = {}
    for paper_id in paper_ids:
        paper = corpus[paper_id]
        if not paper["abstract_text"]:
            status = "skipped_no_abstract"
        else:
            reuse = cached_paper(paper, reuse_dirs, model_id)
            status = "reused" if reuse else "pending"
            if reuse:
                cached[paper_id] = reuse
        records.append({"paper_id": paper_id, "status": status, "usage": {}})
    manifest: AbstractManifest = {
        "status": "preview",
        "corpus_version": knowledge_base_metadata().corpus_version,
        "model_id": model_id,
        "prompt_version": PROMPT_VERSION,
        "maximum_calls": sum(record["status"] == "pending" for record in records),
        "calls_attempted": 0,
        "review_status": "pending",
        "clinical_action_eligible": False,
        "records": records,
    }
    if not execute:
        return manifest
    if (
        not provider.settings.analysis_api_key
        or not provider.settings.analysis_api_key.get_secret_value().strip()
    ):
        raise ValueError("Configure the private API key before execution.")
    output_dir.mkdir(parents=True, exist_ok=False)
    manifest.update(status="running", started_at=datetime.now(UTC).isoformat())
    write_document(output_dir / "manifest.json", manifest)
    consecutive_failures = 0
    for record in records:
        paper_id = record["paper_id"]
        if record["status"] == "skipped_no_abstract":
            continue
        if record["status"] == "reused":
            write_document(output_dir / f"{paper_id}.json", cached[paper_id])
            continue
        paper = corpus[paper_id]
        record["status"] = "running"
        manifest["calls_attempted"] += 1
        write_document(output_dir / "manifest.json", manifest)
        try:
            draft = provider.analyze(paper_id=paper_id, text=paper["abstract_text"])
            validate_draft(draft, paper["abstract_text"])
            prepared = {
                "paper_id": paper_id,
                "title": paper["title"],
                "abstract": paper["abstract_text"],
                "input_sha256": sha256(paper["abstract_text"].encode()).hexdigest(),
                "model_id": model_id,
                "prompt_version": PROMPT_VERSION,
                "review_status": "pending",
                "usage": provider.last_usage,
                "charged_in_this_run": True,
                "analysis": draft.model_dump(mode="json"),
            }
            write_document(output_dir / f"{paper_id}.json", prepared)
            record["status"] = "ready"
            consecutive_failures = 0
        except KeyboardInterrupt:
            record["status"] = "interrupted_usage_unknown"
            manifest["status"] = "stopped_interrupted"
            write_document(output_dir / "manifest.json", manifest)
            break
        except (ProviderError, ValueError) as error:
            record["status"] = "failed"
            consecutive_failures += 1
            record["failure_reason"] = (
                str(error) if isinstance(error, ProviderError) else type(error).__name__
            )
            if consecutive_failures >= 3 or (
                isinstance(error, ProviderError)
                and any(f"HTTP {status}" in str(error) for status in (401, 402, 403, 429))
            ):
                record["usage"] = provider.last_usage
                manifest["status"] = (
                    "stopped_repeated_failures"
                    if consecutive_failures >= 3
                    else "stopped_provider_error"
                )
                write_document(output_dir / "manifest.json", manifest)
                break
        record["usage"] = provider.last_usage
        write_document(output_dir / "manifest.json", manifest)
        print(f"{paper_id}: {record['status']}", flush=True)
    if manifest["status"] == "running":
        manifest["status"] = (
            "completed_with_failures"
            if any(r["status"] == "failed" for r in records)
            else "ready_for_review"
        )
    manifest["finished_at"] = datetime.now(UTC).isoformat()
    manifest["reported_usage"] = {
        key: sum(record["usage"].get(key, 0) for record in records)
        for key in ("prompt_tokens", "completion_tokens", "total_tokens")
    }
    write_document(output_dir / "manifest.json", manifest)
    return manifest


def main() -> None:
    """Preview by default; an explicit flag authorizes one call per pending abstract."""
    parser = argparse.ArgumentParser(description=__doc__)
    selection = parser.add_mutually_exclusive_group(required=True)
    selection.add_argument("--all", action="store_true")
    selection.add_argument("--paper-id", nargs="+")
    parser.add_argument("--reuse-dir", action="append", type=Path, default=[])
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    paper_ids = [paper["id"] for paper in candidate_papers()] if args.all else args.paper_id
    try:
        manifest = prepare_abstracts(
            paper_ids, args.output_dir, args.reuse_dir, execute=args.execute
        )
    except (OSError, ValueError, KeyError) as error:
        parser.exit(1, f"Preparation unavailable: {type(error).__name__}.\n")
    print(json.dumps(manifest, indent=2))
    if manifest["status"] not in {"preview", "ready_for_review"}:
        parser.exit(1, "Review recorded failures; no automatic retry was performed.\n")


if __name__ == "__main__":
    main()
