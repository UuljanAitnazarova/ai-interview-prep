from fastapi import APIRouter
from app.auth.users import fastapi_users
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.auth.jwt import auth_backend

router = APIRouter()

router.include_router(
    fastapi_users.get_users_router(UserRead, UserCreate, UserUpdate),
    prefix="",
    tags=["users"],
)

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

