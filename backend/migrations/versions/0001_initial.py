"""Create case snapshots and independent action tracking."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create the initial PostgreSQL tables without importing application models."""
    op.create_table(
        "demo_cases",
        sa.Column("id", sa.String(100), primary_key=True),
        sa.Column("payload", postgresql.JSONB(), nullable=False),
    )
    op.create_table(
        "assessments",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("case_id", sa.String(100), sa.ForeignKey("demo_cases.id"), nullable=False),
        sa.Column("payload", postgresql.JSONB(), nullable=False),
        sa.Column("graphs", postgresql.JSONB(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_assessments_case_id", "assessments", ["case_id"])
    op.create_table(
        "action_states",
        sa.Column(
            "assessment_id",
            sa.String(36),
            sa.ForeignKey("assessments.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("action_id", sa.String(150), primary_key=True),
        sa.Column("execution_status", sa.String(20), nullable=False),
        sa.Column("revision", sa.Integer(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("revision >= 0", name="action_revision_nonnegative"),
    )


def downgrade() -> None:
    """Remove only the tables introduced by this revision."""
    op.drop_table("action_states")
    op.drop_index("ix_assessments_case_id", table_name="assessments")
    op.drop_table("assessments")
    op.drop_table("demo_cases")
