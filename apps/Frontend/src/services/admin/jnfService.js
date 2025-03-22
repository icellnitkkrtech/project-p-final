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

  async create(data) {
    const response = await api.post('/create', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/update/${id}`, data);
    return response.data;
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
  }
};

export default jnfService;