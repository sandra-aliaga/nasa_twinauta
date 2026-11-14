"""Load the reviewed terrestrial replay independently of the virtual case."""

import csv
import hashlib
import json
from functools import lru_cache
from math import nextafter
from pathlib import Path

from app.schemas import Source, TelemetryPoint, TelemetryRecording

PHYSIONET_RECORDING_ID = "physionet_treadmill_1_0_1_2_1"
DATA_DIR = Path(__file__).resolve().parents[1] / "data"
RECORDING_DIR = DATA_DIR / "processed" / "physionet_treadmill_1.0.1"


@lru_cache
def physionet_recording() -> tuple[TelemetryRecording, tuple[TelemetryPoint, ...]]:
    """Verify the prepared file and retain every original timestamp and absence."""
    provenance = json.loads(
        (RECORDING_DIR / "heart_rate_2_1.provenance.json").read_text(encoding="utf-8")
    )
    if (
        provenance["dataset_id"] != "physionet_treadmill_1.0.1"
        or provenance["test_id"] != "2_1"
        or provenance["participant_id"] != "2"
        or provenance["origin"] != "human_dataset"
        or provenance["context"] != "terrestrial_exercise"
        or provenance["units"]["heart_rate"] != "beats/min"
    ):
        raise ValueError("Prepared recording provenance does not match the registered dataset.")
    csv_path = RECORDING_DIR / "heart_rate_2_1.csv"
    if provenance["output"]["file"] != csv_path.name:
        raise ValueError("Prepared recording filename differs from its provenance.")
    with csv_path.open("rb") as stream:
        actual_hash = hashlib.file_digest(stream, "sha256").hexdigest()
    if actual_hash != provenance["output"]["sha256"]:
        raise ValueError("Prepared recording checksum does not match its provenance.")

    with csv_path.open(encoding="utf-8", newline="") as stream:
        points = tuple(
            TelemetryPoint(
                time_s=float(row["time_s"]),
                value=float(row["heart_rate"]) if row["heart_rate"] else None,
                missing_reason=row["missing_reason"] or None,
            )
            for row in csv.DictReader(stream)
        )
    if len(points) < 2 or len(points) != provenance["sample_count"]:
        raise ValueError("Prepared recording sample count differs from its provenance.")
    times = [point.time_s for point in points]
    if times != sorted(set(times)):
        raise ValueError("Prepared recording timestamps must be ordered and unique.")
    if (
        times[0] != provenance["first_sample_s"]
        or times[-1] != provenance["last_sample_s"]
        or sum(point.value is None for point in points) != provenance["missing_hr"]
    ):
        raise ValueError("Prepared recording bounds or missing count differ from its provenance.")

    source = Source(
        id="physionet_treadmill_1_0_1",
        title=(
            "Mongin, García Romero & Alvero Cruz (2021). Treadmill Maximal Exercise Tests "
            "from the Exercise Physiology and Human Performance Lab of the University of Malaga"
        ),
        url="https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/",
        locator=(
            "DOI 10.13026/7ezk-j442; test_measure.csv: ID_test=2_1, ID=2, time and HR; "
            "subject-info.csv: ID_test=2_1. Prepared CSV and row provenance: "
            "backend/data/processed/physionet_treadmill_1.0.1/; no interpolation or resampling. "
            "Terrestrial replay only; not a measurement of the virtual astronaut."
        ),
        review_status="reviewed",
        version="1.0.1",
        license=(
            "CC BY-NC-SA 4.0; "
            "https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/LICENSE.txt"
        ),
    )
    metadata = TelemetryRecording(
        recording_id=PHYSIONET_RECORDING_ID,
        dataset_id=provenance["dataset_id"],
        participant_id=provenance["participant_id"],
        content_mode="evidence_based",
        origin="human_dataset",
        context="terrestrial_exercise",
        indicator_id="heart_rate",
        unit="beats/min",
        start_s=times[0],
        # The smallest greater float includes the last sample in a half-open window.
        end_s=nextafter(times[-1], float("inf")),
        max_window_seconds=120,
        max_points=2000,
        source=source,
    )
    return metadata, points
