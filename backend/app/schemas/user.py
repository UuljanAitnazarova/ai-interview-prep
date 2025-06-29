from fastapi_users import schemas
import uuid

class UserRead(schemas.BaseUser):
    id: uuid.UUID
    username: str
    email: str
    is_active: bool

class UserCreate(schemas.BaseUserCreate):
    username: str
    email: str
    password: str

class UserUpdate(schemas.BaseUserUpdate):
    username: str
    email: str
    password: str
