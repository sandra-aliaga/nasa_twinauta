"""Preview or explicitly execute provider-backed abstract preparation."""

import argparse

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.analysis import analyze_paper
from app.analysis_providers import HTTPAnalysisProvider
from app.config import get_settings
from app.database import LiteraturePaperRecord, create_database_engine


def main() -> None:
    """Make every provider call opt-in and restricted to explicit paper IDs."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--paper-id", nargs="+", required=True)
    parser.add_argument("--execute", action="store_true", help="Allow configured provider calls.")
    parser.add_argument("--force", action="store_true", help="Bypass successful preparation cache.")
    args = parser.parse_args()
    settings = get_settings()
    try:
        provider = HTTPAnalysisProvider(settings) if args.execute else None
    except ValueError as error:
        parser.exit(1, f"{error}\n")
    engine = create_database_engine(settings)
    failed = False
    try:
        for paper_id in dict.fromkeys(args.paper_id):
            with Session(engine) as session:
                paper = session.get(LiteraturePaperRecord, paper_id)
                if paper is None:
                    parser.exit(1, f"Unknown paper: {paper_id}\n")
                if provider is None:
                    print(
                        f"{paper_id}: preview, {len(paper.abstract_text or '')} abstract characters"
                    )
                else:
                    result = analyze_paper(session, paper_id, provider, force=args.force)
                    print(f"{paper_id}: {result}")
                    failed = failed or result == "failed"
    except SQLAlchemyError:
        parser.exit(
            1, "Database unavailable or migrations pending; no automatic migration applied.\n"
        )
    finally:
        engine.dispose()
    if failed:
        parser.exit(1, "Some analyses failed; consult the persisted preparation states.\n")


if __name__ == "__main__":
    main()
