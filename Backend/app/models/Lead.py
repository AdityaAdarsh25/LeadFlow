import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Uuid

from app.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.Discussion import Discussion

class LeadStatus(str, enum.Enum):
    NEW="new"
    CONTACTED="contacted"
    QUALIFIED="qualified"
    PROPOSAL_SENT="proposal_sent"
    WON="won"
    LOST="lost"

class Lead(Base):
    __tablename__ = "leads"
    id:Mapped[uuid.UUID]=mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name:Mapped[str]=mapped_column(String(120))
    company:Mapped[str | None]=mapped_column(String(120))
    phone:Mapped[str | None] = mapped_column(String(20))
    status:Mapped[LeadStatus]=mapped_column(Enum(LeadStatus,native_enum=False,values_callable=lambda e: [m.value for m in e]),
                                            default=LeadStatus.NEW)
    follow_up_at:Mapped[datetime | None]=mapped_column(DateTime(timezone=True))
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc))
    discussions: Mapped[list["Discussion"]] = relationship(
        back_populates="lead", cascade="all, delete-orphan"
    )