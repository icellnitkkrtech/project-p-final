import axios from '../../config/axios';
import { API_BASE_URL } from '../../config/constants';

const placementService = {
    //1 Create a placement drive
    createPlacementDrive: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/placement/create-placement-drive`, data);
        return response.data;
    },
    
    //2 Get all placement drives
    getAllPlacements: async () => {
        const response = await axios.get(`${API_BASE_URL}/placement/all`);
        return response.data.data;
    },
    
    //3 Get a single placement drive
    getPlacement: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/getone`);
        return response.data;
    },

    getRoundDetails: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/getone`);
        return response.data.roundDetails;
    },
    
    // Update placement drive
    updatePlacement: async (id, data) => {
        const response = await axios.put(`${API_BASE_URL}/placement/${id}`, data);
        return response.data;
    },
    
    // Delete placement drive
    deletePlacement: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/placement/${id}`);
        return response.data;
    },
    
    //4 Add round to placement drive
    addRound: async (id, data) => {
        const response = await axios.post(`${API_BASE_URL}/placement/${id}/add-round`, data);
        return response.data;
    },
    
    //5 Delete a round
    deleteRound: async (id, roundId) => {
        const response = await axios.delete(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/delete-round`);
        return response.data;
    },
    
    //6 Get round details
    getRound: async (id, roundId) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/getone`);
        return response.data;
    },
    
    //7 Update round details
    updateRound: async (id, roundId, data) => {
        const response = await axios.put(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/update-round`, data);
        return response;
    },
    
    //8 Get applicant students in a placement drive
    getApplicants: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/applicant-students`);
        return response.data;
    },
    
    //9 Get selected students
    getSelectedStudents: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/selected-students`);
        return response.data;
    },
    
    //10 Get applicants for a round
    getApplicantsForRound: async (id, roundId) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/applicant-students`);
        return response.data;
    },
    
    //11 Get selected students for a round
    getSelectedStudentsForRound: async (id, roundId) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/selected-students`);
        return response.data;
    },
    
    //12 Get appeared students for a round
    getAppearedStudentsForRound: async (id, roundId) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/appeared-students`);
        return response.data;
    },
    
    //13 Update selected students in a round
    updateSelectedStudents: async (id, roundId, data) => {
        const response = await axios.put(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/update-selected-students`, data);
        return response.data;
    },
    
    //14 Declare round results
    declareResults: async (id, roundId, data) => {
        const response = await axios.put(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/declare-results`, data);
        return response.data;
    },
    
    //15 Get results of a round
    getResults: async (id, roundId) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/get-results`);
        return response.data;
    },
    
    //16 Declare placement drive results
    declareDriveResults: async (id, data) => {
        const response = await axios.post(`${API_BASE_URL}/placement/${id}/declare-drive-results`, data);
        return response.data;
    },
    
    //17 Get placement drive results
    getDriveResults: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/get-drive-results`);
        return response.data;
    },
    
    //18 Add new notification
    addNotification: async (id, data) => {
        const response = await axios.post(`${API_BASE_URL}/placement/${id}/notifications/add-new`, data);
        return response.data;
    },
    
    //19 Get one notification
    getNotification: async (id, notificationId) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/notifications/${notificationId}/get-one`);
        return response.data;
    },
    
    //20 Get all notifications
    getAllNotifications: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/notifications/all`);
        return response.data;
    },
    
    //21 Delete notification
    deleteNotification: async (id, notificationId) => {
        const response = await axios.delete(`${API_BASE_URL}/placement/${id}/notifications/${notificationId}/delete`);
        return response.data;
    }
};

export default placementService;
