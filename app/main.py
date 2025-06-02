from fastapi import FastAPI
from app.routers import question, recording, users


app = FastAPI()

app.include_router(question.router)
app.include_router(recording.router)
app.include_router(users.router)