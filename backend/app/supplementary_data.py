"""Project independently sourced flight laboratories and terrestrial exercise."""

import csv
import hashlib
import json
import re
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, ConfigDict

DATA = Path(__file__).resolve().parents[1] / "data"


class LabValue(BaseModel):
    model_config = ConfigDict(allow_inf_nan=False)
    id: str
    label: str
    value: float | None
    unit: str
    laboratory_min: float | None
    laboratory_max: float | None


class LabSample(BaseModel):
    sample_id: str
    participant_id: str
    phase: str
    timepoint: str
    relative_day: int
    values: list[LabValue]


class FlightLaboratories(BaseModel):
    dataset_id: str
    source_url: str
    publication_url: str
    source_sha256: str
    samples: list[LabSample]
    limitations: list[str]


def number(value: str) -> float | None:
    """Retain absent source cells as null, never impute zero."""
    return None if value.strip().lower() in {"", "na", "nan"} else float(value)


@lru_cache
def flight_laboratories() -> FlightLaboratories:
    """Read a fixed, documented subset of the original NASA metabolic panel."""
    folder = DATA / "raw/nasa_inspiration4"
    manifest = json.loads((folder / "manifest.json").read_text())
    path = folder / "OSD-575_CMP_TRANSFORMED.csv"
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != manifest["sha256"]:
        raise ValueError("NASA CMP source checksum changed.")
    metrics = [
        ("glucose", "Glucosa", "mg/dL", "milligram_per_deciliter"),
        ("calcium", "Calcio sérico", "mg/dL", "milligram_per_deciliter"),
        ("potassium", "Potasio", "mmol/L", "millimol_per_liter"),
        ("sodium", "Sodio", "mmol/L", "millimol_per_liter"),
        ("creatinine", "Creatinina", "mg/dL", "milligram_per_deciliter"),
        ("albumin", "Albúmina", "g/dL", "gram_per_deciliter"),
    ]
    samples = []
    with path.open(encoding="utf-8-sig", newline="") as stream:
        for row in csv.DictReader(stream):
            match = re.fullmatch(r"(C\d{3})_serum_([LR])([+-]\d+)", row["Sample Name"])
            if match is None:
                raise ValueError("Unrecognized original CMP sample identifier.")
            participant, phase, day = match.groups()
            samples.append(
                LabSample(
                    sample_id=row["Sample Name"],
                    participant_id=participant,
                    phase="preflight" if phase == "L" else "postflight",
                    timepoint=f"{phase}{day}",
                    relative_day=int(day),
                    values=[
                        LabValue(
                            id=key,
                            label=label,
                            value=number(row[f"{key}_value_{suffix}"]),
                            unit=unit,
                            laboratory_min=number(row[f"{key}_range_min_{suffix}"]),
                            laboratory_max=number(row[f"{key}_range_max_{suffix}"]),
                        )
                        for key, label, unit, suffix in metrics
                    ],
                )
            )
    samples.sort(
        key=lambda item: (item.participant_id, item.phase == "postflight", item.relative_day)
    )
    return FlightLaboratories(
        dataset_id="OSD-575",
        source_url=manifest["download_url"],
        publication_url="https://doi.org/10.1038/s41526-024-00393-5",
        source_sha256=digest,
        samples=samples,
        limitations=[
            "Cuatro tripulantes de Inspiration4; vuelo corto, sin muestras de este panel tomadas durante el vuelo.",
            "L expresa días respecto al lanzamiento; R, respecto al regreso. No son el reloj del caso virtual.",
            "El CSV contiene R+194 aunque la descripción del estudio enumera otros puntos de seguimiento.",
            "Rangos del laboratorio original; no constituyen umbrales individuales de misión.",
            "El calcio sérico no mide densidad ósea; la creatinina no sustituye área muscular ni torque.",
        ],
    )


class ExerciseSample(BaseModel):
    model_config = ConfigDict(allow_inf_nan=False)
    time_s: float
    speed_kmh: float | None
    heart_rate: float | None
    oxygen_ml_min: float | None
    carbon_dioxide_ml_min: float | None
    respiratory_rate: float | None
    ventilation_l_min: float | None
    source_row: int


class ExerciseSession(BaseModel):
    test_id: str
    participant_id: str
    source_url: str
    source_sha256: str
    samples: list[ExerciseSample]
    limitations: list[str]
    nasa_monitoring_url: str
    nasa_monitoring_context: str


@lru_cache
def exercise_session() -> ExerciseSession:
    """Keep all original breath-by-breath observations of the selected effort test."""
    provenance = json.loads(
        (DATA / "processed/physionet_treadmill_1.0.1/heart_rate_2_1.provenance.json").read_text()
    )
    path = DATA / "raw/physionet_treadmill_1.0.1/test_measure.csv"
    with path.open("rb") as stream:
        digest = hashlib.file_digest(stream, "sha256").hexdigest()
    if digest != provenance["source"]["sha256"]["test_measure.csv"]:
        raise ValueError("Exercise source checksum changed.")
    samples = []
    with path.open(newline="") as stream:
        for line, row in enumerate(csv.DictReader(stream), 2):
            if row["ID_test"] != provenance["test_id"]:
                continue
            if row["ID"] != provenance["participant_id"]:
                raise ValueError("Exercise participant differs from source metadata.")
            samples.append(
                ExerciseSample(
                    time_s=float(row["time"]),
                    speed_kmh=number(row["Speed"]),
                    heart_rate=number(row["HR"]),
                    oxygen_ml_min=number(row["VO2"]),
                    carbon_dioxide_ml_min=number(row["VCO2"]),
                    respiratory_rate=number(row["RR"]),
                    ventilation_l_min=number(row["VE"]),
                    source_row=line,
                )
            )
    if len(samples) != provenance["sample_count"]:
        raise ValueError("Unexpected exercise sample count.")
    return ExerciseSession(
        test_id=provenance["test_id"],
        participant_id=provenance["participant_id"],
        source_url=provenance["source"]["url"],
        source_sha256=digest,
        samples=samples,
        nasa_monitoring_url="https://www.nasa.gov/ochmo-tb-031-exercise-overview-2/",
        nasa_monitoring_context=(
            "NASA describe seguimiento de condición física y ajuste de prescripciones por "
            "especialistas ACERS según capacidad y desempeño. CEVIS registra carga, pulso y tiempo; "
            "su contexto es distinto de esta prueba terrestre supervisada. "
            "Una prueba de esfuerzo máxima no se convierte en una rutina para la tripulación."
        ),
        limitations=[
            "Prueba terrestre de esfuerzo supervisada, no una sesión prescrita a un astronauta.",
            "Muestreo respiración a respiración, con tiempos originales irregulares y dos ausencias de pulso.",
            "El máximo observado de VO2 no se etiqueta como VO2max sin revisar los criterios del protocolo.",
            "No permite calcular cumplimiento de una planificación NASA; redistribución pública sujeta a aclaración de licencia.",
        ],
    )
