import React, { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">CoolPrep.AI</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'home'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('questions')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'questions'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Questions
              </button>
              <button
                onClick={() => setCurrentView('recordings')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'recordings'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Recordings
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {currentView === 'home' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your AI-Powered Interview Coach
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Practice interviews with AI-generated questions and get instant feedback on your responses.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Practice Questions</h3>
                <p className="text-gray-600 mb-4">
                  Access a library of technical, behavioral, and cultural interview questions.
                </p>
                <button
                  onClick={() => setCurrentView('questions')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Browse Questions
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Record Responses</h3>
                <p className="text-gray-600 mb-4">
                  Record your answers and get AI-powered feedback and transcription.
                </p>
                <button
                  onClick={() => setCurrentView('recordings')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Start Recording
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'questions' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Interview Questions</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Question management interface will go here.</p>
            </div>
          </div>
        )}

        {currentView === 'recordings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recordings</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Recording interface will go here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


