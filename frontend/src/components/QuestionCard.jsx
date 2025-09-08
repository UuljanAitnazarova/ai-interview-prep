import React from 'react';

const QuestionCard = ({ question, isSelected, onSelect }) => {
    const handleClick = () => {
        console.log('Question selected:', question.question_text);
        onSelect(question);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(question);
        }
    };

    return (
        <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            role="button"
            aria-label={`Select question: ${question.question_text}`}
        >
            <h4 className="font-semibold text-gray-900 mb-2">{question.question_text}</h4>
            <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="capitalize">{question.category}</span>
                <span>{question.difficulty_level}</span>
            </div>
        </div>
    );
};

export default QuestionCard;
