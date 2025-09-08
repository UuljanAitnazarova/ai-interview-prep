import os, shutil, json
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.models import models
from app.db.session import get_db
from app.schemas.recording import RecordingResponse, RecordingCreate
from datetime import datetime, timezone
from app.utils.transcription import upload_file, transcribe_audio
from app.utils.feedback import generate_feedback
from app.auth.users import current_active_user
from app.models.user import User

router = APIRouter(prefix="/recordings", tags=["recordings"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=list[RecordingResponse])
def get_recordings(db: Session = Depends(get_db), user: User = Depends(current_active_user)):
    recordings = db.query(models.Recording).filter(models.Recording.user_id == user.id).all()
    return recordings


@router.post("/", response_model=RecordingResponse)
def create_recording(question_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(current_active_user)):
    timestamp = datetime.now(timezone.utc).timestamp()
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    now = datetime.now(timezone.utc)
    recording = models.Recording(
        question_id=question_id,
        recording_url=filepath,
        user_id=user.id,
        created_at=now,
        updated_at=now,
    )
    upload_url = upload_file(filepath)
    transcript = transcribe_audio(upload_url)
    recording.transcript = transcript
    feedback = generate_feedback(transcript)
    recording.feedback_json = json.loads(feedback)
    db.add(recording)
    db.commit()
    db.refresh(recording)
    feedback = generate_feedback(transcript)
    return recording

