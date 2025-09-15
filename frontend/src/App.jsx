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
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);

  useEffect(() => {
    fetchQuestions();
    checkAuthStatus();
    checkFreeTrialStatus();
  }, []);

  const checkFreeTrialStatus = () => {
    const trialUsed = localStorage.getItem('freeTrialUsed');
    setFreeTrialUsed(trialUsed === 'true');
  };

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
      setQuestions([]);
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

    // Check if user is authenticated or has free trial
    if (!isAuthenticated && freeTrialUsed) {
      setShowAuthModal(true);
      return;
    }

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

      // Mark free trial as used if not authenticated
      if (!isAuthenticated && !freeTrialUsed) {
        localStorage.setItem('freeTrialUsed', 'true');
        setFreeTrialUsed(true);
      }
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

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setSelectedQuestion(null);
    setCurrentRecording(null);
    setShowFeedback(false);
    // Show logout message
    alert('You have been logged out successfully.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show limited app for anonymous users or full app for authenticated users
  return (
    <Router>
      <Dashboard user={user} onLogout={handleLogout} isAnonymous={!isAuthenticated} onAuthRequired={() => setShowAuthModal(true)}>
        <Routes>
          <Route path="/" element={
            <HomePage
              onQuestionSelect={handleQuestionSelect}
              isAnonymous={!isAuthenticated}
              freeTrialUsed={freeTrialUsed}
              onAuthRequired={() => setShowAuthModal(true)}
            />
          } />
          <Route path="/questions" element={
            isAuthenticated ? <QuestionsPage /> : <Navigate to="/" replace />
          } />
          <Route path="/recordings" element={
            isAuthenticated ? <RecordingsPage /> : <Navigate to="/" replace />
          } />
          <Route path="/practice" element={
            isAuthenticated ? <PracticePage /> : <Navigate to="/" replace />
          } />
          <Route path="/generate" element={
            isAuthenticated ? <JobDescriptionPage /> : <Navigate to="/" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Dashboard>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </Router>
  );
};

export default App;