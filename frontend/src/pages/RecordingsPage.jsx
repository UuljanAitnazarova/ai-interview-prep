import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, Download, Trash2, Mic, Star, Calendar, Filter, Search, MoreVertical } from 'lucide-react';
import { recordingsAPI } from '../services/api';

const RecordingsPage = () => {
    const navigate = useNavigate();
    const [recordings, setRecordings] = useState([]);
    const [filteredRecordings, setFilteredRecordings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);

    useEffect(() => {
        fetchRecordings();
    }, []);

    useEffect(() => {
        filterRecordings();
    }, [recordings, searchTerm, selectedDate]);

    const fetchRecordings = async () => {
        try {
            setIsLoading(true);
            const response = await recordingsAPI.getAll();
            setRecordings(response.data);
        } catch (error) {
            console.error('Error fetching recordings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterRecordings = () => {
        let filtered = recordings;

        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.transcript?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.question_text?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedDate !== 'all') {
            const today = new Date();
            const filterDate = new Date(selectedDate);

            filtered = filtered.filter(r => {
                const recordingDate = new Date(r.created_at || r.uploaded_at);
                return recordingDate.toDateString() === filterDate.toDateString();
            });
        }

        setFilteredRecordings(filtered);
    };

    const handlePlay = (recording) => {
        if (playingId === recording.id) {
            setPlayingId(null);
        } else {
            setPlayingId(recording.id);
            // In a real app, you would play the audio file
            console.log('Playing recording:', recording);
        }
    };

    const handleDownload = (recording) => {
        // In a real app, you would download the audio file
        console.log('Downloading recording:', recording);
    };

    const handleDelete = async (recordingId) => {
        if (window.confirm('Are you sure you want to delete this recording?')) {
            try {
                await recordingsAPI.delete(recordingId);
                setRecordings(recordings.filter(r => r.id !== recordingId));
            } catch (error) {
                console.error('Error deleting recording:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">My Recordings</h1>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Feedback & Analysis</h1>
                    <p className="text-gray-600 mt-1">{recordings.length} practice sessions with AI feedback</p>
                </div>
                <button
                    onClick={() => {
                        // Navigate to practice page to start a new recording
                        navigate('/practice');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                    <Mic className="w-4 h-4" />
                    <span>New Practice Session</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search recordings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </div>

            {/* Recordings List */}
            {filteredRecordings.length > 0 ? (
                <div className="space-y-4">
                    {filteredRecordings.map((recording) => (
                        <div key={recording.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Mic className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {recording.question_text || 'Interview Question'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(recording.created_at || recording.uploaded_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6 mb-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDuration(recording.duration_seconds || 0)}</span>
                                        </div>
                                        {recording.feedback_json?.overall_score && (
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span className={`font-medium ${getScoreColor(recording.feedback_json.overall_score)}`}>
                                                    {recording.feedback_json.overall_score}/10
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {recording.transcript && (
                                        <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                                            {recording.transcript}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handlePlay(recording)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title={playingId === recording.id ? 'Pause' : 'Play'}
                                    >
                                        <Play className={`w-5 h-5 ${playingId === recording.id ? 'text-blue-600' : 'text-gray-400'}`} />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(recording)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(recording.id)}
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No feedback sessions found</h3>
                    <p className="text-gray-500 mb-6">
                        {recordings.length === 0
                            ? "Start practicing to see your AI feedback and analysis here"
                            : "Try adjusting your search criteria"
                        }
                    </p>
                    {recordings.length === 0 && (
                        <button
                            onClick={() => {
                                // Navigate to practice page to start recording
                                navigate('/practice');
                            }}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Start Practice Session
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecordingsPage;