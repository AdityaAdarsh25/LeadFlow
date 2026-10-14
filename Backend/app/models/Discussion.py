
import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from app.database import Base
from sqlalchemy import Uuid,DateTime,ForeignKey,Text
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.Lead import Lead

class Discussion(Base):
    __tablename__="discussions"

    id:Mapped[uuid.UUID]=mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    lead: Mapped["Lead"] = relationship(back_populates="discussions")
    lead_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("leads.id", ondelete="CASCADE"), index=True
    )
    note:Mapped[str]=mapped_column(Text)
    follow_up_at:Mapped[datetime | None]=mapped_column(DateTime(timezone=True))
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc))

