from fastapi_users import FastAPIUsers
from fastapi import Depends
from app.models.user import User
from app.db.user_db import get_user_db
from app.auth.jwt import auth_backend
from app.auth.user_manager import UserManager
import uuid

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)

