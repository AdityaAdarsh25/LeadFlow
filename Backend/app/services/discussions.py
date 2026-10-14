from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Lead, Discussion
from app.schemas import DiscussionCreate


def list_discussions(db: Session, lead_id: UUID) -> list[Discussion] | None:
    if db.get(Lead, lead_id) is None:
        return None
    stmt = (
        select(Discussion)
        .where(Discussion.lead_id == lead_id)
        .order_by(Discussion.created_at.desc())
    )
    return list(db.scalars(stmt))


def create_discussion(db: Session, lead_id: UUID, data: DiscussionCreate) -> Discussion | None:
    lead = db.get(Lead, lead_id)
    if lead is None:
        return None
    discussion = Discussion(lead_id=lead_id, note=data.note, follow_up_at=data.follow_up_at)
    db.add(discussion)
    if data.follow_up_at is not None:
        lead.follow_up_at = data.follow_up_at
    db.commit()
    db.refresh(discussion)
    return discussion