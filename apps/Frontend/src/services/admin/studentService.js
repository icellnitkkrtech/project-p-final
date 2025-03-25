import axios from "axios";
import { API_BASE_URL } from "../../config/constants";

const studentService = {
  getStudents: async (filters, pagination) => {
    const response = await axios.get(`${API_BASE_URL}/student/getallstudent`);
    return response.data;
  },

  getStudentById: async (id) => {
    console.log("get student ");
    try {
      const response = await axios.get(`${API_BASE_URL}/student/profile/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  registerStudentByAdmin: async (studentData) => {
    try {
      console.log('Service received data:', JSON.stringify(studentData, null, 2));

      const response = await axios.post(
        `${API_BASE_URL}/student/register/admin`,
        studentData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Service received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Service error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
  createStudent: async (studentData) => {
    const formData = new FormData();
    Object.keys(studentData).forEach((key) => {
      if (studentData[key] instanceof File) {
        formData.append(key, studentData[key]);
      } else if (typeof studentData[key] === "object") {
        formData.append(key, JSON.stringify(studentData[key]));
      } else {
        formData.append(key, studentData[key]);
      }
    });

    const response = await axios.post(`${API_BASE_URL}/student`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/student/profile/${id}`,
        studentData
      );
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  deleteStudent: async (studentId, reason) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/student/delete/${studentId}`,
        {
          data: { reason },
        }
      );
      return response;
    } catch (error) {
      console.error("Error debarring student:", error);
      throw error;
    }
  },
  debourStudent: async (studentId, reason) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/student/debour/${studentId}`,
        {
          reason,
          debouredAt: new Date(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error debouring student:", error);
      throw error;
    }
  },
  checkDebourStatus: async (studentId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/debour-status/${studentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking debour status:", error);
      throw error;
    }
  },
  // Add a method to revoke debour if needed
  revokeDebour: async (studentId, reason) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/student/revoke-debour/${studentId}`,
        {
          reason,
          revokedAt: new Date(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error revoking debour:", error);
      throw error;
    }
  },
  bulkImport: async (fileData) => {
    console.log("bulk import called ");
    const formData = new FormData();
    formData.append("file", fileData);

    const response = await axios.post(
      `${API_BASE_URL}/student/bulk-import`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  exportStudents: async (filters) => {
    console.log("export called ");

    const response = await axios.get(`${API_BASE_URL}/student/export`, {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/student/${id}/status`, {
      status,
    });
    return response.data;
  },

  uploadDocument: async (id, documentData) => {
    const formData = new FormData();
    formData.append("file", documentData.file);
    formData.append("type", documentData.type);
    formData.append("description", documentData.description);

    const response = await axios.post(
      `${API_BASE_URL}/student/${id}/documents`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  getDocuments: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/student/${id}/documents`);
    return response.data;
  },

  deleteDocument: async (studentId, documentId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/student/${studentId}/documents/${documentId}`
    );
    return response.data;
  },
  getStudentApplications : async (studentId) => {
    const response = await axios.get(`${API_BASE_URL}/student/applications/${studentId}`);
    return response.data;
  }
};

export default studentService;
