"""Export a local bibliographic inventory and an unfilled human review queue."""

import argparse
import csv
import json
import tempfile
from collections import defaultdict
from hashlib import sha256
from pathlib import Path
from typing import Any

from app.catalog import candidate_papers, knowledge_base_metadata


def duplicate_identifiers(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Flag exact normalized identifiers without merging papers or cohorts."""
    groups: dict[tuple[str, str], list[str]] = defaultdict(list)
    for paper in records:
        for kind in ("pmid", "pmcid", "doi"):
            value = paper["identifiers"].get(kind)
            if value and value.strip():
                groups[(kind, value.strip().casefold())].append(paper["id"])
    return [
        {"identifier_type": kind, "normalized_value": value, "paper_ids": ids}
        for (kind, value), ids in sorted(groups.items())
        if len(ids) > 1
    ]


def review_entry(paper: dict[str, Any]) -> dict[str, Any]:
    """Retain indexed context separately from fields requiring original-text review."""
    abstract = paper.get("abstract_text") or ""
    issues = []
    if not abstract.strip():
        issues.append("abstract_missing")
    if not any(paper["identifiers"].get(key) for key in ("doi", "pmid", "pmcid")):
        issues.append("persistent_identifier_missing")
    provenance = paper.get("provenance", {})
    if not provenance.get("original_records"):
        issues.append("original_record_locator_missing")
    if not provenance.get("retrieved_at"):
        issues.append("retrieval_date_missing")
    family = paper.get("cohort_independence", {}).get("check_family")
    return {
        "paper_id": paper["id"],
        "title": paper["title"],
        "identifiers": paper["identifiers"],
        "source_url": paper.get("source_url"),
        "full_text_url_from_index": paper.get("pmc_url"),
        "abstract_available": bool(abstract.strip()),
        "abstract_sha256": sha256(abstract.encode()).hexdigest() if abstract.strip() else None,
        "metadata_issues": issues,
        "indexed_classification_unreviewed": paper.get("classification", {}),
        "cohort_family_to_check": family,
        "source_review_status": paper["review_status"],
        "review": {
            "status": "pending",
            "reviewer": None,
            "reviewed_at": None,
            "original_text_locator": None,
            "population": None,
            "sample_size_and_groups": None,
            "environment_and_exposure": None,
            "measurement_method_region_and_unit": None,
            "protocol_and_timepoints": None,
            "results_with_statistics_and_locators": [],
            "limitations": [],
            "cohort_mapping_and_overlap": None,
            "independent_contrast_sources": [],
            "nasa_capability_or_gap_sources": [],
            "applicability_domain_and_exclusions": None,
            "action_conditions_limits_and_human_owner": None,
            "decision_and_remaining_questions": None,
        },
    }


def inventory() -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """Describe installed metadata; do not infer scientific or clinical validity."""
    papers = sorted(candidate_papers(), key=lambda paper: paper["id"])
    entries = [review_entry(paper) for paper in papers]
    families: dict[str, list[str]] = defaultdict(list)
    for entry in entries:
        if entry["cohort_family_to_check"]:
            families[entry["cohort_family_to_check"]].append(entry["paper_id"])
    report = {
        "schema_version": "literature-review-preparation-1.0",
        "corpus_version": knowledge_base_metadata().corpus_version,
        "paper_count": len(entries),
        "abstract_available_count": sum(entry["abstract_available"] for entry in entries),
        "papers_with_metadata_issues": sum(bool(entry["metadata_issues"]) for entry in entries),
        "duplicate_identifier_groups": duplicate_identifiers(papers),
        "cohort_families_to_check": dict(sorted(families.items())),
        "scope": (
            "Local metadata inventory only. Cohort families are review queues, not proof "
            "of shared participants or independence. Links do not prove local document "
            "availability. No review, eligibility or database state is changed."
        ),
    }
    return report, entries


def export_review(output_dir: Path) -> dict[str, Any]:
    """Publish a new directory and preserve all previous exports and source files."""
    target = output_dir.resolve()
    if target.exists():
        raise ValueError("Output already exists; choose a new destination.")
    report, entries = inventory()
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".review-stage-", dir=target.parent) as temporary:
        stage = Path(temporary) / "review"
        stage.mkdir()
        for filename, payload in (("inventory.json", report), ("review-queue.json", entries)):
            (stage / filename).write_text(
                json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
        with (stage / "review-queue.csv").open("w", encoding="utf-8", newline="") as stream:
            columns = [
                "paper_id",
                "abstract_available",
                "metadata_issues",
                "cohort_family_to_check",
                "source_url",
                "full_text_url_from_index",
            ]
            writer = csv.DictWriter(stream, fieldnames=columns)
            writer.writeheader()
            for entry in entries:
                row = {key: entry[key] for key in columns}
                row["metadata_issues"] = ";".join(entry["metadata_issues"])
                writer.writerow(row)
        if target.exists():
            raise ValueError("Output appeared during preparation; nothing was overwritten.")
        stage.rename(target)
    return report


def main() -> None:
    """Prepare human review material without network, database or model calls."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    try:
        report = export_review(args.output_dir)
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.exit(1, f"Review preparation failed: {type(error).__name__}.\n")
    print(
        f"Prepared {report['paper_count']} papers; "
        f"{report['abstract_available_count']} abstracts available. No scientific review performed."
    )
    print(f"Directory: {args.output_dir.resolve()}")


if __name__ == "__main__":
    main()
