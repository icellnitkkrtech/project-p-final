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
    async createJNF(req, res) {
        try {
            console.log(req);
            const response = await this.jnfModel.createJnf(req);
            return new apiResponse(200, response, "JNF Created Successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async updateJNF(jnfId, jnfData) {
        try {
            const response = await this.jnfModel.updateJnf(jnfId, jnfData);
            return new apiResponse(200, response, "JNF Updated Successfully");
        } catch (error) {
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
    
}