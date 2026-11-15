"""Check human review files locally without approving science or changing the corpus."""

import argparse
import json
import tempfile
from collections import Counter
from hashlib import sha256
from pathlib import Path
from typing import Annotated, Any, Literal

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    HttpUrl,
    StringConstraints,
    ValidationError,
    model_validator,
)

from app.audit_literature import inventory

Text = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class ReviewModel(BaseModel):
    """Reject unexpected approval flags and nonfinite numerical results."""

    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)


class ExtractedStatistic(ReviewModel):
    """Keep a reported quantity separate from interpretation and model parameters."""

    outcome: Text
    value: Annotated[float, Field(strict=True)]
    statistic_type: Text
    unit: Text
    group: Text
    timepoint: Text
    source_locator: Text
    notes: Text | None = None


class ContrastSource(ReviewModel):
    """Record a human-provided comparison, without inferring independence."""

    url: HttpUrl
    locator: Text
    finding: Text


class HumanReview(ReviewModel):
    """Distinguish completeness for review from scientific approval."""

    status: Literal["pending", "in_progress", "ready_for_review"]
    reviewer: Text | None
    reviewed_at: AwareDatetime | None
    original_text_locator: Text | None
    population: Text | None
    sample_size_and_groups: Text | None
    environment_and_exposure: Text | None
    measurement_method_region_and_unit: Text | None
    protocol_and_timepoints: Text | None
    results_with_statistics_and_locators: list[ExtractedStatistic]
    limitations: list[Text]
    cohort_mapping_and_overlap: Text | None
    independent_contrast_sources: list[ContrastSource]
    nasa_capability_or_gap_sources: list[ContrastSource]
    applicability_domain_and_exclusions: Text | None
    action_conditions_limits_and_human_owner: Text | None
    decision_and_remaining_questions: Text | None

    @model_validator(mode="after")
    def check_completeness(self) -> "HumanReview":
        if self.status == "ready_for_review":
            fields = type(self).model_fields
            if any(getattr(self, name) is None for name in fields):
                raise ValueError("Ready-for-review entries require every narrative field.")
            for name in (
                "limitations",
                "independent_contrast_sources",
                "nasa_capability_or_gap_sources",
            ):
                if not getattr(self, name):
                    raise ValueError(f"Ready-for-review entries require {name}.")
        return self


class ReviewFileError(ValueError):
    """Report a structural or provenance failure without exposing review contents."""


def validate_review(directory: Path) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """Bind editable review fields to the currently installed source metadata."""
    inventory_bytes = (directory / "inventory.json").read_bytes()
    queue_bytes = (directory / "review-queue.json").read_bytes()
    try:
        submitted_inventory = json.loads(inventory_bytes)
        entries = json.loads(queue_bytes)
        current_inventory, originals = inventory()
        if submitted_inventory != current_inventory:
            raise ReviewFileError("Inventory differs from the currently installed corpus.")
        if not isinstance(entries, list) or len(entries) != len(originals):
            raise ReviewFileError("Review queue must cover exactly the exported corpus.")
        expected = {entry["paper_id"]: entry for entry in originals}
        seen = set()
        checked = []
        counts: Counter[str] = Counter()
        for entry in entries:
            paper_id = entry["paper_id"]
            if paper_id not in expected or paper_id in seen:
                raise ReviewFileError("Unknown or duplicate paper identifier.")
            seen.add(paper_id)
            source_fields = {key: value for key, value in entry.items() if key != "review"}
            original = {key: value for key, value in expected[paper_id].items() if key != "review"}
            if source_fields != original:
                raise ReviewFileError(f"Source metadata changed for {paper_id}; export again.")
            try:
                review = HumanReview.model_validate(entry["review"])
            except ValidationError as error:
                locations = [".".join(map(str, item["loc"])) for item in error.errors()]
                raise ReviewFileError(
                    f"Invalid review for {paper_id}; fields: {', '.join(locations)}."
                ) from None
            counts[review.status] += 1
            checked.append({**source_fields, "review": review.model_dump(mode="json")})
    except (KeyError, TypeError, AttributeError) as error:
        raise ReviewFileError("Review files have an invalid structure.") from error
    receipt = {
        "schema_version": "literature-review-receipt-1.0",
        "corpus_version": current_inventory["corpus_version"],
        "inventory_sha256": sha256(inventory_bytes).hexdigest(),
        "input_queue_sha256": sha256(queue_bytes).hexdigest(),
        "snapshot_queue_sha256": sha256(
            (json.dumps(checked, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        ).hexdigest(),
        "paper_count": len(checked),
        "review_status_counts": dict(sorted(counts.items())),
        "scientific_approval": False,
        "clinical_action_eligible": False,
        "model_parameter_eligible": False,
        "scope": "Structural validation only; no corpus, rule or database update.",
    }
    return receipt, checked


def save_receipt(target: Path, receipt: dict[str, Any], checked: list[dict[str, Any]]) -> None:
    """Store a separate snapshot without overwriting previous submissions."""
    target = target.resolve()
    if target.exists():
        raise ReviewFileError("Output already exists; choose a new destination.")
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".receipt-stage-", dir=target.parent) as temporary:
        stage = Path(temporary) / "receipt"
        stage.mkdir()
        for filename, payload in (("receipt.json", receipt), ("review-queue.json", checked)):
            (stage / filename).write_text(
                json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
        if target.exists():
            raise ReviewFileError("Output appeared during validation; nothing was overwritten.")
        stage.rename(target)


def main() -> None:
    """Validate by default; write only an explicitly requested local snapshot."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    parser.add_argument("--output-dir", type=Path)
    args = parser.parse_args()
    try:
        receipt, checked = validate_review(args.directory)
        if args.output_dir is not None:
            save_receipt(args.output_dir, receipt, checked)
    except (OSError, ValueError) as error:
        message = str(error) if isinstance(error, ReviewFileError) else type(error).__name__
        parser.exit(1, f"Review validation failed: {message}\n")
    print(json.dumps(receipt, indent=2))


if __name__ == "__main__":
    main()
