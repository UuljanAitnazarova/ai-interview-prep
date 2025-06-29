from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecordingCreate(BaseModel):
    question_id: int

class RecordingResponse(BaseModel):
    id: int
    question_id: int
    recording_url: str
    created_at: datetime
    updated_at: datetime
    transcript: Optional[str] = None
    duration_seconds: Optional[float] = None
    user_id: Optional[int] = None
    feedback_json: Optional[dict] = None

    class Config:
        orm_mode = True
