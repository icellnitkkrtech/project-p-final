import axios from '../../config/axios';
import { API_BASE_URL } from '../../config/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/audit`,
});

// Change to named export
export const auditService = {
  async getLogs(params = {}) {
    try {
      const response = await api.get('/logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },
  
  async getLogById(id) {
    try {
      const response = await api.get(`/logs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching audit log ${id}:`, error);
      throw error;
    }
  },
  
  async getStats() {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching audit stats:', error);
      throw error;
    }
  },
  
  async exportLogs(format = 'csv') {
    try {
      const response = await api.get('/export', { 
        params: { format },
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  }
};

// Also provide a default export for backward compatibility
export default auditService; 