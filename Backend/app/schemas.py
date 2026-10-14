import uuid
from datetime import datetime,timezone
from pydantic import BaseModel, ConfigDict, Field,AwareDatetime

from app.models import LeadStatus

class LeadCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str= Field(min_length=1, max_length=120)
    company: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=20)
    status:LeadStatus=LeadStatus.NEW

class DiscussionCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    note: str = Field(min_length=1)
    follow_up_at: AwareDatetime | None = None
    

class LeadUpdate(BaseModel):
    status: LeadStatus

class DiscussionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    lead_id: uuid.UUID
    note: str
    follow_up_at: datetime | None
    created_at: datetime

class LeadRead(BaseModel):
    model_config=ConfigDict(from_attributes=True)

    id:uuid.UUID
    name: str
    company: str | None
    phone: str | None
    status: LeadStatus
    follow_up_at: datetime | None
    created_at: datetime
    last_note: str | None = None
    last_note_at: datetime | None = None



