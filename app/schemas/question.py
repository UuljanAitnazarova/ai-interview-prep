from pydantic import BaseModel
from typing import Optional
from app.enums.question_category import QuestionCategory

class QuestionBase(BaseModel):
    text: str
    category: Optional[QuestionCategory] = None


class QuestionResponse(QuestionBase):
    id: int

    class Config:
        orm_mode = True  

class QuestionCreate(QuestionBase):
    category: QuestionCategory
