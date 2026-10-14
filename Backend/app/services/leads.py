from sqlalchemy import Select
from sqlalchemy.orm import Session
from uuid import UUID
from app.models import Lead, LeadStatus, Discussion
from app.schemas import LeadCreate, LeadRead


def create_lead(db: Session, data: LeadCreate) -> Lead:
    lead = Lead(**data.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

def list_leads(db: Session, status: LeadStatus | None= None,q:str | None = None):
    latest=(
        Select(Discussion.lead_id,Discussion.note,Discussion.created_at)
        .distinct(Discussion.lead_id)
        .order_by(Discussion.lead_id,Discussion.created_at.desc())
        .subquery()
    )
    stmt=(
        Select(
            Lead,
            latest.c.note.label("last_note"),
            latest.c.created_at.label("last_note_at")
        )
        .outerjoin(latest, latest.c.lead_id == Lead.id)
        .order_by(Lead.created_at.desc())
    )

    if status is not None:
        stmt= stmt.where(Lead.status==status)
    if q:
        stmt = stmt.where(Lead.name.ilike(f"%{q}%"))

    rows=db.execute(stmt).all()
    return [
        LeadRead.model_validate(lead).model_copy(
            update={"last_note": note, "last_note_at": note_at}
        )
        for lead, note, note_at in rows
    ]

def update_status(db: Session, lead_id:UUID, new_status: LeadStatus) -> Lead | None:
    lead = db.get(Lead, lead_id)
    if lead is None:
        return None
    lead.status = new_status
    db.commit()
    db.refresh(lead)
    return lead
