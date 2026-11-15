"""Load packaged cases and recordings independently of contract examples."""

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from pydantic import TypeAdapter

from app.config import BACKEND_DIR, get_settings
from app.errors import not_found
from app.recordings import PHYSIONET_RECORDING_ID, physionet_recording
from app.schemas import (
    Assessment,
    Case,
    IndicatorDefinition,
    KnowledgeBaseMetadata,
    ModuleCatalog,
    Region,
    TelemetryPoint,
    TelemetryRecording,
    TelemetryWindow,
)
from app.scientific_bundle import ScientificBundle

DATA_DIR = BACKEND_DIR / "data" / "demo"
LITERATURE_DIR = BACKEND_DIR / "data" / "literature" / "candidates"


def read_document(filename: str, directory: Path = DATA_DIR) -> Any:
    """Read one trusted packaged JSON document."""
    return json.loads((directory / filename).read_text(encoding="utf-8"))


def read_literature_document(filename: str) -> Any:
    """Read one versioned local literature document."""
    bundle = configured_bundle()
    if bundle is not None:
        return bundle.document(filename)
    return read_document(filename, LITERATURE_DIR)


@lru_cache
def configured_bundle() -> ScientificBundle | None:
    """Validate an explicitly configured package once; never silently fall back."""
    path = get_settings().scientific_bundle_path
    return ScientificBundle(path) if path is not None else None


@lru_cache
def indicators() -> tuple[IndicatorDefinition, ...]:
    """Return the initial indicator catalog."""
    bundle = configured_bundle()
    document = bundle.document("indicators.json") if bundle else read_document("indicators.json")
    return tuple(TypeAdapter(list[IndicatorDefinition]).validate_python(document))


@lru_cache
def health_modules() -> ModuleCatalog:
    """Return the versioned catalog without enabling unreviewed interpretation."""
    bundle = configured_bundle()
    if bundle is not None:
        return ModuleCatalog.model_validate(bundle.document("health-modules.json"))
    return ModuleCatalog.model_validate(read_document("health-modules.json"))


@lru_cache
def knowledge_base_metadata() -> KnowledgeBaseMetadata:
    """Describe the installed candidate corpus without promoting its evidence."""
    metadata = read_literature_document("knowledge_base.json")
    result = KnowledgeBaseMetadata.model_validate(metadata)
    corpus = read_literature_document("corpus.json")
    selected_count = corpus.get("selected_count")
    if selected_count != result.paper_count:
        raise ValueError("Knowledge-base metadata does not match the installed corpus.")
    if result.reviewed_paper_count > result.paper_count:
        raise ValueError("Reviewed paper count cannot exceed the installed corpus size.")
    return result


@lru_cache
def candidate_papers() -> tuple[dict[str, Any], ...]:
    """Return candidate records exactly as imported from the local corpus."""
    corpus = read_literature_document("corpus.json")
    return tuple(corpus["records"])


@lru_cache
def recording(recording_id: str = "recording_illustrative_001") -> TelemetryRecording:
    """Resolve metadata without attaching terrestrial data to the virtual case."""
    if recording_id == PHYSIONET_RECORDING_ID:
        return physionet_recording()[0]
    metadata = TelemetryRecording.model_validate(read_document("recording-metadata.json"))
    if recording_id != metadata.recording_id:
        raise not_found("la grabación")
    return metadata


@lru_cache
def telemetry() -> TelemetryWindow:
    """Return the small synthetic signal used for initial integration."""
    return TelemetryWindow.model_validate(read_document("telemetry.json"))


def telemetry_points(recording_id: str) -> tuple[TelemetryPoint, ...]:
    """Return all samples internally; API responses still enforce window limits."""
    if recording_id == PHYSIONET_RECORDING_ID:
        return physionet_recording()[1]
    recording(recording_id)
    return tuple(telemetry().points)


def demo_payload() -> dict[str, Any]:
    """Validate and assemble the case inserted by the explicit seed command."""
    case = Case.model_validate(read_document("cases.json")[0])
    regions = TypeAdapter(list[Region]).validate_python(read_document("regions.json"))
    assessment = Assessment.model_validate(read_document("assessment.json"))
    return {
        "case": case.model_dump(mode="json"),
        "regions": [region.model_dump(mode="json") for region in regions],
        "observations": [item.model_dump(mode="json") for item in assessment.observations],
        "exercise_records": [item.model_dump(mode="json") for item in assessment.exercise_records],
        "sources": [item.model_dump(mode="json") for item in assessment.sources],
        "claims": [item.model_dump(mode="json") for item in assessment.claims],
    }
