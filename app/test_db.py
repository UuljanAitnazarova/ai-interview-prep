from app.models.models import Question
from app.db.session import SessionLocal

db = SessionLocal()
sample = Question(text="What is FastAPI?", category="technical")
db.add(sample)
db.commit()

