from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecordingBase(BaseModel):
    id: int
    question_id: int
    recording_url: str
    created_at: datetime
    updated_at: datetime
    transcript: Optional[str] = None
    duration_seconds: Optional[float] = None
    user_id: Optional[int] = None
    feedback_json: Optional[dict] = None

class RecordingCreate(RecordingBase):
    pass

class RecordingResponse(RecordingBase):
    class Config:
        orm_mode = True