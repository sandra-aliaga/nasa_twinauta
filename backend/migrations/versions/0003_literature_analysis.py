"""Persist provider-neutral analysis results for literature candidates."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0003_literature_analysis"
down_revision = "0002_literature_candidates"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create versionable analysis records without changing paper review state."""
    op.create_table(
        "literature_analyses",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "paper_id",
            sa.String(150),
            sa.ForeignKey("literature_papers.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("input_basis", sa.String(20), nullable=False),
        sa.Column("input_sha256", sa.String(64), nullable=True),
        sa.Column("prompt_version", sa.String(100), nullable=True),
        sa.Column("model_id", sa.String(200), nullable=True),
        sa.Column("status", sa.String(20), nullable=False),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("items", postgresql.JSONB(), nullable=False),
        sa.Column("failure_reason", sa.String(2000), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.create_index(
        "ix_literature_analyses_paper_id",
        "literature_analyses",
        ["paper_id"],
    )


def downgrade() -> None:
    """Remove only the analysis records introduced by this revision."""
    op.drop_index("ix_literature_analyses_paper_id", table_name="literature_analyses")
    op.drop_table("literature_analyses")
