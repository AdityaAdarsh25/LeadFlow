from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Discussion, Lead, LeadStatus

now = datetime.now(timezone.utc)


def ago(**kw):
    return now - timedelta(**kw)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalars(select(Lead)).first():
            print("Leads already exist, skipping seed.")
            return

        due_today = now + timedelta(hours=1)
        overdue = ago(days=1)
        upcoming = now + timedelta(days=2)

        leads = [
            # Due today, pinned to the top of the list
            Lead(
                name="Sarah Connor", company="Acme Corp", phone="555-0199",
                status=LeadStatus.PROPOSAL_SENT,
                created_at=ago(days=6), follow_up_at=due_today,
                discussions=[
                    Discussion(
                        note="Initial discovery call. They need a CRM for 50 reps. "
                             "Pain points include dropping leads and no follow-up tracking.",
                        created_at=ago(days=6),
                    ),
                    Discussion(
                        note="Sent pricing tier PDF. Said she would review with her boss.",
                        created_at=ago(days=2), follow_up_at=due_today,
                    ),
                ],
            ),
            # Overdue, shown in red
            Lead(
                name="Hank Scorpio", company="Globex", phone="+91 98765 43210",
                status=LeadStatus.CONTACTED,
                created_at=ago(days=5), follow_up_at=overdue,
                discussions=[
                    Discussion(
                        note="Intro call. Interested, but wants to see a demo first.",
                        created_at=ago(days=5),
                    ),
                    Discussion(
                        note="Left a voicemail about the demo slot. Retry tomorrow.",
                        created_at=ago(days=3), follow_up_at=overdue,
                    ),
                ],
            ),
            # Follow-up in the future
            Lead(
                name="Bill Lumbergh", company="Initech", phone="555-0142",
                status=LeadStatus.QUALIFIED,
                created_at=ago(days=4), follow_up_at=upcoming,
                discussions=[
                    Discussion(
                        note="Budget approved for Q4. Decision maker is the VP of Sales.",
                        created_at=ago(days=1), follow_up_at=upcoming,
                    ),
                    Discussion(
                        note="First call. Currently on spreadsheets, open to switching.",
                        created_at=ago(days=4),
                    ),
                ],
            ),
            # Won, no pending follow-up
            Lead(
                name="Anushka Patel", company="Zenith Logistics", phone="+91 91234 56780",
                status=LeadStatus.WON,
                created_at=ago(days=20),
                discussions=[
                    Discussion(note="Contract signed. Onboarding starts Monday.",
                               created_at=ago(days=3)),
                    Discussion(note="Sent final proposal with annual discount.",
                               created_at=ago(days=9)),
                    Discussion(note="Discovery call went well. Team of 30 reps.",
                               created_at=ago(days=19)),
                ],
            ),
            # Lost
            Lead(
                name="Rishabh Singh", company="Finlytics", phone="0120-4567890",
                status=LeadStatus.LOST,
                created_at=ago(days=15),
                discussions=[
                    Discussion(note="Went with a competitor on price. Keep in touch for next year.",
                               created_at=ago(days=7)),
                    Discussion(note="Sent proposal. Asked for a discount we could not match.",
                               created_at=ago(days=12)),
                ],
            ),
            # Brand new: no company, no phone, no discussions
            Lead(name="Mahika Sharma", status=LeadStatus.NEW, created_at=ago(hours=2)),
        ]

        db.add_all(leads)
        db.commit()
        print(f"Seeded {len(leads)} leads.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()