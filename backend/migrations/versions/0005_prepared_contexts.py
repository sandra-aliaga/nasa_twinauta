"""Store versioned case narratives without changing existing snapshots."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0005_prepared_contexts"
down_revision = "0004_analysis_summary"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create the context history with an assessment reference."""
    op.create_table(
        "prepared_contexts",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "assessment_id",
            sa.String(36),
            sa.ForeignKey("assessments.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("payload", postgresql.JSONB(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )
    op.create_index("ix_prepared_contexts_assessment_id", "prepared_contexts", ["assessment_id"])


def downgrade() -> None:
    """Remove the context table only."""
    op.drop_index("ix_prepared_contexts_assessment_id", table_name="prepared_contexts")
    op.drop_table("prepared_contexts")
