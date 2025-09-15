import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mic, Play, Pause, Square, RotateCcw, Settings, Timer, Target, TrendingUp } from 'lucide-react';
import { questionsAPI } from '../services/api';
import AudioRecorder from '../components/AudioRecorder';
import FeedbackDisplay from '../components/FeedbackDisplay';

const PracticePage = () => {
    const location = useLocation();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentRecording, setCurrentRecording] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [practiceMode, setPracticeMode] = useState('random'); // random, category, difficulty
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [sessionStats, setSessionStats] = useState({
        totalQuestions: 0,
        completedQuestions: 0,
        averageScore: 0,
        timeSpent: 0
    });

    const categories = ['all', 'behavioral', 'technical', 'situational', 'leadership'];
    const difficulties = ['all', 'easy', 'medium', 'hard'];

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        // Check if a specific question was passed via navigation state
        if (location.state?.selectedQuestion) {
            setCurrentQuestion(location.state.selectedQuestion);
            setPracticeMode('specific');
        } else if (questions.length > 0) {
            selectNextQuestion();
        }
    }, [questions, practiceMode, selectedCategory, selectedDifficulty, location.state]);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const response = await questionsAPI.getAll();
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectNextQuestion = () => {
        // If we're in specific mode and already have a question, don't change it
        if (practiceMode === 'specific' && currentQuestion) {
            return;
        }

        let filteredQuestions = questions;

        if (selectedCategory !== 'all') {
            filteredQuestions = filteredQuestions.filter(q => q.category === selectedCategory);
        }

        if (selectedDifficulty !== 'all') {
            filteredQuestions = filteredQuestions.filter(q => q.difficulty_level === selectedDifficulty);
        }

        if (filteredQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
            setCurrentQuestion(filteredQuestions[randomIndex]);
        }
    };

    const handleRecordingComplete = async (audioBlob) => {
        if (!currentQuestion) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.wav');
            formData.append('question_id', currentQuestion.id);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockResponse = {
                id: Date.now(),
                question_id: currentQuestion.id,
                transcript: "This is a mock transcript of your recording for practice purposes.",
                duration_seconds: 30,
                feedback_json: {
                    overall_score: Math.floor(Math.random() * 4) + 6, // Random score between 6-10
                    detailed_scores: {
                        clarity: Math.floor(Math.random() * 4) + 6,
                        structure: Math.floor(Math.random() * 4) + 6,
                        content: Math.floor(Math.random() * 4) + 6,
                        confidence: Math.floor(Math.random() * 4) + 6
                    },
                    strengths: [
                        "Clear articulation",
                        "Good structure in your response",
                        "Relevant examples provided"
                    ],
                    improvements: [
                        "Try to be more specific with examples",
                        "Work on reducing filler words",
                        "Consider adding more quantifiable results"
                    ],
                    general_feedback: "Great practice session! You're showing improvement in your communication skills. Keep practicing to build more confidence."
                }
            };

            setCurrentRecording(mockResponse);
            setShowFeedback(true);
            updateSessionStats(mockResponse.feedback_json.overall_score);
        } catch (error) {
            console.error('Error processing recording:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const updateSessionStats = (score) => {
        setSessionStats(prev => ({
            ...prev,
            completedQuestions: prev.completedQuestions + 1,
            averageScore: ((prev.averageScore * prev.completedQuestions) + score) / (prev.completedQuestions + 1),
            timeSpent: prev.timeSpent + 30 // Mock time spent
        }));
    };

    const handleNextQuestion = () => {
        setCurrentRecording(null);
        setShowFeedback(false);

        // If we're in specific mode, switch to random mode for next question
        if (practiceMode === 'specific') {
            setPracticeMode('random');
        }

        selectNextQuestion();
    };

    const handleNewSession = () => {
        setCurrentRecording(null);
        setShowFeedback(false);
        setCurrentQuestion(null);
        setSessionStats({
            totalQuestions: 0,
            completedQuestions: 0,
            averageScore: 0,
            timeSpent: 0
        });
        selectNextQuestion();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Practice Session</h1>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Practice Session</h1>
                <p className="text-gray-600">Practice your interview skills with real-time feedback</p>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{sessionStats.completedQuestions}</div>
                    <div className="text-sm text-gray-600">Questions Completed</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{sessionStats.averageScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Timer className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatTime(sessionStats.timeSpent)}</div>
                    <div className="text-sm text-gray-600">Time Spent</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Settings className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{practiceMode}</div>
                    <div className="text-sm text-gray-600">Practice Mode</div>
                </div>
            </div>

            {/* Practice Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Practice Mode</label>
                        <select
                            value={practiceMode}
                            onChange={(e) => setPracticeMode(e.target.value)}
                            disabled={practiceMode === 'specific'}
                            className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${practiceMode === 'specific' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="random">Random Questions</option>
                            <option value="category">By Category</option>
                            <option value="difficulty">By Difficulty</option>
                            <option value="specific" disabled>Specific Question (Selected from Questions page)</option>
                        </select>
                        {practiceMode === 'specific' && (
                            <p className="mt-1 text-sm text-blue-600">
                                Practicing with a specific question. Click "Next Question" to switch to random mode.
                            </p>
                        )}
                    </div>
                    {practiceMode === 'category' && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {practiceMode === 'difficulty' && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleNewSession}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>New Session</span>
                    </button>
                </div>
            </div>

            {/* Practice Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Question Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Question</h3>
                    {currentQuestion ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    {currentQuestion.category}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${currentQuestion.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                                    currentQuestion.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {currentQuestion.difficulty_level}
                                </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{currentQuestion.question_text}</p>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No questions available</p>
                        </div>
                    )}
                </div>

                {/* Recording Area */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Your Response</h3>
                    {!showFeedback ? (
                        <AudioRecorder
                            onRecordingComplete={handleRecordingComplete}
                            isUploading={isUploading}
                        />
                    ) : (
                        <div className="space-y-4">
                            <FeedbackDisplay
                                feedback={currentRecording?.feedback_json}
                                transcript={currentRecording?.transcript}
                                recordingTime={currentRecording?.duration_seconds}
                            />
                            <button
                                onClick={handleNextQuestion}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Next Question
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticePage;