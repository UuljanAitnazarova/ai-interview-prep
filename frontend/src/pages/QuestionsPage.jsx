import React, { useState, useEffect } from 'react';
import { MessageCircle, Filter, Search, Plus, Clock, Star, Tag, ChevronDown, Edit, Trash2 } from 'lucide-react';
import { questionsAPI } from '../services/api';
import { questionStorage } from '../services/questionStorage';
import QuestionModal from '../components/QuestionModal';

const QuestionsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedRole, setSelectedRole] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const categories = ['all', 'behavioral', 'technical', 'situational', 'leadership'];
    const difficulties = ['all', 'easy', 'medium', 'hard'];

    // Get unique roles from questions
    const getUniqueRoles = () => {
        const roles = questions
            .filter(q => q.role)
            .map(q => q.role)
            .filter((role, index, self) => self.indexOf(role) === index)
            .sort();
        return ['all', ...roles];
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        filterQuestions();
    }, [questions, searchTerm, selectedCategory, selectedDifficulty, selectedRole]);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);

            // Get questions from API (mock data)
            const response = await questionsAPI.getAll();
            const apiQuestions = response.data;

            // Get questions from local storage
            const localQuestions = questionStorage.getAll();

            // Combine and deduplicate questions
            const allQuestions = [...apiQuestions, ...localQuestions];
            const uniqueQuestions = allQuestions.filter((question, index, self) =>
                index === self.findIndex(q => q.id === question.id)
            );

            setQuestions(uniqueQuestions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            // Fallback to local storage only
            const localQuestions = questionStorage.getAll();
            setQuestions(localQuestions);
        } finally {
            setIsLoading(false);
        }
    };

    const filterQuestions = () => {
        let filtered = questions;

        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (q.role && q.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (q.reasoning && q.reasoning.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(q => q.category === selectedCategory);
        }

        if (selectedDifficulty !== 'all') {
            filtered = filtered.filter(q => q.difficulty_level === selectedDifficulty);
        }

        if (selectedRole !== 'all') {
            filtered = filtered.filter(q => q.role && q.role.toLowerCase().includes(selectedRole.toLowerCase()));
        }

        setFilteredQuestions(filtered);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'behavioral': return '👥';
            case 'technical': return '⚙️';
            case 'situational': return '🎯';
            case 'leadership': return '👑';
            default: return '❓';
        }
    };

    const handleCreateQuestion = () => {
        setEditingQuestion(null);
        setShowModal(true);
    };

    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        setShowModal(true);
    };

    const handleSaveQuestion = (questionData) => {
        if (editingQuestion) {
            // Update existing question
            questionStorage.update(editingQuestion.id, questionData);
            alert('Question updated successfully!');
        } else {
            // Create new question
            questionStorage.add(questionData);
            alert('Question created successfully!');
        }

        // Refresh questions list
        fetchQuestions();
    };

    const handleDeleteQuestion = (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            questionStorage.delete(questionId);
            alert('Question deleted successfully!');
            fetchQuestions();
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingQuestion(null);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Interview Questions</h1>
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
                    <h1 className="text-3xl font-bold text-gray-900">Interview Questions</h1>
                    <p className="text-gray-600 mt-1">Practice with {questions.length} carefully curated questions</p>
                </div>
                <button
                    onClick={handleCreateQuestion}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Category Filter */}
                            <div>
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

                            {/* Difficulty Filter */}
                            <div>
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

                            {/* Role Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {getUniqueRoles().map(role => (
                                        <option key={role} value={role}>
                                            {role === 'all' ? 'All Roles' : role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuestions.map((question) => (
                    <div key={question.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">{getCategoryIcon(question.category)}</span>
                                <div>
                                    <h3 className="font-semibold text-gray-900 capitalize">{question.category}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty_level)}`}>
                                            {question.difficulty_level}
                                        </span>
                                        {question.role && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {question.role}
                                            </span>
                                        )}
                                        {question.is_generated && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Generated
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => handleEditQuestion(question)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit question"
                                >
                                    <Edit className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                                </button>
                                <button
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Delete question"
                                >
                                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-3">{question.question_text}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>2-3 min</span>
                            </div>
                            <button
                                onClick={() => {
                                    // Navigate to practice page with this question selected
                                    window.location.href = '/practice';
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                            >
                                Practice
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredQuestions.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No questions found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            )}

            {/* Question Modal */}
            <QuestionModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveQuestion}
                editingQuestion={editingQuestion}
            />
        </div>
    );
};

export default QuestionsPage;