from fastapi import APIRouter, Depends, status, Query,HTTPException
from app.database import get_db
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas import  DiscussionRead, DiscussionCreate
from app.services import discussions as disc_service

router = APIRouter(prefix="/leads/{lead_id}/discussions", tags=["discussions"])

@router.get("", response_model=list[DiscussionRead])
def list_disc(lead_id:UUID, db:Session=Depends(get_db)):
    disc=disc_service.list_discussions(db,lead_id)
    if disc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No discussions exist for user")
    return disc

@router.post("",response_model=DiscussionRead,status_code=status.HTTP_201_CREATED)
def create_disc(lead_id:UUID, data:DiscussionCreate,db:Session=Depends(get_db)):
    disc = disc_service.create_discussion(db, lead_id, data)
    if disc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found",
        )
    return disc