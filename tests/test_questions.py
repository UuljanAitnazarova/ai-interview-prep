import pytest
from app.models.models import Question
from app.schemas.question import QuestionCreate
from app.main import app
from app.enums.question_category import QuestionCategory

def test_get_questions_empty(client):
    response = client.get("/questions/")
    assert response.status_code == 200
    assert response.json() == []

def test_create_question(client):
    question_data = {
        "text": "What is FastAPI?",
        "category": QuestionCategory.TECHNICAL.value
    }
    response = client.post("/questions/", json=question_data)
    print(response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["text"] == question_data["text"]
    assert data["category"] == question_data["category"]
    assert "id" in data

def test_get_questions_with_data(client, db):
    question = Question(text="What is FastAPI?", category=QuestionCategory.TECHNICAL.value)
    db.add(question)
    db.commit()
    db.refresh(question) 
    
    response = client.get("/questions/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["text"] == question.text
    assert data[0]["category"] == question.category 