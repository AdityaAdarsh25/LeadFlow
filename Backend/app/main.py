from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.database import Base, engine
from app import models
from app.routers import leads,discussions



@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="LeadFlow API", lifespan=lifespan)

from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health():
    return {"status": "ok"}



app.include_router(leads.router)
app.include_router(discussions.router)
