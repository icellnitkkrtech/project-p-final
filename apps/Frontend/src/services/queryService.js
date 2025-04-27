import axiosInstance from '../config/axios';

export const queryService = {
  getAdminQueries: async () => {
    try {
      const response = await axiosInstance.get('/query/admin/queries');
      return response.data;
    } catch (error) {
      console.error('Error fetching queries:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch queries');
    }
  },
  getStudentQueries: async () => {
    try {
      const response = await axiosInstance.get('/query/student');
      return response.data;
    } catch (error) {
      console.error('Error fetching student queries:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch student queries');
    }
  },

  respondToQuery: async (queryId, data) => {
    try {
      const response = await axiosInstance.post(`/query/${queryId}/respond`, data);
      return response.data;
    } catch (error) {
      console.error('Error responding to query:', error);
      throw new Error(error.response?.data?.message || 'Failed to respond to query');
    }
  },
  updateQuery: async (queryId, data) => {
    try {
      const response = await axiosInstance.put(`/query/${queryId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating query:', error);
      throw new Error(error.response?.data?.message || 'Failed to update query');
    }
  },
  getQueryById: async (queryId) => {
    try {
      const response = await axiosInstance.get(`/query/${queryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching query by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch query by ID');
    }
  },
  submitQuery: async (data) => {
    try {
      const response = await axiosInstance.post('/query', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting query:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit query');
    }
  },

  deleteQuery: async (queryId) => {
    try {
      const response = await axiosInstance.delete(`/query/${queryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting query:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete query');
    }
  }
};