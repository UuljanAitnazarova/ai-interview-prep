import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const QuestionModal = ({ isOpen, onClose, onSave, editingQuestion = null }) => {
    const [formData, setFormData] = useState({
        question_text: editingQuestion?.question_text || '',
        category: editingQuestion?.category || 'behavioral',
        difficulty_level: editingQuestion?.difficulty_level || 'medium',
        role: editingQuestion?.role || '',
        reasoning: editingQuestion?.reasoning || ''
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const categories = ['behavioral', 'technical', 'situational', 'leadership'];
    const difficulties = ['easy', 'medium', 'hard'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.question_text.trim()) {
            newErrors.question_text = 'Question text is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.difficulty_level) {
            newErrors.difficulty_level = 'Difficulty level is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSaving(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const questionData = {
                ...formData,
                id: editingQuestion?.id || Date.now(),
                created_at: new Date().toISOString(),
                is_generated: !!editingQuestion?.is_generated || false
            };

            onSave(questionData);
            handleClose();
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Failed to save question. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setFormData({
            question_text: '',
            category: 'behavioral',
            difficulty_level: 'medium',
            role: '',
            reasoning: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingQuestion ? 'Edit Question' : 'Create New Question'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Text *
                        </label>
                        <textarea
                            name="question_text"
                            value={formData.question_text}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.question_text ? 'border-red-300' : 'border-gray-300'
                                }`}
                            rows={4}
                            placeholder="Enter the interview question..."
                        />
                        {errors.question_text && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.question_text}
                            </p>
                        )}
                    </div>

                    {/* Category and Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Difficulty Level *
                            </label>
                            <select
                                name="difficulty_level"
                                value={formData.difficulty_level}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.difficulty_level ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                {difficulties.map(difficulty => (
                                    <option key={difficulty} value={difficulty}>
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.difficulty_level && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.difficulty_level}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Role (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role (Optional)
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Software Engineer, Product Manager"
                        />
                    </div>

                    {/* Reasoning (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reasoning (Optional)
                        </label>
                        <textarea
                            name="reasoning"
                            value={formData.reasoning}
                            onChange={handleInputChange}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                            placeholder="Why is this question important? What does it assess?"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editingQuestion ? 'Update Question' : 'Create Question'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuestionModal;
