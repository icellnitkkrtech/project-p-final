import jnfModel from "../models/jnfModel.js";
import UserModel from "../models/userModel.js";
import apiResponse from "../utils/apiResponse.js";

export default class jnfServices {
    constructor() {
        this.jnfModel = new jnfModel;
        this.userModel = new UserModel();
    }
    async getAllJNFs(req, res) {
        try {   
            const response = await this.jnfModel.getAllJnfs();
            return new apiResponse(200, response, "JNFs Fetched Successfully");
        } catch (error) {   
            return new apiResponse(500, null, error.message);
        }
    }
    async getJNFById(id) {
        try {
            const response = await this.jnfModel.getJNFById(id);
            return new apiResponse(200, response, "JNF Fetched Successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async createJNF(jnfData) {
        try {
            // Validate the input data
            if (!jnfData) {
                throw new Error('JNF data is required');
            }

            if (!jnfData.submittedBy) {
                throw new Error('User ID is required');
            }

            console.log('Creating JNF with data:', {
                submittedBy: jnfData.submittedBy,
                companyName: jnfData.companyDetails?.name
            });

            // Create the JNF
            const response = await this.jnfModel.createJnf(jnfData);

            // Check if creation was successful
            if (!response || response.statusCode !== 200) {
                throw new Error(response?.message || 'Failed to create JNF');
            }

            return new apiResponse(200, response.data, "JNF Created Successfully");
        } catch (error) {
            console.error('Error in createJNF service:', error);
            return new apiResponse(500, null, error.message);
        }
    }
    async updateJNF(jnfId, formData) {
        try {
            // Parse the form data if it's a string
            const jnfData = typeof formData === 'string' ? JSON.parse(formData) : formData;

            // Handle file path if present in the request
            if (jnfData.fileUpload) {
                const { fileIndex, filePath } = jnfData.fileUpload;
                jnfData.jobProfiles[fileIndex].jobDescription.file = filePath;
                delete jnfData.fileUpload; // Remove the temporary file data
            }

            const response = await this.jnfModel.updateJnf(jnfId, jnfData);
            return new apiResponse(200, response, "JNF Updated Successfully");
        } catch (error) {
            console.error('Error in updateJNF service:', error);
            return new apiResponse(500, null, error.message);
        }
    }
    
    async deleteJNF(jnfId) {
        try {
            const response = await this.jnfModel.deleteJnf(jnfId);
            return new apiResponse(200, response, "JNF Deleted Successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    
    async assignJNF(jnfId, userId) {
        try {
            const response = await this.jnfModel.assignJNF(jnfId, userId);
            return new apiResponse(200, response, "JNF Assigned Successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async getAvailableStatuses() {
        try {
            const response = await this.jnfModel.getAvailableStatuses();
            return new apiResponse(200, response, "Statuses Fetched Successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
 
    async getPCC() {
        try {
            const response = await this.userModel.getPCC();
            return new apiResponse(200, response, "PCC Fetched Successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    
    async getJnfAssignments(jnfId) {
        try {
            const response = await this.jnfModel.getJnfAssignments(jnfId);
            return new apiResponse(200, response, "JNF Assignments Fetched Successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async updatestatus( jnfId, status ) {
        try {
            const response = await this.jnfModel.updateStatus(jnfId, status);
            return new apiResponse(200, response, "Status Updated Successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async createDraft(draftData) {
        try {
            const draft = await this.jnfModel.saveDraft(draftData);
            if (!draft) {
                throw new Error('Failed to create draft');
            }
            return draft;
        } catch (error) {
            console.error('Error in createDraft service:', error);
            throw error;
        }
    }

    async updateDraft(id, draftData) {
        try {
            const draft = await this.jnfModel.findByIdAndUpdate(
                id,
                { ...draftData, lastModified: new Date() },
                { new: true }
            );
            if (!draft) {
                throw new Error('Draft not found');
            }
            return draft;
        } catch (error) {
            console.error('Error in updateDraft service:', error);
            throw error;
        }
    }
}