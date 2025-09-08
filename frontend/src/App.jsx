import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Mic, Users, MessageCircle, Clock, Star, ArrowRight, LogIn, User } from 'lucide-react';
import QuestionCard from './components/QuestionCard';
import AudioRecorder from './components/AudioRecorder';
import FeedbackDisplay from './components/FeedbackDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import RecordingsPage from './pages/RecordingsPage';
import PracticePage from './pages/PracticePage';
import JobDescriptionPage from './pages/JobDescriptionPage';
import { questionsAPI, recordingsAPI } from './services/api';
import { authService } from './services/auth';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchQuestions();
    checkAuthStatus();
  }, []);

  // Handle selected question from navigation state
  useEffect(() => {
    // This will be handled by the HomePage component when authenticated
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User authenticated:', userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.logout();
    }
  };

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching questions from API...');
      const response = await questionsAPI.getAll();
      console.log('Questions response:', response.data);
      setQuestions(response.data);
      if (response.data.length > 0) {
        setSelectedQuestion(response.data[0]);
        console.log('Selected first question:', response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      console.error('Error details:', error.response?.data);
      // Don't show alert for now, just log the error
      // alert('Failed to load questions. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSelect = (question) => {
    console.log('Question selected:', question);
    setSelectedQuestion(question);
    setCurrentRecording(null);
    setShowFeedback(false);
  };

  const handleRecordingComplete = async (audioBlob) => {
    if (!selectedQuestion) return;

    try {
      console.log('Uploading recording for question:', selectedQuestion.id);
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('question_id', selectedQuestion.id);

      const response = await recordingsAPI.create(formData);
      console.log('Recording upload response:', response.data);
      setCurrentRecording(response.data);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error uploading recording:', error);
      alert('Failed to upload recording. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewRecording = () => {
    setCurrentRecording(null);
    setShowFeedback(false);
  };

  const handleLogin = (authData) => {
    // Extract user data from auth response
    const user = authData.user || {
      email: 'user@example.com',
      username: 'user',
      is_active: true,
      is_verified: true
    };
    setUser(user);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    // Show success message
    alert('Login successful! Welcome to InterviewReady AI.');
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentRecording(null);
    setShowFeedback(false);
    // Show logout message
    alert('You have been logged out successfully.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner message="Loading interview questions..." />
          <p className="mt-4 text-gray-600">Connecting to backend API...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show the landing page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">InterviewReady AI</h1>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Master Your Interview Skills
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Practice with AI-powered feedback and improve your interview performance with personalized insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Questions Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Choose a Question</h3>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isSelected={selectedQuestion?.id === question.id}
                    onSelect={handleQuestionSelect}
                  />
                ))}
              </div>
            </div>

            {/* Recording Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              {!showFeedback ? (
                <>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Record Your Response</h3>
                  </div>

                  {selectedQuestion ? (
                    <AudioRecorder
                      onRecordingComplete={handleRecordingComplete}
                      isUploading={isUploading}
                    />
                  ) : (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-600 mb-2">
                        Select a Question
                      </h4>
                      <p className="text-gray-500">
                        Choose a question from the left to start recording your response
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Your Feedback</h3>
                    </div>
                    <button
                      onClick={handleNewRecording}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Try Another Question</span>
                    </button>
                  </div>

                  <FeedbackDisplay
                    feedback={currentRecording?.feedback_json}
                    transcript={currentRecording?.transcript}
                    recordingTime={currentRecording?.duration_seconds}
                  />
                </>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Choose InterviewReady AI?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Feedback</h4>
                <p className="text-gray-600">
                  Get detailed feedback on your responses with AI analysis of clarity, structure, and content
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Practice Anytime</h4>
                <p className="text-gray-600">
                  Practice at your own pace with a wide variety of interview questions across different categories
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h4>
                <p className="text-gray-600">
                  Monitor your improvement over time with detailed analytics and performance tracking
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold">InterviewReady AI</h4>
            </div>
            <p className="text-gray-400 text-lg">
              © 2025 InterviewReady AI. Built to help you succeed in your interviews.
            </p>
          </div>
        </footer>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  // If authenticated, show the dashboard
  return (
    <Router>
      <Dashboard user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage onQuestionSelect={handleQuestionSelect} />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/recordings" element={<RecordingsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/generate" element={<JobDescriptionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Dashboard>
    </Router>
  );
};

export default App;