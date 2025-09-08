from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Literal, Optional
from app.models import models
from app.db.session import get_db
from app.schemas.question import QuestionResponse, QuestionCreate

router = APIRouter(prefix="/questions", tags=["questions"])

# Pydantic models for question generation
class QuestionGenerationRequest(BaseModel):
    job_description: str
    question_types: List[Literal["technical", "behavioral", "cultural"]]
    num_questions_per_type: int = 5
    job_title: Optional[str] = None

class GeneratedQuestion(BaseModel):
    text: str
    category: str
    reasoning: str = ""

class QuestionGenerationResponse(BaseModel):
    questions: List[GeneratedQuestion]
    job_summary: str
    job_title: str

@router.get("/", response_model=list[QuestionResponse])
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(models.Question).all()
    return questions

@router.post("/", response_model=QuestionResponse)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    from datetime import datetime
    
    db_question = models.Question(
        text=question.text, 
        category=question.category.value,
        job_title=question.job_title,
        job_description=question.job_description,
        is_generated=question.is_generated,
        created_at=datetime.utcnow()
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.post("/generate", response_model=QuestionGenerationResponse)
def generate_questions(request: QuestionGenerationRequest):
    """
    Generate personalized interview questions based on job description
    """
    try:
        # For now, we'll return mock questions
        # In a real implementation, this would use OpenAI API or similar
        generated_questions = []
        
        # Mock question generation based on job description and types
        for question_type in request.question_types:
            questions_for_type = generate_mock_questions_for_type(
                request.job_description, 
                question_type, 
                request.num_questions_per_type
            )
            generated_questions.extend(questions_for_type)
        
        # Create job summary and extract job title
        job_summary = create_job_summary(request.job_description)
        job_title = request.job_title or extract_job_title(request.job_description)
        
        return QuestionGenerationResponse(
            questions=generated_questions,
            job_summary=job_summary,
            job_title=job_title
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

def generate_mock_questions_for_type(job_description: str, question_type: str, num_questions: int) -> List[GeneratedQuestion]:
    """Generate mock questions for a specific type based on job description"""
    
    base_questions = {
        "technical": [
            "How would you approach designing a scalable system for this role?",
            "What programming languages and frameworks are you most comfortable with?",
            "Describe a challenging technical problem you solved recently.",
            "How do you ensure code quality and maintainability?",
            "What's your experience with cloud platforms and DevOps practices?",
            "How would you optimize database performance for high-traffic applications?",
            "Describe your experience with microservices architecture.",
            "How do you handle security vulnerabilities in your code?",
            "What's your approach to testing and quality assurance?",
            "How would you design a real-time data processing system?"
        ],
        "behavioral": [
            "Tell me about a time when you had to work under pressure to meet a deadline.",
            "Describe a situation where you had to collaborate with a difficult team member.",
            "Give me an example of how you handled a major project failure.",
            "Tell me about a time when you had to learn a new technology quickly.",
            "Describe a situation where you had to make a difficult decision with limited information.",
            "Tell me about a time when you had to lead a team through a challenging project.",
            "Describe how you handled conflicting priorities from different stakeholders.",
            "Give me an example of when you had to adapt to a significant change in requirements.",
            "Tell me about a time when you had to mentor or train a junior colleague.",
            "Describe a situation where you had to resolve a conflict within your team."
        ],
        "cultural": [
            "What motivates you in your work?",
            "How do you prefer to receive feedback?",
            "Describe your ideal work environment.",
            "How do you stay updated with industry trends?",
            "What does work-life balance mean to you?",
            "How do you handle stress and maintain productivity?",
            "What values are most important to you in a workplace?",
            "How do you approach continuous learning and professional development?",
            "Describe your communication style and how you work with others.",
            "What kind of company culture do you thrive in?"
        ]
    }
    
    # Get questions for the specific type
    type_questions = base_questions.get(question_type, [])
    
    # Select the requested number of questions
    selected_questions = type_questions[:num_questions]
    
    # Create GeneratedQuestion objects
    generated_questions = []
    for i, question_text in enumerate(selected_questions):
        generated_questions.append(GeneratedQuestion(
            text=question_text,
            category=question_type,
            reasoning=f"Generated based on job requirements and {question_type} interview best practices"
        ))
    
    return generated_questions

def extract_job_title(job_description: str) -> str:
    """Extract job title from job description"""
    lines = job_description.split('\n')
    
    # Look for common patterns that indicate job titles
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if not line:
            continue
            
        # Look for lines that might be job titles
        if any(keyword in line.lower() for keyword in ['developer', 'engineer', 'manager', 'analyst', 'designer', 'architect', 'specialist', 'coordinator']):
            # Clean up the line
            title = line.replace('*', '').replace('#', '').replace('-', '').strip()
            if len(title) < 100:  # Reasonable title length
                return title
    
    # Fallback: extract from first meaningful line
    for line in lines[:3]:
        line = line.strip()
        if line and len(line) < 50 and not line.lower().startswith(('we are', 'our company', 'looking for')):
            return line
    
    return "Software Developer"  # Default fallback

def create_job_summary(job_description: str) -> str:
    """Create a summary of the job description"""
    # Simple extraction of key terms (in a real implementation, this would use NLP)
    words = job_description.lower().split()
    
    # Look for common job-related keywords
    tech_keywords = ['python', 'javascript', 'react', 'node', 'java', 'sql', 'aws', 'docker', 'kubernetes']
    role_keywords = ['developer', 'engineer', 'manager', 'analyst', 'designer', 'architect']
    
    found_tech = [word for word in words if word in tech_keywords]
    found_roles = [word for word in words if word in role_keywords]
    
    summary_parts = []
    if found_roles:
        summary_parts.append(f"Role: {', '.join(set(found_roles))}")
    if found_tech:
        summary_parts.append(f"Technologies: {', '.join(set(found_tech))}")
    
    return " | ".join(summary_parts) if summary_parts else "General position"
