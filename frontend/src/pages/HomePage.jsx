import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageCircle, Clock, Star, TrendingUp, Target, Play, ArrowRight } from 'lucide-react';
import { questionsAPI, recordingsAPI } from '../services/api';
import AudioRecorder from '../components/AudioRecorder';
import FeedbackDisplay from '../components/FeedbackDisplay';

const HomePage = ({ onQuestionSelect, isAnonymous = false, freeTrialUsed = false, onAuthRequired }) => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [recentRecordings, setRecentRecordings] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [currentRecording, setCurrentRecording] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [stats, setStats] = useState({
        totalQuestions: 0,
        questionsPracticed: 0,
        totalRecordings: 0,
        averageScore: 0,
        practiceStreak: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const calculatePracticeStreak = (recordings) => {
        if (recordings.length === 0) return 0;

        // Sort recordings by date (most recent first)
        const sortedRecordings = recordings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Get unique practice dates
        const practiceDates = [...new Set(sortedRecordings.map(r =>
            new Date(r.created_at).toDateString()
        ))].sort((a, b) => new Date(b) - new Date(a));

        if (practiceDates.length === 0) return 0;

        // Calculate consecutive days from today
        let streak = 0;
        const today = new Date();
        const todayString = today.toDateString();

        // Check if practiced today
        if (practiceDates[0] === todayString) {
            streak = 1;
            let currentDate = new Date(today);

            for (let i = 1; i < practiceDates.length; i++) {
                currentDate.setDate(currentDate.getDate() - 1);
                const expectedDateString = currentDate.toDateString();

                if (practiceDates[i] === expectedDateString) {
                    streak++;
                } else {
                    break;
                }
            }
        }

        return streak;
    };

    const handleQuestionSelect = (question) => {
        setSelectedQuestion(question);
        setCurrentRecording(null);
        setShowFeedback(false);
        onQuestionSelect(question);
    };

    const handleRecordingComplete = async (audioBlob) => {
        if (!selectedQuestion) return;

        // Check if user is anonymous and has used free trial
        if (isAnonymous && freeTrialUsed) {
            onAuthRequired();
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.wav');
            formData.append('question_id', selectedQuestion.id);

            // Use the recordings API
            const response = await recordingsAPI.create(formData);
            const recording = response.data;

            setCurrentRecording(recording);
            setShowFeedback(true);

            // Refresh data to update stats
            fetchData();
        } catch (error) {
            console.error('Error processing recording:', error);
            alert('Error processing recording. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [questionsResponse, recordingsResponse] = await Promise.all([
                questionsAPI.getAll(),
                recordingsAPI.getAll()
            ]);

            setQuestions(questionsResponse.data);
            setRecentRecordings(recordingsResponse.data.slice(0, 3));

            // Calculate stats
            const recordings = recordingsResponse.data;
            const totalRecordings = recordings.length;
            const averageScore = recordings.length > 0
                ? recordings.reduce((sum, r) => sum + (r.feedback_json?.overall_score || 0), 0) / recordings.length
                : 0;

            // Calculate questions practiced (unique questions from recordings)
            const questionsPracticed = new Set(recordings.map(r => r.question_id)).size;

            // Calculate practice streak (consecutive days with at least one recording)
            const practiceStreak = calculatePracticeStreak(recordings);

            setStats({
                totalQuestions: questionsResponse.data.length,
                questionsPracticed,
                totalRecordings,
                averageScore: Math.round(averageScore * 10) / 10,
                practiceStreak
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to InterviewReady AI</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-12 w-12 bg-gray-200 rounded-lg mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                <div className="relative text-center">
                    <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-blue-500/30">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-100">AI-Powered Interview Practice</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent mb-6">
                        Master Your Interview Skills
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                        Practice with personalized questions, get instant AI feedback, and boost your confidence for any interview
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/questions')}
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Browse Questions</span>
                        </button>
                        <button
                            onClick={() => navigate('/practice')}
                            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/30"
                        >
                            <Target className="w-5 h-5" />
                            <span>Start Practice</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-white rounded-2xl shadow-sm p-6 text-center border border-slate-200 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                        <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">{stats.totalQuestions}</div>
                    <div className="text-sm font-medium text-slate-600">Available Questions</div>
                </div>

                <div className="group bg-white rounded-2xl shadow-sm p-6 text-center border border-slate-200 hover:shadow-lg hover:shadow-indigo-200/50 transition-all duration-200 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                        <Mic className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">{stats.totalRecordings}</div>
                    <div className="text-sm font-medium text-slate-600">Practice Sessions</div>
                </div>

                <div className="group bg-white rounded-2xl shadow-sm p-6 text-center border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                        <Star className="w-7 h-7 text-white" />
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(stats.averageScore)}`}>
                        {stats.averageScore || 'N/A'}
                    </div>
                    <div className="text-sm font-medium text-slate-600">Average Score</div>
                </div>

                <div className="group bg-white rounded-2xl shadow-sm p-6 text-center border border-slate-200 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                        <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">{stats.practiceStreak}</div>
                    <div className="text-sm font-medium text-slate-600">Days Streak</div>
                </div>
            </div>

            {/* Free Trial Message for Anonymous Users */}
            {isAnonymous && (
                <div className={`relative overflow-hidden rounded-2xl p-8 border-2 ${freeTrialUsed
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                    }`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                    <div className="relative flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${freeTrialUsed
                                ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                }`}>
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className={`text-2xl font-bold mb-2 ${freeTrialUsed ? 'text-amber-800' : 'text-blue-800'
                                    }`}>
                                    {freeTrialUsed ? 'Free Trial Used' : 'Free Trial Available'}
                                </h3>
                                <p className={`text-lg ${freeTrialUsed ? 'text-amber-700' : 'text-blue-700'
                                    }`}>
                                    {freeTrialUsed
                                        ? "You've used your free trial. Sign up to unlock unlimited personalized feedback."
                                        : "Get 1 free AI feedback session. Sign up for unlimited access."
                                    }
                                </p>
                            </div>
                        </div>
                        {freeTrialUsed && (
                            <button
                                onClick={onAuthRequired}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Sign Up Now
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Recording Section */}
            {selectedQuestion && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <Mic className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Practice Session</h2>
                                <p className="text-sm text-slate-600 mt-1">Selected Question</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedQuestion(null);
                                setCurrentRecording(null);
                                setShowFeedback(false);
                            }}
                            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-900 font-semibold text-lg leading-relaxed mb-4">{selectedQuestion.question_text}</p>
                                <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        {selectedQuestion.category}
                                    </span>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${selectedQuestion.difficulty_level === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                                        selectedQuestion.difficulty_level === 'medium' ? 'bg-amber-100 text-amber-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedQuestion.difficulty_level}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!showFeedback ? (
                        <AudioRecorder
                            onRecordingComplete={handleRecordingComplete}
                            isUploading={isUploading}
                            isTrialUsed={isAnonymous && freeTrialUsed}
                            onAuthRequired={onAuthRequired}
                        />
                    ) : (
                        <FeedbackDisplay
                            recording={currentRecording}
                            onNewRecording={() => {
                                setCurrentRecording(null);
                                setShowFeedback(false);
                            }}
                        />
                    )}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Questions */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Quick Practice</h2>
                        </div>
                        <button
                            onClick={() => navigate('/questions')}
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                        >
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {questions.slice(0, 3).map((question) => (
                            <div
                                key={question.id}
                                className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer border border-slate-100 hover:border-blue-200 hover:shadow-md"
                                onClick={() => handleQuestionSelect(question)}
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-900 transition-colors">
                                        {question.question_text}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            {question.category}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${question.difficulty_level === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                                            question.difficulty_level === 'medium' ? 'bg-amber-100 text-amber-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {question.difficulty_level}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                    <Play className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Practice Sessions */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Mic className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Recent Practice Sessions</h2>
                        </div>
                        <button
                            onClick={() => navigate('/recordings')}
                            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                        >
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    {recentRecordings.length > 0 ? (
                        <div className="space-y-4">
                            {recentRecordings.map((recording) => (
                                <div key={recording.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl hover:from-indigo-50 hover:to-indigo-100 transition-all duration-200 border border-slate-100 hover:border-indigo-200 hover:shadow-md">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900 line-clamp-1 mb-2 group-hover:text-indigo-900 transition-colors">
                                            {recording.question_text || 'Interview Question'}
                                        </p>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xs text-slate-500">
                                                {formatDate(recording.created_at || recording.uploaded_at)}
                                            </span>
                                            {recording.feedback_json?.overall_score && (
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getScoreColor(recording.feedback_json.overall_score)}`}>
                                                    {recording.feedback_json.overall_score}/10
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                        <Star className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Mic className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-semibold mb-2">No practice sessions yet</p>
                            <p className="text-slate-500 text-sm">Start practicing to see your sessions here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Call to Action */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 text-center text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                <div className="relative">
                    <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-blue-500/30">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Ready to excel in your interviews?</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Practicing?</h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Choose from our library of questions or generate custom ones based on job descriptions. Get AI-powered feedback to improve your interview skills.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/practice')}
                            className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                        >
                            <Target className="w-5 h-5" />
                            <span>Start Practice</span>
                        </button>
                        <button
                            onClick={() => navigate('/questions')}
                            className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-semibold text-lg border border-white/20 hover:border-white/30"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Browse Questions</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;