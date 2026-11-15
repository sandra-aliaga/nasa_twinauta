"""Build a bibliographic candidate index without claiming full-text review."""

import hashlib
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def plain_text(value: str) -> str:
    """Remove indexed markup and then decode entities, preserving comparisons."""
    return html.unescape(re.sub(r"<[^>]+>", " ", value)).strip()


def main() -> None:
    """Join a manual selection with original query records and exact locators."""
    manifest = json.loads((ROOT / "search_manifest.json").read_text())
    selection = json.loads((ROOT / "selection.json").read_text())
    records = {}
    locators = {}
    for query in manifest["queries"]:
        path = ROOT / query["file"]
        payload = json.loads(path.read_text())
        for offset, record in enumerate(payload["resultList"]["result"]):
            identifier = str(record.get("pmid") or record["id"])
            records.setdefault(identifier, record)
            locators.setdefault(identifier, []).append(
                {"query_id": query["id"], "file": query["file"], "result_index": offset}
            )
    candidates = []
    for selected in selection:
        record = records[selected["pmid"]]
        doi = record.get("doi")
        pmcid = record.get("pmcid")
        abstract_html = record.get("abstractText")
        candidates.append(
            {
                "id": "literature_pmid_" + selected["pmid"],
                "identifiers": {"pmid": selected["pmid"], "pmcid": pmcid, "doi": doi},
                "title": plain_text(record["title"]),
                "authors": record.get("authorList", {}).get("author", []),
                "author_string": record.get("authorString"),
                "publication_year": record.get("pubYear"),
                "first_publication_date": record.get("firstPublicationDate"),
                "journal": record.get("journalInfo"),
                "pages": record.get("pageInfo"),
                "publication_types_from_index": record.get("pubTypeList", {}).get("pubType", []),
                "abstract_html": abstract_html,
                "abstract_text": plain_text(abstract_html) if abstract_html else None,
                "source_url": "https://europepmc.org/article/MED/" + selected["pmid"],
                "doi_url": "https://doi.org/" + doi if doi else None,
                "pmc_url": "https://pmc.ncbi.nlm.nih.gov/articles/" + pmcid + "/"
                if pmcid
                else None,
                "full_text_links_from_index": record.get("fullTextUrlList", {}).get(
                    "fullTextUrl", []
                ),
                "is_open_access_reported_by_index": record.get("isOpenAccess"),
                "classification": {
                    "environment": selected["environment"],
                    "basis": selected["classification_basis"],
                    "topics": selected["topics"],
                    "selection_rationale": selected["rationale"],
                },
                "cohort_independence": {
                    "status": "not_established",
                    "check_family": selected["cohort_check"],
                    "note": "Family is a review queue, not proof of identical or independent cohorts",
                },
                "review_status": "identified_not_fulltext_audited",
                "model_parameter_eligible": False,
                "clinical_action_eligible": False,
                "effect_estimates": [],
                "provenance": {
                    "provider": "Europe PMC REST API",
                    "retrieved_at": manifest["retrieved_at"],
                    "original_records": locators[selected["pmid"]],
                },
            }
        )
    if len({item["identifiers"]["pmid"] for item in candidates}) != len(candidates):
        raise ValueError("The selection contains duplicate PMIDs")
    output = {
        "schema_version": "candidate-corpus-0.1",
        "status": "research_candidates_only",
        "retrieved_at": manifest["retrieved_at"],
        "retrieved_record_count": sum(q["retrieved_records"] for q in manifest["queries"]),
        "unique_index_ids_count": len(records),
        "selected_count": len(candidates),
        "records": candidates,
    }
    (ROOT / "corpus.json").write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    files = sorted((ROOT / "raw").glob("*.json"))
    hashes = {
        str(path.relative_to(ROOT)): hashlib.sha256(path.read_bytes()).hexdigest() for path in files
    }
    (ROOT / "raw_sha256.json").write_text(json.dumps(hashes, indent=2) + "\n")
    print(f"Indexed {len(candidates)} candidates from {len(records)} unique indexed IDs")


if __name__ == "__main__":
    main()
