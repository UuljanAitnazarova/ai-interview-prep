// Local storage service for managing questions
const STORAGE_KEY = 'interview_questions';

export const questionStorage = {
  // Get all questions from localStorage
  getAll() {
    try {
      const questions = localStorage.getItem(STORAGE_KEY);
      return questions ? JSON.parse(questions) : [];
    } catch (error) {
      console.error('Error loading questions from storage:', error);
      return [];
    }
  },

  // Save questions to localStorage
  saveAll(questions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      return true;
    } catch (error) {
      console.error('Error saving questions to storage:', error);
      return false;
    }
  },

  // Add a new question
  add(question) {
    const questions = this.getAll();
    const newQuestion = {
      ...question,
      id: question.id || Date.now(),
      created_at: question.created_at || new Date().toISOString(),
      is_generated: question.is_generated || false
    };
    
    questions.push(newQuestion);
    this.saveAll(questions);
    return newQuestion;
  },

  // Update an existing question
  update(id, updates) {
    const questions = this.getAll();
    const index = questions.findIndex(q => q.id === id);
    
    if (index !== -1) {
      questions[index] = { ...questions[index], ...updates };
      this.saveAll(questions);
      return questions[index];
    }
    
    return null;
  },

  // Delete a question
  delete(id) {
    const questions = this.getAll();
    const filteredQuestions = questions.filter(q => q.id !== id);
    this.saveAll(filteredQuestions);
    return true;
  },

  // Get questions by role
  getByRole(role) {
    const questions = this.getAll();
    return questions.filter(q => q.role && q.role.toLowerCase().includes(role.toLowerCase()));
  },

  // Get generated questions
  getGenerated() {
    const questions = this.getAll();
    return questions.filter(q => q.is_generated);
  },

  // Search questions
  search(query) {
    const questions = this.getAll();
    const lowercaseQuery = query.toLowerCase();
    
    return questions.filter(q => 
      q.question_text.toLowerCase().includes(lowercaseQuery) ||
      q.category.toLowerCase().includes(lowercaseQuery) ||
      (q.role && q.role.toLowerCase().includes(lowercaseQuery)) ||
      (q.reasoning && q.reasoning.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Filter questions by category and difficulty
  filter(category, difficulty) {
    const questions = this.getAll();
    
    return questions.filter(q => {
      const categoryMatch = category === 'all' || q.category === category;
      const difficultyMatch = difficulty === 'all' || q.difficulty_level === difficulty;
      return categoryMatch && difficultyMatch;
    });
  },

  // Clear all questions (for testing)
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
