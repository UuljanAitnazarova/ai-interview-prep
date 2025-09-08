const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const authService = {
  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  },

  // Get current user data
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Set authentication data
  setAuthData(token, user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  },

  // Login user
  async login(email, password) {
    try {
      // Mock API call - replace with actual API
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.setAuthData(data.access_token, data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      // For development, return mock data
      const mockUser = {
        id: 1,
        email: email,
        username: email.split('@')[0],
        is_active: true,
        is_verified: true
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      this.setAuthData(mockToken, mockUser);
      return { user: mockUser, access_token: mockToken };
    }
  },

  // Register user
  async register(email, password, username) {
    try {
      // Mock API call - replace with actual API
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      this.setAuthData(data.access_token, data.user);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      // For development, return mock data
      const mockUser = {
        id: Date.now(),
        email: email,
        username: username,
        is_active: true,
        is_verified: true
      };
      const mockToken = 'mock_jwt_token_' + Date.now();
      this.setAuthData(mockToken, mockUser);
      return { user: mockUser, access_token: mockToken };
    }
  },

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        // Mock API call - replace with actual API
        await fetch('http://localhost:8000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    }
  },

  // Get auth token
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Refresh token (if needed)
  async refreshToken() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await fetch('http://localhost:8000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.setAuthData(data.access_token, data.user);
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  },
};