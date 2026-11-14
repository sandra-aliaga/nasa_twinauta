"""Insert the illustrative case without overwriting existing database records."""

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.catalog import demo_payload
from app.config import get_settings
from app.database import CaseRecord, create_database_engine


def main() -> None:
    """Seed a migrated database; repeated execution preserves existing data."""
    payload = demo_payload()
    engine = create_database_engine(get_settings())
    try:
        with Session(engine) as session:
            statement = (
                insert(CaseRecord)
                .values(id=payload["case"]["id"], payload=payload)
                .on_conflict_do_nothing(index_elements=[CaseRecord.id])
            )
            session.execute(statement)
            session.commit()
        print("Caso ilustrativo disponible; los registros existentes se conservaron.")
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
