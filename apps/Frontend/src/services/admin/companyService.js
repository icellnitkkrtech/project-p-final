import axios from '../../config/axios';
import { API_BASE_URL } from '../../config/constants';

const companyService = {
  getCompanies: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/all`);
      return response; // Return the entire response object
    } catch (error) {
      console.error("Error fetching companies:", error);
      return { data: { data: [] } }; // Return an empty array in the expected structure
    }
  },
  

  getCompanyById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/companies/${id}`);
    return response.data;
  },

  createCompany: async (companyData) => {
    const formData = new FormData();
    Object.keys(companyData).forEach(key => {
      if (companyData[key] instanceof File) {
        formData.append(key, companyData[key]);
      } else if (typeof companyData[key] === 'object') {
        formData.append(key, JSON.stringify(companyData[key]));
      } else {
        formData.append(key, companyData[key]);
      }
    });

    const response = await axios.post(`${API_BASE_URL}/companies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCompany: async (id, companyData) => {
    const formData = new FormData();
    Object.keys(companyData).forEach(key => {
      if (companyData[key] instanceof File) {
        formData.append(key, companyData[key]);
      } else if (typeof companyData[key] === 'object') {
        formData.append(key, JSON.stringify(companyData[key]));
      } else {
        formData.append(key, companyData[key]);
      }
    });

    const response = await axios.put(`${API_BASE_URL}/companies/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteCompany: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/companies/${id}`);
    return response.data;
  },

  uploadLogo: async (id, file) => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await axios.post(`${API_BASE_URL}/companies/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCompanyStats: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/companies/${id}/stats`);
    return response.data;
  },

  getVisitHistory: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/companies/${id}/visits`);
    return response.data;
  },
};

export default companyService;