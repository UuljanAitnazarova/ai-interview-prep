from sqlalchemy import String, Column, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import relationship
from app.db.session import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.models import Recording

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__= "user"
    username = Column(String, unique=True, index=True)
    recordings = relationship("Recording", back_populates="user")