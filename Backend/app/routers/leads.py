from fastapi import APIRouter, Depends, status, Query,HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models.Lead import LeadStatus
from app.schemas import LeadCreate, LeadRead, LeadUpdate
from app.services import leads as lead_service


router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=LeadRead, status_code=status.HTTP_201_CREATED)
def create_lead(data: LeadCreate, db: Session = Depends(get_db)):
    return lead_service.create_lead(db, data)

@router.get("", response_model=list[LeadRead])
def list_leads(
    status_filter: LeadStatus | None = Query(default=None, alias="status"),
    q: str | None = None,
    db: Session = Depends(get_db),
):
    return lead_service.list_leads(db, status_filter, q)

@router.patch("/{lead_id}",response_model=LeadRead)
def update_lead(lead_id:UUID, data:LeadUpdate, db:Session=Depends(get_db)):
    lead = lead_service.update_status(db, lead_id, data.status)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return lead



    
