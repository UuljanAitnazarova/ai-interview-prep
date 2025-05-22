from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import models
from app.db.session import get_db
from app.schemas.recording import RecordingResponse, RecordingCreate

router = APIRouter(prefix="/recordings", tags=["recordings"])

@router.get("/", response_model=list[RecordingResponse])
def get_recordings(db: Session = Depends(get_db)):
    recordings = db.query(models.Recording).all()
    return recordings