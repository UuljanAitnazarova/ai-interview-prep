# AI Interview Prep Platform

A modern web application that helps you practice interview questions with AI-powered feedback. Record your responses, get instant analysis, and improve your interview skills with personalized guidance.

## Features

**Voice Recording & Analysis**
- Record your answers using your microphone
- Get AI-powered feedback on your responses
- Review transcripts and performance metrics

**Question Management**
- Create custom questions for your practice
- Generate questions from job descriptions
- Filter by category, difficulty, and role
- Access a library of behavioral, technical, and situational questions

**Practice Sessions**
- Interactive practice with real-time feedback
- Track your progress over time
- Monitor session statistics and performance

**Modern Interface**
- Clean, responsive design
- Works on desktop and mobile
- Intuitive user experience

## Tech Stack

**Backend**
- FastAPI (Python web framework)
- SQLAlchemy (database ORM)
- PostgreSQL (database)
- JWT authentication
- OpenAI API integration

**Frontend**
- React 19 with modern hooks
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)

## Getting Started

**Prerequisites**
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL or SQLite

**Installation**

1. Clone the repository
```bash
git clone https://github.com/UuljanAitnazarova/ai-interview-prep.git
cd ai-interview-prep
```

2. Set up the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

4. Open your browser
- Frontend: http://localhost:3001
- API docs: http://localhost:8000/docs

## Project Structure

```
ai-interview-prep/
├── backend/          # FastAPI backend
│   ├── app/         # Main application code
│   ├── alembic/     # Database migrations
│   └── tests/       # Backend tests
├── frontend/        # React frontend
│   ├── src/         # Source code
│   └── public/      # Static assets
└── README.md        # This file
```

## Development

**Backend**
```bash
cd backend
source venv/bin/activate
alembic upgrade head
uvicorn app.main:app --reload
pytest
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
npm run build
```

## Configuration

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost/interview_prep
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-api-key
ALLOWED_ORIGINS=http://localhost:3001
```

## API Endpoints

**Questions**
- `GET /questions/` - Get all questions
- `POST /questions/` - Create question
- `PUT /questions/{id}` - Update question
- `DELETE /questions/{id}` - Delete question

**Recordings**
- `POST /recordings/` - Upload recording
- `GET /recordings/` - Get user recordings

**Authentication**
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
