"""Publish a versioned documentary review without approving clinical rules."""

import argparse
import json
import xml.etree.ElementTree as ET
from hashlib import sha256
from pathlib import Path

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.analysis import analysis_for_paper, persist_analysis
from app.config import get_settings
from app.database import LiteraturePaperRecord, create_database_engine
from app.schemas import PaperAnalysis, PaperAnalysisItem, PaperStatistic, PaperSummary

ROOT = Path(__file__).resolve().parents[2]
RELEASE_DIR = ROOT / "backend/data/literature/reviews/2026-11-15"
EXTRACTION = ROOT / "backend/data/literature/extractions/core-studies.json"
REVIEW_LIMIT = (
    "Revisión documental asistida por IA del abstract original; no es aprobación médica, "
    "evaluación de riesgo de sesgo ni validación individual."
)


class ReviewEntry(BaseModel):
    """Require explicit editorial content bound to the original abstract."""

    model_config = ConfigDict(extra="forbid")
    paper_id: str
    abstract_sha256: str
    study_design: str = Field(min_length=1)
    population_description: str = Field(min_length=1)
    summary: str = Field(min_length=1)
    limitations: list[str] = Field(min_length=1)
    source_url: str


class Release(BaseModel):
    """Identify one immutable documentary publication."""

    model_config = ConfigDict(extra="forbid")
    version: str
    reviewed_at: AwareDatetime
    reviewer: str
    scope: str
    pubmed_sha256: str
    entries: list[ReviewEntry]


def read_release() -> tuple[Release, dict[str, dict[str, str]]]:
    """Validate saved source bytes, original identity and editorial input hashes."""
    release = Release.model_validate_json((RELEASE_DIR / "release.json").read_text())
    xml = (RELEASE_DIR / "pubmed.xml").read_bytes()
    if sha256(xml).hexdigest() != release.pubmed_sha256:
        raise ValueError("Original PubMed snapshot changed.")
    originals = {}
    for article in ET.fromstring(xml).findall("PubmedArticle"):
        pmid = article.findtext(".//MedlineCitation/PMID")
        abstract = " ".join(
            "".join(part.itertext()) for part in article.findall(".//Abstract/AbstractText")
        )
        doi = next(
            (item.text for item in article.findall(".//ArticleId") if item.get("IdType") == "doi"),
            "",
        )
        originals[f"literature_pmid_{pmid}"] = {"abstract": abstract, "doi": doi or ""}
    seen = set()
    for entry in release.entries:
        if entry.paper_id in seen or entry.paper_id not in originals:
            raise ValueError("Duplicate or unknown paper in release.")
        seen.add(entry.paper_id)
        text = originals[entry.paper_id]["abstract"]
        if not text or sha256(text.encode()).hexdigest() != entry.abstract_sha256:
            raise ValueError(f"Editorial abstract hash mismatch: {entry.paper_id}")
        pmid = entry.paper_id.removeprefix("literature_pmid_")
        if entry.source_url != f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/":
            raise ValueError("Review source URL does not match the PMID.")
    return release, originals


def extracted_statistics() -> dict[str, list[dict]]:
    """Project only the six document-checked, group-level quantities."""
    extraction = json.loads(EXTRACTION.read_text())
    result = {}
    for study in extraction["studies"]:
        for document in study["documents"]:
            if sha256((ROOT / document["path"]).read_bytes()).hexdigest() != document["sha256"]:
                raise ValueError("An original extraction document changed.")
        statistics = []
        for item in study["statistics"]:
            rate = item["statistic_type"] == "published_daily_change_relative_to_baseline"
            statistic = PaperStatistic(
                id=item["id"],
                outcome=item["quantity"],
                anatomy=item.get("region", "quadriceps"),
                group_label=item["group"],
                timepoint_label="70 días de reposo" if rate else item["timepoint"],
                sample_size=item["sample_size"],
                value=item["value"],
                unit=item["unit"],
                statistic_type="change_rate" if rate else "group_mean",
                dispersion={"kind": "standard_deviation", "value": item["standard_deviation"]}
                if "standard_deviation" in item
                else None,
                interval=None,
                source_locator=item["source_locator"],
                source_url=study["source_url"],
                extraction_review_status="reviewed",
                limitations=[
                    "Extracción documental; no son observaciones de un astronauta ni umbrales clínicos.",
                    *study["prohibited_inferences"],
                    *([item["uncertainty_note"]] if rate else []),
                ],
            )
            statistics.append(statistic.model_dump(mode="json"))
        result[study["paper_id"]] = statistics
    return result


def publish(session: Session) -> dict[str, int]:
    """Stage an atomic, idempotent release; the caller owns commit or rollback."""
    release, originals = read_release()
    statistics = extracted_statistics()
    counts = {"published": 0, "unchanged": 0}
    for entry in release.entries:
        paper = session.scalar(
            select(LiteraturePaperRecord)
            .where(LiteraturePaperRecord.id == entry.paper_id)
            .with_for_update()
        )
        if paper is None:
            raise ValueError("Seed the complete corpus before publishing its review.")
        original = originals[paper.id]
        if paper.identifiers.get("doi", "").lower() != original["doi"].lower():
            raise ValueError(f"Original DOI mismatch: {paper.id}")
        previous = paper.payload.get("documentary_review")
        review = {
            **entry.model_dump(),
            "version": release.version,
            "reviewer": release.reviewer,
            "reviewed_at": release.reviewed_at.isoformat(),
            "scope": release.scope,
            "statistics": statistics.get(paper.id, []),
            "clinical_approval": False,
        }
        if previous and previous["version"] == release.version:
            if paper.abstract_text != original["abstract"] or previous != review:
                raise ValueError("Published release content changed; use a new version.")
            counts["unchanged"] += 1
            continue
        payload = dict(paper.payload)
        history = list(payload.get("documentary_review_history", []))
        if previous:
            history.append(previous)
        payload["documentary_review_history"] = history
        payload["documentary_review"] = review
        paper.payload = payload
        paper.abstract_text = original["abstract"]
        paper.review_status = "reviewed"
        # Eligibility belongs to the separate clinical and model review workflows.
        paper.clinical_action_eligible = False
        paper.model_parameter_eligible = False
        limitations = [REVIEW_LIMIT, *entry.limitations]
        source_locator = f"{entry.source_url} Abstract"
        analysis = PaperAnalysis(
            **{
                **analysis_for_paper(paper).model_dump(),
                "status": "ready",
                "prompt_version": release.version,
                "model_id": "codex/documentary-editorial-review",
                "generated_at": release.reviewed_at,
                "items": [
                    PaperAnalysisItem(
                        id=f"{paper.id}_documentary_finding",
                        kind="finding",
                        text=entry.summary,
                        source_locator=source_locator,
                        source_excerpt=original["abstract"][:450],
                        review_status="reviewed",
                        limitations=limitations,
                    )
                ],
            }
        )
        persist_analysis(
            session,
            paper_id=paper.id,
            analysis=analysis,
            summary=PaperSummary(
                status="available",
                text=entry.summary,
                basis="abstract",
                method="llm_assisted",
                review_status="reviewed",
                source_locators=[source_locator],
                limitations=limitations,
            ),
        )
        counts["published"] += 1
    return counts


def main() -> None:
    """Validate by default, and persist only with --apply."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    engine = create_database_engine(get_settings())
    try:
        with Session(engine) as session:
            counts = publish(session)
            session.flush()
            if args.apply:
                session.commit()
            else:
                session.rollback()
        print(json.dumps({"applied": args.apply, **counts}))
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
