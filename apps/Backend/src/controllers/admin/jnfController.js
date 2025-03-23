import jnfServices from "../../services/jnfServices.js";
import apiResponse from "../../utils/apiResponse.js";
import jnfModel from "../../models/jnfModel.js";
import upload from '../../config/multerConfig.js';
import fs from 'fs';
import path from 'path';

export default class JNFController {
    constructor() {
        this.JNFService = new jnfServices(jnfModel);
    }
    async getAllJNFs(req, res) {
        try {
            const response = await this.JNFService.getAllJNFs();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }
    async getJNFById(req, res) {
        const { id } = req.params;
        try {
            const response = await this.JNFService.getJNFById(id);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }
    async createJNF(req, res) {
        try {
            const jnfData = JSON.parse(req.body.formData); // Parse the stringified form data
            
            // If file was uploaded, add file path to job description
            if (req.file) {
                const jobProfileIndex = parseInt(req.body.fileJobProfileIndex);
                if (!jnfData.jobProfiles[jobProfileIndex]) {
                    throw new Error('Invalid job profile index for file upload');
                }
                
                jnfData.jobProfiles[jobProfileIndex].jobDescription = {
                    ...jnfData.jobProfiles[jobProfileIndex].jobDescription,
                    attachFile: true,
                    file: req.file.path.replace(/\\/g, '/') // Convert Windows path to URL-friendly path
                };
            }

            const response = await this.JNFService.createJNF(jnfData);
            res.status(200).json(response);
        } catch (error) {
            // Delete uploaded file if there was an error
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }
    async updateJNF(req, res) {
        const { id } = req.params;
        try {
            const jnfData = req.body;

            // Handle file upload for update
            if (req.file) {
                const jobProfileIndex = req.body.fileJobProfileIndex;
                const oldJnf = await this.JNFService.getJNFById(id);
                
                // Delete old file if it exists
                if (oldJnf?.data?.jobProfiles[jobProfileIndex]?.jobDescription?.file) {
                    const oldFilePath = oldJnf.data.jobProfiles[jobProfileIndex].jobDescription.file;
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                jnfData.jobProfiles[jobProfileIndex].jobDescription = {
                    ...jnfData.jobProfiles[jobProfileIndex].jobDescription,
                    attachFile: true,
                    file: req.file.path
                };
            }

            const response = await this.JNFService.updateJNF(id, jnfData);
            res.status(200).json(response);
        } catch (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }
    async deleteJNF(req, res) {
        const { id } = req.params;
        try {
            const response = await this.JNFService.deleteJNF(id);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }
    async assignJNF(req, res) {
        const { id } = req.params; // jnfId
        const { userId } = req.body;
        try {
            const response = await this.JNFService.assignJNF(id, userId);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }
    // controller/jnfController.js
async getAvailableStatuses(req, res) {
    try {
        const response = await this.JNFService.getAvailableStatuses();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(new apiResponse(500, null, error.message));
    }

}
async getPCC(req, res) {
    try {
        const response = await this.JNFService.getPCC();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(new apiResponse(500, null, error.message));
    }  
}
async getJnfAssignments(req, res) {
    const { id } = req.params;
    try {
        const response = await this.JNFService.getJnfAssignments(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(new apiResponse(500, null, error.message));
    }
}
async updateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const response = await this.JNFService.updatestatus(id, status);
        
        if (response.statusCode === 200) {
            res.status(200).json({
                success: true,
                data: response.data,
                message: `JNF ${status} successfully`
            });
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error('Error in updateStatus controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update JNF status'
        });
    }
}
//
}