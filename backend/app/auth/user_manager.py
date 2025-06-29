from fastapi_users import BaseUserManager, UUIDIDMixin
from app.models.user import User
import os
import uuid

SECRET = os.getenv("JWT_SECRET")

class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request=None):
        print(f"User {user.id} has registered.")

