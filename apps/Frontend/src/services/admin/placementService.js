import axios from '../../config/axios';
import { API_BASE_URL } from '../../config/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/placements`,
});

const placementService = {
  async getAll(params) {
    const response = await api.get('/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  async getStatistics() {
    const response = await api.get('/statistics');
    return response.data;
  },

  async applyForPlacement(id, studentId) {
    const response = await api.post(`/${id}/apply`, { studentId });
    return response.data;
  },

  async updateApplicationStatus(id, studentId, status) {
    const response = await api.put(`/${id}/applications/${studentId}`, { status });
    return response.data;
  },
};

export default placementService;