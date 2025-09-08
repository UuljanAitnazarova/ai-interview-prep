import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageCircle, Clock, Star, TrendingUp, Target, Play, ArrowRight } from 'lucide-react';
import { questionsAPI, recordingsAPI } from '../services/api';

const HomePage = ({ onQuestionSelect }) => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [recentRecordings, setRecentRecordings] = useState([]);
    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalRecordings: 0,
        averageScore: 0,
        practiceStreak: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

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

            setStats({
                totalQuestions: questionsResponse.data.length,
                totalRecordings,
                averageScore: Math.round(averageScore * 10) / 10,
                practiceStreak: Math.floor(Math.random() * 7) + 1 // Mock streak
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
            {/* Welcome Section */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to InterviewReady AI
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Practice your interview skills with AI-powered feedback and improve your performance
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalQuestions}</div>
                    <div className="text-sm text-gray-600">Available Questions</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Mic className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalRecordings}</div>
                    <div className="text-sm text-gray-600">Recordings Made</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${getScoreColor(stats.averageScore)}`}>
                        {stats.averageScore || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.practiceStreak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Questions */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Quick Practice</h2>
                        <button
                            onClick={() => navigate('/questions')}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {questions.slice(0, 3).map((question) => (
                            <div
                                key={question.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => onQuestionSelect(question)}
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                        {question.question_text}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            {question.category}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${question.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                                            question.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {question.difficulty_level}
                                        </span>
                                    </div>
                                </div>
                                <Play className="w-4 h-4 text-gray-400 ml-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Recordings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Recordings</h2>
                        <button
                            onClick={() => navigate('/recordings')}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            View All
                        </button>
                    </div>
                    {recentRecordings.length > 0 ? (
                        <div className="space-y-3">
                            {recentRecordings.map((recording) => (
                                <div key={recording.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                            {recording.question_text || 'Interview Question'}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {formatDate(recording.created_at || recording.uploaded_at)}
                                            </span>
                                            {recording.feedback_json?.overall_score && (
                                                <span className={`text-xs font-medium ${getScoreColor(recording.feedback_json.overall_score)}`}>
                                                    {recording.feedback_json.overall_score}/10
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Star className="w-4 h-4 text-yellow-400" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Mic className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No recordings yet</p>
                            <p className="text-gray-400 text-xs">Start practicing to see your recordings here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Ready to Start Practicing?</h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Choose from our library of questions or generate custom ones based on job descriptions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/practice')}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        <Target className="w-4 h-4" />
                        <span>Start Practice Session</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/questions')}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Browse Questions</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;