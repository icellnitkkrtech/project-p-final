import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';      

// Let's try a different approach to get the token
const getToken = () => {
  return localStorage.getItem('token');
};

const placementSessionService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/placement-sessions`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching placement sessions:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/placement-sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching placement session with ID ${id}:`, error);
      throw error;
    }
  },
  
  create: async (sessionData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/placement-sessions`, sessionData, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating placement session:', error);
      throw error;
    }
  },
  
  update: async (id, sessionData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/placement-sessions/${id}`, sessionData, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating placement session with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/placement-sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting placement session with ID ${id}:`, error);
      throw error;
    }
  }
};

export default placementSessionService; 