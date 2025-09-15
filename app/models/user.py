from sqlalchemy import String, Column, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from fastapi_users.db import SQLAlchemyBaseOAuthAccountTableUUID
from sqlalchemy.orm import relationship
from app.db.session import Base
from typing import List

class User(SQLAlchemyBaseOAuthAccountTableUUID, Base):
    __tablename__= "user"
    username = Column(String, unique=True, index=True)
    recordings = relationship("Recording", back_populates="user")
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False),