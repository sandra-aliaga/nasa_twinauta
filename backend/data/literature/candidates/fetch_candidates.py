"""Retrieve bounded Europe PMC searches for a manually reviewed candidate corpus."""

import json
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
API_URL = "https://www.ebi.ac.uk/europepmc/webservices/rest/search"
QUERIES = {
    "seed_studies": (
        "DOI:10.1097/CCE.0000000000000269 OR DOI:10.1152/japplphysiol.00489.2023 "
        "OR DOI:10.1249/MSS.0000000000001617 "
        'OR TITLE:"Exercise Training Mitigates Multisystem Deconditioning during Bed Rest"'
    ),
    "recent_quadriceps_disuse": (
        '(TITLE_ABS:quadriceps OR TITLE_ABS:"knee extensor") '
        'AND (TITLE_ABS:"bed rest" OR TITLE_ABS:unloading OR TITLE_ABS:disuse) '
        "AND FIRST_PDATE:[2020-01-01 TO 2026-11-14]"
    ),
    "spaceflight_muscle": (
        'TITLE_ABS:spaceflight AND (TITLE_ABS:"muscle strength" '
        'OR TITLE_ABS:"muscle volume" OR TITLE_ABS:"muscle atrophy") '
        "AND FIRST_PDATE:[2018-01-01 TO 2026-11-14]"
    ),
    "bedrest_countermeasures": (
        'TITLE_ABS:"bed rest" AND (TITLE_ABS:exercise OR TITLE_ABS:"artificial gravity") '
        'AND (TITLE_ABS:torque OR TITLE_ABS:"cross-sectional area") '
        "AND FIRST_PDATE:[2018-01-01 TO 2026-11-14]"
    ),
    "disuse_syntheses": (
        '(TITLE_ABS:"bed rest" OR TITLE_ABS:disuse) AND TITLE_ABS:muscle '
        'AND (TITLE_ABS:"systematic review" OR TITLE_ABS:"meta-analysis") '
        "AND FIRST_PDATE:[2022-01-01 TO 2026-11-14]"
    ),
    "targeted_flight_and_analog": (
        "DOI:10.1038/s41526-020-00111-x OR DOI:10.1038/s41526-023-00256-5 "
        "OR DOI:10.1007/s00421-021-04673-w OR DOI:10.1038/s41526-026-00611-2"
    ),
}


def main() -> None:
    """Save original API bytes and query metadata; do not infer scientific quality."""
    raw_dir = ROOT / "raw"
    raw_dir.mkdir(exist_ok=True)
    manifest = {
        "retrieved_at": datetime.now(UTC).isoformat(),
        "api": API_URL,
        "result_type": "core",
        "page_size": 40,
        "queries": [],
        "limitations": [
            "Only the first page of each query is retrieved",
            "Relevance ranking and date limits can omit pertinent studies",
            "Indexed metadata and abstracts are not a full-text scientific audit",
        ],
    }
    for name, query in QUERIES.items():
        url = (
            API_URL
            + "?"
            + urlencode({"query": query, "format": "json", "resultType": "core", "pageSize": 40})
        )
        request = Request(url, headers={"User-Agent": "TwinNauta-research/0.1"})
        with urlopen(request, timeout=40) as response:
            body = response.read()
        payload = json.loads(body)
        if "resultList" not in payload:
            raise ValueError(f"Unexpected search response for {name}")
        path = raw_dir / f"{name}.json"
        path.write_bytes(body)
        record = {
            "id": name,
            "query": query,
            "url": url,
            "file": str(path.relative_to(ROOT)),
            "total_hits": payload.get("hitCount"),
            "retrieved_records": len(payload["resultList"]["result"]),
            "next_cursor_mark": payload.get("nextCursorMark"),
        }
        manifest["queries"].append(record)
        (ROOT / "search_manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"{name}: {record['retrieved_records']} / {record['total_hits']}", flush=True)


if __name__ == "__main__":
    main()
