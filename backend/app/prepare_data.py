"""Prepare a terrestrial heart-rate recording without modifying source files."""

import argparse
import csv
import hashlib
import json
import math
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
DATASET_URL = "https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/"
MISSING_VALUES = {"", "NA", "NAN"}


def checksum(path: Path) -> str:
    """Hash a file without loading the complete dataset into memory."""
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def verify_sources(raw_dir: Path) -> dict[str, str]:
    """Check the three source files against the publisher's checksum list."""
    expected = {}
    for line in (raw_dir / "SHA256SUMS.txt").read_text().splitlines():
        digest, name = line.split(maxsplit=1)
        expected[name] = digest
    verified = {}
    for name in ("subject-info.csv", "test_measure.csv", "LICENSE.txt"):
        actual = checksum(raw_dir / name)
        if expected.get(name) != actual:
            raise ValueError(f"Source checksum mismatch: {name}")
        verified[name] = actual
    return verified


def numeric_value(value: str, field: str, row_number: int) -> float:
    """Reject malformed and infinite values rather than silently replacing them."""
    parsed = float(value)
    if not math.isfinite(parsed):
        raise ValueError(f"Non-finite {field} at source row {row_number}")
    return parsed


def extract_recording(
    raw_dir: Path, test_id: str
) -> tuple[dict[str, str], list[dict[str, str | float | bool | int | None]], dict[str, int]]:
    """Select one adult test and retain source timing and missing HR samples."""
    with (raw_dir / "subject-info.csv").open(encoding="utf-8-sig", newline="") as stream:
        matches = [row for row in csv.DictReader(stream) if row["ID_test"] == test_id]
    if len(matches) != 1:
        raise ValueError("The requested test must match exactly one participant record.")
    participant = matches[0]
    if numeric_value(participant["Age"], "Age", 0) < 18:
        raise ValueError("Select an adult participant for the demonstration.")

    points = []
    total_rows = 0
    total_missing = 0
    with (raw_dir / "test_measure.csv").open(encoding="utf-8-sig", newline="") as stream:
        for source_row, row in enumerate(csv.DictReader(stream), start=2):
            total_rows += 1
            missing = row["HR"].strip().upper() in MISSING_VALUES
            total_missing += missing
            if row["ID_test"] != test_id:
                continue
            if row["ID"] != participant["ID"]:
                raise ValueError(f"Participant mismatch at source row {source_row}")
            time_s = numeric_value(row["time"], "time", source_row)
            if time_s < 0 or (points and time_s <= points[-1]["time_s"]):
                raise ValueError("Sample times must be nonnegative, increasing and unique.")
            points.append(
                {
                    "time_s": time_s,
                    "heart_rate": None if missing else numeric_value(row["HR"], "HR", source_row),
                    "speed_kmh": None
                    if row["Speed"].strip().upper() in MISSING_VALUES
                    else numeric_value(row["Speed"], "Speed", source_row),
                    "missing_reason": "Missing HR in source CSV" if missing else None,
                    "source_row": source_row,
                }
            )
    if len(points) < 2:
        raise ValueError("The requested test needs at least two samples.")
    audit = {"dataset_rows": total_rows, "dataset_missing_hr": total_missing}
    return participant, points, audit


def prepare(raw_dir: Path, output_dir: Path, test_id: str) -> dict[str, object]:
    """Write derived CSV and provenance for review, without changing API fixtures."""
    if not test_id or any(character not in "0123456789_" for character in test_id):
        raise ValueError("Test ID must contain only digits and underscores.")
    if output_dir.resolve().is_relative_to(raw_dir.resolve()):
        raise ValueError("Derived files must be stored outside the original data directory.")
    hashes = verify_sources(raw_dir)
    participant, points, audit = extract_recording(raw_dir, test_id)
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_path = output_dir / f"heart_rate_{test_id}.csv"
    with csv_path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(points[0]))
        writer.writeheader()
        writer.writerows(points)

    provenance: dict[str, object] = {
        "preparation_version": "1.0.0",
        "dataset_id": "physionet_treadmill_1.0.1",
        "test_id": test_id,
        "participant_id": participant["ID"],
        "origin": "human_dataset",
        "context": "terrestrial_exercise",
        "review_status": "pending",
        "source": {
            "doi": "10.13026/7ezk-j442",
            "url": DATASET_URL,
            "version": "1.0.1",
            "license_file": "LICENSE.txt",
            "sha256": hashes,
        },
        "selection": "Explicit test ID; adult participant; demonstration only, no clinical ranking",
        "transformations": [
            "Filter ID_test; verify participant ID against subject-info.csv",
            "Rename time to time_s, HR to heart_rate and Speed to speed_kmh",
            "Parse numeric values; retain original times and speed",
            "Keep missing HR as an empty CSV cell with an explicit reason",
            "No interpolation, resampling, imputation or mission-time conversion",
        ],
        "units": {"time_s": "s", "heart_rate": "beats/min", "speed_kmh": "km/h"},
        "sample_count": len(points),
        "missing_hr": sum(point["heart_rate"] is None for point in points),
        "first_sample_s": points[0]["time_s"],
        "last_sample_s": points[-1]["time_s"],
        "source_row_numbering": "One-based CSV line, including the header",
        "audit": audit,
        "output": {"file": csv_path.name, "sha256": checksum(csv_path)},
        "limitations": [
            "The participant is not the virtual astronaut",
            "This recording does not validate an individual response in microgravity",
            "No clinical thresholds or recommendations are derived",
            "Files are preparation artifacts, not API responses or a database import",
        ],
    }
    metadata_path = output_dir / f"heart_rate_{test_id}.provenance.json"
    metadata_path.write_text(
        json.dumps(provenance, ensure_ascii=False, indent=2, allow_nan=False) + "\n",
        encoding="utf-8",
    )
    return provenance


def main() -> None:
    """Run the reproducible preparation step using only the standard library."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--test-id", required=True)
    parser.add_argument("--raw-dir", type=Path, default=DATA_DIR / "raw/physionet_treadmill_1.0.1")
    parser.add_argument(
        "--output-dir", type=Path, default=DATA_DIR / "processed/physionet_treadmill_1.0.1"
    )
    arguments = parser.parse_args()
    try:
        result = prepare(arguments.raw_dir, arguments.output_dir, arguments.test_id)
    except (OSError, ValueError, KeyError) as error:
        parser.exit(1, f"Data preparation failed: {error}\n")
    print(
        f"Prepared {result['test_id']}: {result['sample_count']} samples, "
        f"{result['missing_hr']} missing HR values. Output: {arguments.output_dir}"
    )


if __name__ == "__main__":
    main()
