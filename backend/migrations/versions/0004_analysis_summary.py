"""Store generated summaries alongside their analysis provenance."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0004_analysis_summary"
down_revision = "0003_literature_analysis"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Preserve earlier analyses with an explicitly absent summary."""
    op.add_column("literature_analyses", sa.Column("summary", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    """Remove only the summary field added by this revision."""
    op.drop_column("literature_analyses", "summary")
