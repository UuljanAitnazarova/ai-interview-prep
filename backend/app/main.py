from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import question, recording, users


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:3001", "http://127.0.0.1:3002", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(question.router)
app.include_router(recording.router)
app.include_router(users.router)