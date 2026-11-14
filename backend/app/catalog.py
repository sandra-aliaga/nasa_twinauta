"""Load packaged cases and recordings independently of contract examples."""

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from pydantic import TypeAdapter

from app.config import BACKEND_DIR
from app.errors import not_found
from app.recordings import PHYSIONET_RECORDING_ID, physionet_recording
from app.schemas import (
    Assessment,
    Case,
    IndicatorDefinition,
    Region,
    TelemetryPoint,
    TelemetryRecording,
    TelemetryWindow,
)

DATA_DIR = BACKEND_DIR / "data" / "demo"


def read_document(filename: str, directory: Path = DATA_DIR) -> Any:
    """Read one trusted packaged JSON document."""
    return json.loads((directory / filename).read_text(encoding="utf-8"))


@lru_cache
def indicators() -> tuple[IndicatorDefinition, ...]:
    """Return the initial indicator catalog."""
    return tuple(
        TypeAdapter(list[IndicatorDefinition]).validate_python(read_document("indicators.json"))
    )


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
