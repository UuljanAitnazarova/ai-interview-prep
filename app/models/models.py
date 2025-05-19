from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    category = Column(String, nullable=True)