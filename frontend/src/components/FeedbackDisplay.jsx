import React from 'react';
import { Star, Clock, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

const FeedbackDisplay = ({ feedback, transcript, recordingTime }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 8) return 'bg-green-100';
        if (score >= 6) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Feedback</h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(recordingTime || 0)}</span>
                </div>
            </div>

            {/* Overall Score */}
            {feedback?.overall_score && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-gray-900">Overall Score</h4>
                            <p className="text-sm text-gray-600">Based on AI analysis</p>
                        </div>
                        <div className={`text-3xl font-bold ${getScoreColor(feedback.overall_score)}`}>
                            {feedback.overall_score}/10
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Scores */}
            {feedback?.detailed_scores && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(feedback.detailed_scores).map(([category, score]) => (
                        <div key={category} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 capitalize">
                                    {category.replace('_', ' ')}
                                </h5>
                                <div className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreBgColor(score)} ${getScoreColor(score)}`}>
                                    {score}/10
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${(score / 10) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Strengths */}
            {feedback?.strengths && feedback.strengths.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                        {feedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start space-x-2 text-green-700">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Areas for Improvement */}
            {feedback?.improvements && feedback.improvements.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-semibold text-yellow-800">Areas for Improvement</h4>
                    </div>
                    <ul className="space-y-2">
                        {feedback.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start space-x-2 text-yellow-700">
                                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{improvement}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Transcript */}
            {transcript && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Transcript</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
                </div>
            )}

            {/* General Feedback */}
            {feedback?.general_feedback && (
                <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Additional Feedback</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">{feedback.general_feedback}</p>
                </div>
            )}
        </div>
    );
};

export default FeedbackDisplay;