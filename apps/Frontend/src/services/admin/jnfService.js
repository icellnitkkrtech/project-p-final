import axios from '../../config/axios';
import { API_BASE_URL } from '../../config/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/jnf`,
});

const jnfService = {
  async getAll() {
    const response = await api.get('/all');
    console.log(response.data.data);
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/getone/${id}`);
    return response.data.data;
  },

  async create(formData) {
    try {
          // Get auth token from localStorage
          const token = localStorage.getItem('authToken');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };
        const response = await api.post('/create', formData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating JNF:', error);
        throw error;
    }
  },

  async update(id, formData) {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        // Updated URL to match backend route
        const response = await api.put(`/updatejnf/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating JNF:', error);
        throw error;
    }
  },

  async delete(id) {
    const response = await api.delete(`/delete/${id}`);
    return response.data;
  },

  async assign(id, userId) {
    const response = await api.put(`/assign/${id}`, { userId });
    return response.data;
  },
  async getAvailableStatuses() {
    const response = await api.get('/getAvailableStatuses');
    return response.data;
  },
  async getPCC() {
    try {
        const response = await api.get('/getPCC');
        return response.data;
    } catch (error) {
        if (error.message.includes('con is not defined')) {
            throw new Error('Database connection error. Please try again later.');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch PCC users');
    }
},
async assignJNF(jnfId, userId) {
    try {
        if (!jnfId || !userId) {
            throw new Error('JNF ID and User ID are required');
        }

        const response = await api.put(`/assign/${jnfId}`, { userId });
        return response.data;
    } catch (error) {
        console.error('Error in assignJNF:', error);
        throw new Error(error.response?.data?.message || 'Failed to assign JNF');
    }
  },
  async getJNFAssignment(jnfId) {
    try {
        if (!jnfId) {
            throw new Error('JNF ID is required');
        }
        
        const response = await api.get(`/getJnfAssignment/${jnfId}`);
        
        // Check if response has the expected structure
        if (!response?.data) {
            throw new Error('Invalid response format');
        }
        
        return response.data;
    } catch (error) {
        console.error('Error in getJNFAssignment:', error);
        // Handle different types of errors
        if (error.response) {
            // Server responded with error
            throw new Error(error.response.data.message || 'Server error occurred');
        } else if (error.request) {
            // Request made but no response
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Other errors
            throw new Error(error.message || 'Failed to fetch assignment');
        }
    }
},
async updateJNF(id, formData) {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        const response = await api.put(`/updatejnf/${id}`, formData, config);
        
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to update JNF');
        }
        
        return response.data;
    } catch (error) {
        console.error('Error updating JNF:', error);
        throw error.response?.data || error;
    }
},
async updateStatus(id, status) {
    try {
        const response = await api.put(`/updateStatus/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating JNF status:', error);
        throw error;
    }
},
async saveDraft(formData) {
    try {
        const formDataToSend = new FormData();
        
        // Handle file attachments if present
        formData.jobProfiles.forEach((profile, index) => {
            if (profile.jobDescription.attachFile && profile.jobDescription.file) {
                formDataToSend.append('jobDescriptionFile', profile.jobDescription.file);
                formDataToSend.append('fileJobProfileIndex', index.toString());
            }
        });

        // Prepare data for saving
        const dataToSend = {
            ...formData,
            status: 'draft',
            lastModified: new Date().toISOString()
        };

        formDataToSend.append('formData', JSON.stringify(dataToSend));

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                // 'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        const response = await api.post('/draft', formDataToSend ,config);
        return response.data;
    } catch (error) {
        console.error('Error saving draft:', error);
        throw error;
    }
}

};

export default jnfService;