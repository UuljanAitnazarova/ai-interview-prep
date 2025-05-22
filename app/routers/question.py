from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import models
from app.db.session import get_db
from app.schemas.question import QuestionResponse, QuestionCreate

router = APIRouter(prefix="/questions", tags=["questions"])

@router.get("/", response_model=list[QuestionResponse])
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(models.Question).all()
    return questions

@router.post("/", response_model=QuestionResponse)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = models.Question(text=question.text, category=question.category.value)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question
