const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async postFormData(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

export const questionsAPI = {
  async getAll() {
    try {
      return await apiClient.get('/questions/');
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      // Return mock data for development
      return {
        data: [
          {
            id: 1,
            question_text: "Tell me about yourself and your background.",
            category: "behavioral",
            difficulty_level: "easy"
          },
          {
            id: 2,
            question_text: "What are your greatest strengths and weaknesses?",
            category: "behavioral",
            difficulty_level: "medium"
          },
          {
            id: 3,
            question_text: "Describe a challenging project you worked on and how you overcame obstacles.",
            category: "behavioral",
            difficulty_level: "hard"
          },
          {
            id: 4,
            question_text: "Why do you want to work for our company?",
            category: "behavioral",
            difficulty_level: "medium"
          },
          {
            id: 5,
            question_text: "Where do you see yourself in 5 years?",
            category: "behavioral",
            difficulty_level: "easy"
          }
        ]
      };
    }
  },

  async getById(id) {
    return await apiClient.get(`/questions/${id}`);
  },

  async create(questionData) {
    return await apiClient.post('/questions/', questionData);
  },

  async update(id, questionData) {
    return await apiClient.put(`/questions/${id}`, questionData);
  },

  async delete(id) {
    return await apiClient.delete(`/questions/${id}`);
  },
};

export const recordingsAPI = {
  async getAll() {
    try {
      return await apiClient.get('/recordings/');
    } catch (error) {
      console.error('Failed to fetch recordings:', error);
      return { data: [] };
    }
  },

  async getById(id) {
    return await apiClient.get(`/recordings/${id}`);
  },

  async create(formData) {
    try {
      return await apiClient.postFormData('/recordings/', formData);
    } catch (error) {
      console.error('Failed to create recording:', error);
      // Return mock response for development
      return {
        data: {
          id: Date.now(),
          question_id: formData.get('question_id'),
          transcript: "This is a mock transcript of your recording.",
          duration_seconds: 30,
          feedback_json: {
            overall_score: 7.5,
            detailed_scores: {
              clarity: 8,
              structure: 7,
              content: 8,
              confidence: 7
            },
            strengths: [
              "Clear articulation",
              "Good structure in your response",
              "Relevant examples provided"
            ],
            improvements: [
              "Try to be more specific with examples",
              "Work on reducing filler words",
              "Consider adding more quantifiable results"
            ],
            general_feedback: "Overall, this was a solid response. You demonstrated good communication skills and provided relevant examples. With some practice on specific details and reducing filler words, you'll improve significantly."
          }
        }
      };
    }
  },

  async update(id, recordingData) {
    return await apiClient.put(`/recordings/${id}`, recordingData);
  },

  async delete(id) {
    return await apiClient.delete(`/recordings/${id}`);
  },
};