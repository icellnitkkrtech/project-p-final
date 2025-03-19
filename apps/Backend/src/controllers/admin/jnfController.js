import jnfServices from "../../services/jnfServices.js";
import apiResponse from "../../utils/apiResponse.js";
import jnfModel from "../../models/jnfModel.js";

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
            console.log(req.body);
            const response = await this.JNFService.createJNF(req.body);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }
    async updateJNF(req, res) {
        const { id } = req.params;
        try {
            const response = await this.JNFService.updateJNF(id, req.body);
            res.status(200).json(response);
        } catch (error) {
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
}