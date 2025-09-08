from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class RecordingCreate(BaseModel):
    question_id: int

class RecordingResponse(BaseModel):
    id: uuid.UUID
    question_id: int
    recording_url: str
    created_at: datetime
    updated_at: datetime
    transcript: Optional[str] = None
    duration_seconds: Optional[float] = None
    user_id: Optional[uuid.UUID] = None
    feedback_json: Optional[dict] = None

    class Config:
        orm_mode = True
