"""Insert the illustrative case without overwriting existing database records."""

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.catalog import candidate_papers, demo_payload, knowledge_base_metadata
from app.config import get_settings
from app.database import CaseRecord, LiteraturePaperRecord, create_database_engine


def main() -> None:
    """Seed a migrated database; repeated execution preserves existing data."""
    payload = demo_payload()
    engine = create_database_engine(get_settings())
    try:
        with Session(engine) as session:
            case_statement = (
                insert(CaseRecord)
                .values(id=payload["case"]["id"], payload=payload)
                .on_conflict_do_nothing(index_elements=[CaseRecord.id])
            )
            session.execute(case_statement)
            corpus_version = knowledge_base_metadata().corpus_version
            for paper in candidate_papers():
                paper_statement = (
                    insert(LiteraturePaperRecord)
                    .values(
                        id=paper["id"],
                        corpus_version=corpus_version,
                        title=paper["title"],
                        publication_year=int(paper["publication_year"]),
                        identifiers=paper["identifiers"],
                        authors=paper["authors"],
                        abstract_text=paper["abstract_text"] or None,
                        source_url=paper.get("source_url"),
                        doi_url=paper.get("doi_url"),
                        pmc_url=paper.get("pmc_url"),
                        publication_types=paper["publication_types_from_index"],
                        review_status=paper["review_status"],
                        model_parameter_eligible=paper["model_parameter_eligible"],
                        clinical_action_eligible=paper["clinical_action_eligible"],
                        payload=paper,
                    )
                    .on_conflict_do_nothing(index_elements=[LiteraturePaperRecord.id])
                )
                session.execute(paper_statement)
            session.commit()
        print(
            "Caso ilustrativo y corpus bibliográfico candidato disponibles; registros existentes conservados."
        )
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
