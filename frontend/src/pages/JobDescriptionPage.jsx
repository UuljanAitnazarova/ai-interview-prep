import React, { useState } from 'react';
import { FileText, Upload, Wand2, X, Download, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { questionStorage } from '../services/questionStorage';

const JobDescriptionPage = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [roleName, setRoleName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [extractedRole, setExtractedRole] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                setJobDescription(e.target.result);
                setUploadedFile(file);
                setIsUploading(false);
                // Show success message
                alert(`File "${file.name}" uploaded successfully!`);
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                setIsUploading(false);
            };
            reader.readAsText(file);
        }
    };

    const handleGenerateQuestions = async () => {
        if (!jobDescription.trim()) return;

        setIsGenerating(true);

        // Use provided role name or extract from job description
        let finalRole = roleName.trim();
        if (!finalRole) {
            const roleMatch = jobDescription.match(/(?:position|role|job)\s+(?:of\s+)?(?:a\s+)?([A-Z][a-zA-Z\s]+?)(?:\s|,|\.|$)/i);
            finalRole = roleMatch ? roleMatch[1].trim() : 'General Role';
        }
        setExtractedRole(finalRole);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000));

        const mockQuestions = [
            {
                id: Date.now() + 1,
                question_text: "Can you walk me through your experience with the technologies mentioned in this role?",
                category: "technical",
                difficulty_level: "medium",
                reasoning: "Tests technical knowledge relevant to the job",
                role: finalRole,
                company: companyName.trim() || 'This Company',
                is_generated: true
            },
            {
                id: Date.now() + 2,
                question_text: "How would you approach solving a complex problem in this domain?",
                category: "situational",
                difficulty_level: "hard",
                reasoning: "Evaluates problem-solving approach",
                role: finalRole,
                company: companyName.trim() || 'This Company',
                is_generated: true
            },
            {
                id: Date.now() + 3,
                question_text: "Tell me about a time you had to work with a difficult team member.",
                category: "behavioral",
                difficulty_level: "medium",
                reasoning: "Assesses interpersonal skills",
                role: finalRole,
                company: companyName.trim() || 'This Company',
                is_generated: true
            },
            {
                id: Date.now() + 4,
                question_text: "What interests you most about this position and our company?",
                category: "behavioral",
                difficulty_level: "easy",
                reasoning: "Tests motivation and cultural fit",
                role: finalRole,
                company: companyName.trim() || 'This Company',
                is_generated: true
            },
            {
                id: Date.now() + 5,
                question_text: "How do you stay updated with industry trends and best practices?",
                category: "behavioral",
                difficulty_level: "easy",
                reasoning: "Evaluates continuous learning mindset",
                role: finalRole,
                company: companyName.trim() || 'This Company',
                is_generated: true
            }
        ];

        setGeneratedQuestions(mockQuestions);
        setIsGenerating(false);
    };

    const handleCopyQuestion = async (questionText, index) => {
        try {
            await navigator.clipboard.writeText(questionText);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = questionText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        }
    };

    const handleDownloadQuestions = () => {
        const questionsText = generatedQuestions.map((q, index) =>
            `${index + 1}. ${q.question_text}\n   Category: ${q.category}\n   Difficulty: ${q.difficulty_level}\n   Reasoning: ${q.reasoning}\n`
        ).join('\n');

        const blob = new Blob([questionsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-interview-questions.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSaveToQuestions = () => {
        if (generatedQuestions.length === 0) {
            alert('No questions to save. Please generate questions first.');
            return;
        }

        // Save each generated question to local storage
        generatedQuestions.forEach(question => {
            questionStorage.add(question);
        });

        alert(`Successfully saved ${generatedQuestions.length} questions to your question library! You can now find them in the Questions section.`);

        // Clear the generated questions
        setGeneratedQuestions([]);
        setJobDescription('');
        setRoleName('');
        setCompanyName('');
        setUploadedFile(null);
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Generate Questions</h1>
                <p className="text-gray-600">Upload a job description to generate custom interview questions</p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>

                {/* File Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Job Description File
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".txt,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            {isUploading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-gray-600">Processing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Upload className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-600">Click to upload or drag and drop</span>
                                </div>
                            )}
                        </label>
                    </div>
                    {uploadedFile && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Uploaded: {uploadedFile.name}</span>
                            <button
                                onClick={() => {
                                    setUploadedFile(null);
                                    setJobDescription('');
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Role and Company Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="e.g., Software Engineer, Product Manager"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to auto-extract from job description</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g., Google, Microsoft, Startup Inc"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Will be used in generated questions</p>
                    </div>
                </div>

                {/* Text Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or paste job description text
                    </label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={8}
                    />
                </div>

                {/* Generate Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleGenerateQuestions}
                        disabled={!jobDescription.trim() || isGenerating}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Generating Questions...</span>
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                <span>Generate Questions</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Generated Questions */}
            {generatedQuestions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Generated Questions ({generatedQuestions.length})
                        </h2>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleSaveToQuestions}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Save to Questions</span>
                            </button>
                            <button
                                onClick={handleDownloadQuestions}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download All</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {generatedQuestions.map((question, index) => (
                            <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getCategoryIcon(question.category)}</span>
                                        <div>
                                            <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                    {question.category}
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty_level)}`}>
                                                    {question.difficulty_level}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCopyQuestion(question.question_text, index)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Copy question"
                                    >
                                        {copiedIndex === index ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>

                                <p className="text-gray-700 mb-3">{question.question_text}</p>

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-600">
                                        <strong>Why this question:</strong> {question.reasoning}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips Section */}
            <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Better Results</h3>
                <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Include specific technologies, tools, and skills mentioned in the job description</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Mention the company culture and values for more targeted behavioral questions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Include details about the team structure and reporting relationships</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Add information about key responsibilities and daily tasks</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default JobDescriptionPage;