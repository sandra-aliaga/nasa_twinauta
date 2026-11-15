"""Run a bounded local pilot: explicit abstracts followed by one case synthesis."""

import argparse
import json
from datetime import UTC, datetime
from hashlib import sha256
from pathlib import Path

from app.analysis import validate_draft
from app.analysis_providers import (
    PROMPT_VERSION,
    REUSABLE_PROMPT_VERSIONS,
    AnalysisDraft,
    HTTPAnalysisProvider,
    ProviderError,
)
from app.catalog import candidate_papers, health_modules, indicators, knowledge_base_metadata
from app.config import BACKEND_DIR, get_settings
from app.context_synthesis import synthesize_context
from app.guidance import build_guidance
from app.schemas import Assessment


def write_document(path: Path, document: dict) -> None:
    """Write preparation state without credentials or raw HTTP responses."""
    path.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def prepare(
    assessment_path: Path,
    paper_ids: list[str],
    output_dir: Path,
    *,
    execute: bool,
    prepared_papers_dir: Path | None = None,
) -> dict:
    """Allow at most three abstract calls and one synthesis; never retry automatically."""
    if not paper_ids or len(paper_ids) > 3 or len(set(paper_ids)) != len(paper_ids):
        raise ValueError("Select one to three distinct papers for this pilot.")
    assessment = Assessment.model_validate_json(assessment_path.read_bytes())
    corpus = {paper["id"]: paper for paper in candidate_papers()}
    if any(
        paper_id not in corpus or not corpus[paper_id]["abstract_text"] for paper_id in paper_ids
    ):
        raise ValueError("Every selected paper must exist and have an abstract.")
    guidance = build_guidance(
        assessment,
        health_modules(),
        knowledge_base_metadata().corpus_version,
        {item.id: item.label for item in indicators()},
    )
    if guidance.corpus_version is None:
        raise ValueError("This assessment does not have a supported contextual module.")
    manifest = {
        "status": "preview",
        "assessment_id": assessment.assessment_id,
        "paper_ids": paper_ids,
        "maximum_calls": 1 if prepared_papers_dir is not None else len(paper_ids) + 1,
        "calls_attempted": 0,
        "review_status": "pending",
        "clinical_action_eligible": False,
        "corpus_version": guidance.corpus_version,
        "files": [],
        "reused_papers": [],
    }
    if not execute:
        return manifest
    settings = get_settings()
    if not settings.analysis_api_key or not settings.analysis_api_key.get_secret_value().strip():
        raise ValueError("Configure ANALYSIS_API_KEY in the private backend environment.")
    provider = HTTPAnalysisProvider(settings)
    output_dir.mkdir(parents=True, exist_ok=False)
    manifest.update(
        status="running",
        started_at=datetime.now(UTC).isoformat(),
        model_id=f"{provider.provider_id}/{provider.model}",
    )
    write_document(output_dir / "manifest.json", manifest)
    papers = []
    try:
        for paper_id in paper_ids:
            paper = corpus[paper_id]
            usage = {}
            analysis_prompt_version = PROMPT_VERSION
            if prepared_papers_dir is not None:
                cached = json.loads((prepared_papers_dir / f"{paper_id}.json").read_bytes())
                if (
                    cached.get("paper_id") != paper_id
                    or cached.get("input_sha256")
                    != sha256(paper["abstract_text"].encode()).hexdigest()
                    or cached.get("model_id") != manifest["model_id"]
                    or cached.get("prompt_version") not in REUSABLE_PROMPT_VERSIONS
                    or cached.get("abstract") != paper["abstract_text"]
                ):
                    raise ValueError(
                        "Prepared paper differs from the current source or configuration."
                    )
                draft = AnalysisDraft.model_validate(cached["analysis"])
                analysis_prompt_version = cached["prompt_version"]
                manifest["reused_papers"].append(paper_id)
            else:
                manifest["calls_attempted"] += 1
                write_document(output_dir / "manifest.json", manifest)
                draft = provider.analyze(paper_id=paper_id, text=paper["abstract_text"])
                usage = provider.last_usage
            validate_draft(draft, paper["abstract_text"])
            prepared = {
                "paper_id": paper_id,
                "title": paper["title"],
                "abstract": paper["abstract_text"],
                "input_sha256": sha256(paper["abstract_text"].encode()).hexdigest(),
                "prompt_version": analysis_prompt_version,
                "review_status": "pending",
                "model_id": manifest["model_id"],
                "usage": usage,
                "reused_from": str(prepared_papers_dir)
                if prepared_papers_dir is not None
                else None,
                "analysis": draft.model_dump(mode="json"),
            }
            filename = f"{paper_id}.json"
            write_document(output_dir / filename, prepared)
            manifest["files"].append(filename)
            papers.append(prepared)
        manifest["calls_attempted"] += 1
        write_document(output_dir / "manifest.json", manifest)
        result = synthesize_context(provider, assessment, guidance, papers)
        write_document(output_dir / "context.json", result)
        manifest["files"].append("context.json")
        manifest["status"] = "ready_for_review"
    except (ProviderError, ValueError, OSError) as error:
        manifest["status"] = "failed"
        manifest["failure_reason"] = (
            str(error) if isinstance(error, ProviderError) else type(error).__name__
        )
        manifest["last_call_usage"] = provider.last_usage
    manifest["finished_at"] = datetime.now(UTC).isoformat()
    write_document(output_dir / "manifest.json", manifest)
    return manifest


def main() -> None:
    """Preview by default; explicit execution makes paid calls and saves local drafts."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--assessment", type=Path, default=BACKEND_DIR / "data/demo/assessment.json"
    )
    parser.add_argument("--paper-id", nargs="+", required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--execute", action="store_true")
    parser.add_argument("--prepared-papers-dir", type=Path)
    args = parser.parse_args()
    try:
        manifest = prepare(
            args.assessment,
            args.paper_id,
            args.output_dir,
            execute=args.execute,
            prepared_papers_dir=args.prepared_papers_dir,
        )
    except (OSError, ValueError) as error:
        parser.exit(1, f"Preparation unavailable: {type(error).__name__}. No automatic retry.\n")
    print(json.dumps(manifest, indent=2))
    if manifest["status"] == "failed":
        parser.exit(1, "Pilot failed; saved available progress. No automatic retry.\n")


if __name__ == "__main__":
    main()
