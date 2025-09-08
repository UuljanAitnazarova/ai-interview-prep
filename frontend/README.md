# InterviewReady AI Frontend

A modern React-based frontend for the InterviewReady AI platform that allows users to practice interview questions with voice recording and AI-powered feedback.

## Features

- 🎤 **Voice Recording**: Record your responses to interview questions using your microphone
- 🤖 **AI Feedback**: Get instant, detailed feedback on your responses
- 📝 **Question Categories**: Practice with technical, behavioral, and cultural questions
- 📊 **Progress Tracking**: View transcripts and performance metrics
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Select a Question**: Choose from the available interview questions on the left panel
2. **Record Your Response**: Click "Start Recording" and speak your answer
3. **Submit**: Click "Submit Response" to upload and get AI feedback
4. **Review Feedback**: View detailed feedback on clarity, structure, tone, and language
5. **Try Again**: Practice with different questions to improve your skills

## Components

- **QuestionCard**: Displays individual interview questions with category badges
- **AudioRecorder**: Handles voice recording with start/stop controls and audio playback
- **FeedbackDisplay**: Shows AI-generated feedback and performance metrics
- **LoadingSpinner**: Provides loading states during API calls

## API Integration

The frontend integrates with the backend API endpoints:

- `GET /questions/` - Fetch all available questions
- `POST /recordings/` - Upload audio recording and get feedback

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- Axios
- Lucide React (icons)
- Web Audio API

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── AudioRecorder.jsx
│   ├── FeedbackDisplay.jsx
│   ├── LoadingSpinner.jsx
│   └── QuestionCard.jsx
├── hooks/              # Custom React hooks
│   └── useAudioRecorder.js
├── services/           # API services
│   └── api.js
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: Microphone access is required for recording functionality.