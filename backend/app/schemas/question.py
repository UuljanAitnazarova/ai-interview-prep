from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.enums.question_category import QuestionCategory

class QuestionBase(BaseModel):
    text: str
    category: Optional[QuestionCategory] = None
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    is_generated: Optional[bool] = False


class QuestionResponse(QuestionBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True  

class QuestionCreate(QuestionBase):
    category: QuestionCategory
