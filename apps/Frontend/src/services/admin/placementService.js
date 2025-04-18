import axios from '../../config/axios';
import { API_BASE_URL } from '../../config/constants.js';
import studentService from './studentService';

const placementService = {
    //1 Create a placement drive
    createPlacementDrive: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/placement/create-placement-drive`, data);
        
        // Create automatic notification for new drive
        if (response.data && response.data._id) {
            const placementId = response.data._id;
            const subject = `New Placement Drive: ${data.placementDrive_title}`;
            const content = `
                <h3>New Placement Opportunity!</h3>
                <p>A new placement drive has been created for ${data.companyDetails.name}.</p>
                <p><strong>Position:</strong> ${data.jobProfile.designation}</p>
                <p><strong>Application Deadline:</strong> ${new Date(data.applicationDetails.applicationDeadline).toLocaleDateString()}</p>
                <p>Please check the placement portal for more details and to apply.</p>
            `;
            await createAutomaticNotification(placementId, subject, content, "drive_created");
        }
        
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
        const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/all`);
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
    updateRound: async (placementId, roundId, roundData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/placement/${placementId}/rounds/${roundId}/update-round`,
                roundData
            );
            
            return {
                success: true,
                data: response.data,
                message: "Round updated successfully"
            };
        } catch (error) {
            console.error("Error updating round:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update round"
            };
        }
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
        try {
            const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/applicant-students`);
            const students = response.data?.data?.data?.applicantStudents || [];
            
            // Fetch full details for each student using studentService
            const studentsWithDetails = await Promise.all(
                students.map(async (student) => {
                    try {
                        const details = await studentService.getStudentById(student._id);
                        return details?.data || {
                            _id: student._id,
                            personalInfo: {},
                            academics: {}
                        };
                    } catch (error) {
                        console.error(`Error fetching details for student ${student._id}:`, error);
                        return {
                            _id: student._id,
                            personalInfo: {},
                            academics: {}
                        };
                    }
                })
            );
            console.log("Fetched student details:", studentsWithDetails);
            return studentsWithDetails;
        } catch (error) {
            console.error("Error fetching applicants for round:", error);
            return [];
        }
    },
    
    //11 Get selected students for a round
    getSelectedStudentsForRound: async (id, roundId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/selected-students`);
            
            // Handle the direct array response format
            let students = [];
            if (Array.isArray(response.data)) {
                students = response.data;
            } else if (Array.isArray(response.data?.data)) {
                students = response.data.data;
            } else if (response.data?.data?.roundDetails?.rounds?.[0]?.selectedStudents) {
                students = response.data.data.roundDetails.rounds[0].selectedStudents;
            }
            
            return students.map(student => ({
                _id: student._id,
                personalInfo: student.personalInfo || {},
                academics: student.academics || {}
            }));
        } catch (error) {
            console.error("Error fetching selected students for round:", error);
            return [];
        }
    },
    
    //12 Get appeared students for a round
    getAppearedStudentsForRound: async (id, roundId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/appeared-students`);
            
            // The response already contains full student details, no need to fetch individually
            return response.data || []; // Return the array of students directly
            
        } catch (error) {
            console.error("Error fetching appeared students for round:", error);
            return [];
        }
    },
    
    //13 Update selected students in a round
    updateSelectedStudents: async (placementId, roundId, studentId) => {
        try {
            console.log("Updating selected students:", { placementId, roundId, studentId });
            const response = await axios.put(
                `${API_BASE_URL}/placement/${placementId}/rounds/${roundId}/update-selected-students`,  // Correct route
                { studentId }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating selected students:", error);
            throw error;
        }
    },
    
    //14 Declare round results
    declareResults: async (id, roundId, data) => {
        const response = await axios.put(`${API_BASE_URL}/placement/${id}/rounds/${roundId}/declare-results`, data);
        
        // Create automatic notification for results declaration
        if (response.data) {
            const roundName = response.data.roundDetails?.rounds?.find(r => r._id === roundId)?.roundName || "Round";
            const subject = `Results Declared: ${roundName}`;
            const content = `
                <h3>Round Results Announced</h3>
                <p>The results for "${roundName}" have been declared.</p>
                <p>Please check the placement portal to see if you have been selected for the next round.</p>
            `;
            await createAutomaticNotification(id, subject, content, "result");
        }
        
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
        
        // Create automatic notification for final results
        if (response.data) {
            const subject = `Final Results Announced`;
            const content = `
                <h3>Placement Drive Results</h3>
                <p>The final results for the placement drive have been announced.</p>
                <p>Selected candidates will receive an offer letter. Please check the placement portal for details.</p>
            `;
            await createAutomaticNotification(id, subject, content, "final_result");
            
            // Send offer letters to selected students
            if (data.selectedStudents && data.selectedStudents.length > 0) {
                const offerLetterSubject = `Congratulations! Job Offer`;
                const offerLetterContent = `
                    <h2>Congratulations!</h2>
                    <p>We are pleased to inform you that you have been selected for the position.</p>
                    <p>Please log in to the placement portal to accept or reject this offer.</p>
                    <p>Note: You have 48 hours to respond to this offer.</p>
                `;
                await createAutomaticNotification(id, offerLetterSubject, offerLetterContent, "offer_letter");
            }
        }
        
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
    },

    //22 Get application details
    getApplicationDetails: async (applicationId) => {
        const response = await axios.get(`${API_BASE_URL}/student/applications/detail/${applicationId}`);
        return response.data;
      },

    // Add this new method to placementService
    getDetailedResults: async (placementId, roundId) => {
        try {
            console.log(`Fetching detailed results for placement ${placementId}, round ${roundId}`);
            
            // Use the existing endpoint for detailed round results
            const response = await axios.get(`${API_BASE_URL}/placement/${placementId}/rounds/${roundId}/detailed-results`);
            
            console.log("Detailed results response:", response.data);
            
            // Process the response to ensure we have the correct structure
            const results = {
                ...response.data,
                selectedStudents: response.data.selectedStudents || [],
                appearedStudents: response.data.appearedStudents || []
            };
            
            return results;
        } catch (error) {
            console.error("Error fetching detailed results:", error);
            // Return a default object with empty arrays
            return {
                selectedStudents: [],
                appearedStudents: [],
                resultMessage: "Unable to load results",
                resultDescription: "There was an error loading the round results."
            };
        }
    },

    // Get final selected students (from the last round)
    getFinalSelectedStudents: async (placementId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/placement/${placementId}/final-selected-students`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching final selected students:", error);
            throw error;
        }
    },

    // Get offer letters for a placement
    getOfferLetters: async (placementId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/placement/${placementId}/offer-letters`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching offer letters:", error);
            throw error;
        }
    },

    // Send offer letters to selected students
    sendOfferLetters: async (placementId, offerData) => {
        try {
          console.log("Sending offer letters with data:", offerData);
          
          // Make sure studentIds is an array
          if (!offerData.studentIds || !Array.isArray(offerData.studentIds) || offerData.studentIds.length === 0) {
            throw new Error("Student IDs are required and must be an array");
          }
          
          const response = await axios.post(
            `${API_BASE_URL}/placement/${placementId}/offer-letters`, 
            offerData
          );
          
          console.log("Send offer letters response:", response.data);
          return response.data;
        } catch (error) {
          console.error("Error in sendOfferLetters service method:", error);
          throw error;
        }
      },

    // Update student offer status (for student portal)
    updateOfferStatus: async (placementId, offerId, status) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/placement/${placementId}/offer-letters/${offerId}`, {
                status
            });
            return response.data;
        } catch (error) {
            console.error("Error updating offer status:", error);
            throw error;
        }
    },

    // Add this method if it doesn't exist
    getToken() {
        return localStorage.getItem('token');
    },

    // Get all placement policies
    async getPlacementPolicies() {
        try {
            const response = await axios.get(`${API_BASE_URL}/placement-policy`, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching placement policies:", error);
            throw error;
        }
    },

    // Create a new placement policy
    async createPlacementPolicy(policyData) {
        try {
            // Log the URL and data for debugging
            console.log("Creating policy at URL:", `${API_BASE_URL}/placement-policy`);
            console.log("Policy data:", policyData);
            
            const response = await axios.post(`${API_BASE_URL}/placement-policy`, policyData, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating placement policy:", error);
            throw error;
        }
    },

    // Update an existing placement policy
    async updatePlacementPolicy(policyId, policyData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/placement-policy/${policyId}`, policyData, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating placement policy:", error);
            throw error;
        }
    },

    // Delete a placement policy
    async deletePlacementPolicy(policyId) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/placement-policy/${policyId}`, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting placement policy:", error);
            throw error;
        }
    },

    // Check student eligibility based on policies
    async checkStudentEligibility(studentId, branchId, courseId) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/placement-policy/student/${studentId}/eligibility`, 
                {
                    params: { branchId, courseId },
                    headers: {
                        Authorization: `Bearer ${this.getToken()}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error checking student eligibility:", error);
            throw error;
        }
    },
};

// Helper function to create automatic notifications
const createAutomaticNotification = async (placementId, subject, content, type) => {
    try {
        const notificationData = {
            subject,
            content,
            type
        };
        
        await axios.post(`${API_BASE_URL}/placement/${placementId}/notifications/add-new`, notificationData);
    } catch (error) {
        console.error("Error creating automatic notification:", error);
    }
};

export default placementService;
