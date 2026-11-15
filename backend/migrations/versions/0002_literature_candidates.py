"""Store bibliographic candidates separately from case assessments."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0002_literature_candidates"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create the discovery-only literature table."""
    op.create_table(
        "literature_papers",
        sa.Column("id", sa.String(150), primary_key=True),
        sa.Column("corpus_version", sa.String(100), nullable=False),
        sa.Column("title", sa.String(1000), nullable=False),
        sa.Column("publication_year", sa.Integer(), nullable=False),
        sa.Column("identifiers", postgresql.JSONB(), nullable=False),
        sa.Column("authors", postgresql.JSONB(), nullable=False),
        sa.Column("abstract_text", sa.String(), nullable=True),
        sa.Column("source_url", sa.String(2000), nullable=True),
        sa.Column("doi_url", sa.String(2000), nullable=True),
        sa.Column("pmc_url", sa.String(2000), nullable=True),
        sa.Column("publication_types", postgresql.JSONB(), nullable=False),
        sa.Column("review_status", sa.String(50), nullable=False),
        sa.Column("model_parameter_eligible", sa.Boolean(), nullable=False),
        sa.Column("clinical_action_eligible", sa.Boolean(), nullable=False),
        sa.Column("payload", postgresql.JSONB(), nullable=False),
    )
    op.create_index(
        "ix_literature_papers_corpus_version",
        "literature_papers",
        ["corpus_version"],
    )
    op.create_index(
        "ix_literature_papers_publication_year",
        "literature_papers",
        ["publication_year"],
    )
    op.create_index(
        "ix_literature_papers_review_status",
        "literature_papers",
        ["review_status"],
    )


def downgrade() -> None:
    """Remove only the literature table and its indexes."""
    op.drop_index("ix_literature_papers_review_status", table_name="literature_papers")
    op.drop_index("ix_literature_papers_publication_year", table_name="literature_papers")
    op.drop_index("ix_literature_papers_corpus_version", table_name="literature_papers")
    op.drop_table("literature_papers")
