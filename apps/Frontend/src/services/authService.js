import axiosInstance from '../config/axios';
import { API_CONFIG } from '../config/constants';

const handleRedirect = (user_role, userId) => {
  switch (user_role) {
    case 'student':
      localStorage.setItem('userId', userId);
      window.location.href = '/student/complete-profile';
      break;
    case 'company':
      window.location.href = '/company/dashboard';
      break;
    case 'admin':
      window.location.href = '/admin/dashboard';
      break;
    default:
      window.location.href = '/admin/dashboard';
  }
};

const authService = {
  register: async (userData) => {
    try {
      console.log('Environment:', import.meta.env.MODE);
      console.log('API Base URL:', axiosInstance.defaults.baseURL);
      
      const response = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );

      console.log('Raw registration response:', response);

      if (response.data.success || response.status === 201) {
        const loginResponse = await authService.login({
          email: userData.email,
          password: userData.password,
          user_role: userData.user_role
        });
        return loginResponse;
      }

      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', {
        env: import.meta.env.MODE,
        baseUrl: axiosInstance.defaults.baseURL,
        endpoint: API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        error: error.response?.data || error.message
      });
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Login attempt with:', {
        email: credentials.email,
        user_role: credentials.user_role
      });

      const response = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log('Login response:', response.data);

      if (response.data.success || response.data.statusCode === 200) {
        const { data } = response.data;
        
        // Store auth data
        const authData = {
          authToken: data.authToken,
          refreshToken: data.refreshToken,
          userRole: credentials.user_role,
          user: data.user,
          userId: data.user._id
        };

        Object.entries(authData).forEach(([key, value]) => {
          if (value) localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
        });

        handleRedirect(credentials.user_role, data?.user?._id);
      }

      return response.data;
    } catch (error) {
      console.error('login error:', {
        env: import.meta.env.VITE_NODE_ENV,
        baseUrl: axiosInstance.defaults.baseURL,
        endpoint: API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        error: error.response?.data || error.message
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/logout');
      localStorage.clear();
      return response.data;
    } catch (error) {
      localStorage.clear();
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Failed to process forgot password:', error);
      throw error;
    }
  },

  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await axiosInstance.post('/reset-password', {
        resetToken,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await axiosInstance.post('/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error('Failed to verify email:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axiosInstance.post('/refresh-token', { refreshToken });
      
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.authToken);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/me', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.post('/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }
};

export default authService;