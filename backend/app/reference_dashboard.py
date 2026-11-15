"""Expose observed reference data without assigning them to a virtual mission."""

import csv
import json
from functools import lru_cache
from hashlib import sha256
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from app.publish_documentary_review import extracted_statistics
from app.schemas import PaperStatistic

ROOT = Path(__file__).resolve().parents[2]


class Measurement(BaseModel):
    model_config = ConfigDict(allow_inf_nan=False)
    date: str
    value: float
    source_url: str
    source_row: int
    phase_original: str


class Participant(BaseModel):
    id: str
    measurements: list[Measurement]


class ReferenceDashboard(BaseModel):
    version: str
    torque_unit: str
    torque_method: str
    torque_source_url: str
    torque_limitations: list[str]
    participants: list[Participant]
    muscle_statistics: list[PaperStatistic]
    published_torque: list[PaperStatistic]


@lru_cache
def reference_dashboard() -> ReferenceDashboard:
    """Read originals and verify their integrity before projecting KES60."""
    folder = ROOT / "backend/data/raw/nasa_mr079g/MR079G_Campaign_17"
    manifest = json.loads((folder / "inspection.json").read_text())
    dictionary = ROOT / manifest["dictionary_original"]
    with dictionary.open(encoding="utf-8-sig", newline="") as stream:
        definition = next(
            row for row in csv.DictReader(stream) if row["Parameter Short Name"] == "KES60"
        )
    if definition["Units"] != "Nm":
        raise ValueError("Unexpected KES60 unit in the original dictionary.")
    subjects: dict[str, list[Measurement]] = {}
    for file in manifest["files"]:
        path = folder / file["file"]
        if sha256(path.read_bytes()).hexdigest() != file["sha256"]:
            raise ValueError("Original NASA reference file changed.")
        with path.open(encoding="utf-8-sig", newline="") as stream:
            for line, row in enumerate(csv.DictReader(stream), 2):
                if row["KES60"] in ("", "NA"):
                    continue
                subjects.setdefault(row["Subject"], []).append(
                    Measurement(
                        date=row["Date"],
                        value=float(row["KES60"]),
                        source_url=file["url"],
                        source_row=line,
                        phase_original=row["Test_Phase"],
                    )
                )
    statistics = extracted_statistics()
    return ReferenceDashboard(
        version="observed-references-2026-11-15",
        torque_unit="N.m",
        torque_method=definition["Parameter Definition"],
        torque_source_url="https://doi.org/10.83263/bk5h-r757",
        torque_limitations=[
            "Mediciones de participantes en un análogo terrestre; fechas originales del depósito.",
            "El archivo BR+6 contiene Test_Phase=PRE_TEST: la fase presenta una discrepancia en origen.",
            "Los participantes de torque y de las referencias de área y pulso pertenecen a fuentes distintas.",
        ],
        participants=[
            Participant(id=subject, measurements=measurements)
            for subject, measurements in sorted(subjects.items())
            if len(measurements) == 2
        ],
        muscle_statistics=statistics["literature_pmid_33251515"],
        published_torque=statistics["literature_pmid_38328821"],
    )
