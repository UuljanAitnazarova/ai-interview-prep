# AI Interview Prep Platform

A comprehensive full-stack application that helps users practice interview questions with AI-powered feedback, voice recording capabilities, and intelligent question generation based on job descriptions.

## 🚀 Features

### 🎤 **Voice Recording & Analysis**
- Record responses to interview questions using your microphone
- Real-time audio playback and controls
- AI-powered transcription and analysis
- Detailed feedback on clarity, structure, and content

### 📝 **Question Management**
- **Create Custom Questions**: Add your own interview questions with categories and difficulty levels
- **AI Question Generation**: Upload job descriptions to automatically generate relevant questions
- **Smart Filtering**: Filter questions by category, difficulty, role, and source
- **Question Library**: Comprehensive database of behavioral, technical, and situational questions

### 🎯 **Practice Modes**
- **Practice Sessions**: Interactive practice with real-time feedback
- **Mock Interviews**: Simulate real interview conditions
- **Progress Tracking**: Monitor your improvement over time
- **Session Statistics**: Track practice time, questions answered, and performance metrics

### 🤖 **AI-Powered Features**
- **Intelligent Feedback**: Get detailed analysis of your responses
- **Job-Specific Questions**: Generate questions tailored to specific roles
- **Performance Insights**: Understand your strengths and areas for improvement
- **Smart Recommendations**: Get suggestions for better responses

### 🎨 **Modern User Experience**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Intuitive Interface**: Clean, modern UI with Tailwind CSS
- **Real-time Updates**: Live feedback and instant results
- **Accessibility**: Built with accessibility best practices

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **RESTful API**: FastAPI-based backend with automatic documentation
- **Database**: SQLAlchemy with Alembic migrations
- **Authentication**: JWT-based user authentication
- **AI Integration**: OpenAI API for question generation and feedback
- **File Management**: Secure audio file handling and storage

### Frontend (React + Vite)
- **Modern React**: Built with React 19 and modern hooks
- **Component Architecture**: Reusable, maintainable components
- **State Management**: React Context and local state
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for consistent iconography

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (or SQLite for development)
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/UuljanAitnazarova/ai-interview-prep.git
cd ai-interview-prep
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
ai-interview-prep/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── auth/           # Authentication modules
│   │   ├── db/             # Database configuration
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   └── utils/          # Utility functions
│   ├── alembic/            # Database migrations
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
│   └── public/             # Static assets
└── README.md              # This file
```

## 🛠️ Development

### Backend Development
```bash
cd backend
# Activate virtual environment
source venv/bin/activate

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload

# Run tests
pytest
```

### Frontend Development
```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/interview_prep

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5173
```

## 📊 API Endpoints

### Questions
- `GET /questions/` - Get all questions
- `POST /questions/` - Create new question
- `GET /questions/{id}` - Get specific question
- `PUT /questions/{id}` - Update question
- `DELETE /questions/{id}` - Delete question

### Recordings
- `POST /recordings/` - Upload recording and get feedback
- `GET /recordings/` - Get user recordings
- `GET /recordings/{id}` - Get specific recording

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- FastAPI for the excellent Python framework
- React team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for better interview preparation**