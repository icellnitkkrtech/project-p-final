import axiosInstance from '../../config/axios';
import { API_BASE_URL } from '../../config/constants';

const companyService = {
  getCompanies: async () => {
    try {
      const response = await axiosInstance.get('/company/all');
      return response;
    } catch (error) {
      console.error("Error fetching companies:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  

  getCompanyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/company/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching company details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
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

    const response = await axiosInstance.post(`${API_BASE_URL}/companies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCompany: async (id, data) => {
    try {
      console.log("Updating company with ID:", id, "Data:", data);
      const response = await axiosInstance.put(`/company/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating company:", error);
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await axiosInstance.delete(`/company/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting company:", error);
      throw error;
    }
  },

  uploadLogo: async (id, file) => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await axiosInstance.post(`${API_BASE_URL}/companies/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCompanyStats: async (id) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/companies/${id}/stats`);
    return response.data;
  },

  getVisitHistory: async (id) => {
    try {
      const response = await axiosInstance.get(`/company/${id}/visits`);
      return response.data;
    } catch (error) {
      console.error("Error fetching visit history:", error);
      throw error;
    }
  },

  getJobProfiles: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/company/${id}/job-profiles`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job profiles:", error);
      throw error;
    }
  },

  getPlacedStudents: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/company/${id}/placed-students`);
      return response.data;
    } catch (error) {
      console.error("Error fetching placed students:", error);
      throw error;
    }
  },

  getDriveApplications: async (driveId) => {
    try {
      console.log("Fetching applications for drive:", driveId);
      const response = await axiosInstance.get(`${API_BASE_URL}/company/${driveId}/applications`);
      return response.data;
    } catch (error) {
      console.error("Error fetching drive applications:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
};

export default companyService;