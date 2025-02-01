import companyServices from "../../services/companyServices.js";
import apiResponse from "../../utils/apiResponse.js";
import companyModel from "../../models/companyModel.js";

export default class companyController {
    constructor() {
        this.CompanyService = new companyServices(companyModel);
    }

    async createCompany(req, res) {
        try {
            const response = await this.CompanyService.createCompany(req.body);

            if(!response) {
                new apiResponse(404, null, "Not Found");
            }
            res.status(200).json(response);
        }
        catch (error) {
            new apiResponse(500, null, error.message);
        }
    }


    async getCompany(req, res) {
        const { id } = req.params;
    
        try {
            const response = await this.CompanyService.getCompanyById(id);
            if(!response) {
                new apiResponse(404, null, "Not Found");
            }
            res.status(200).json(response);
        }
        catch (error) {
            new apiResponse(500, null, error.message);
        }
    }



    async updateCompany(req, res) {

        const { id } = req.params;
        const updates = req.body;

        try {
            const response = await this.CompanyService.updateCompany(id, updates);

            if(!response) {
                new apiResponse(404, null, "Not Found");
            }
            res.status(200).json(response);
        }
        catch (error) {
            new apiResponse(500, null, error.message);
        }
    }

    async deleteCompany(req, res) {
        const { id } = req.params;

        try {
            const response = await this.CompanyService.deleteCompany(id);

            if(!response) {
                new apiResponse(404, null, "Not Found");
            }
            res.status(200).json(response);
        }
        catch (error) {
            new apiResponse(500, null, error.message);
        }
    }

    async addJNFToCompany(req, res) {
        const { id } = req.params;
        const jnfData = req.body;
        try {
            const response = await this.CompanyService.addJNFToCompany(id, jnfData);
            if(!response) {
                new apiResponse(404, null, "Not Found");
            }
            res.status(200).json(response);
        }
        catch (error) {
            new apiResponse(500, null, error.message);
        }
    }

    async getJNFsForCompany(req, res) {
        const { id } = req.params;
        try {
            const response = await this.CompanyService.getJNFsForCompany(id);
            if(!response) {
                new apiResponse(404, null, "Not Found");
            }
            res.status(200).json(response);
        }
        catch (error) {
            new apiResponse(500, null, error.message);
        }
    }

    async getTotalCompanies(req, res) {
        try {
            const response = await this.CompanyService.getTotalCompanies();
            if (!response) {
                return res.status(404).json(new apiResponse(404, null, "Not Found"));
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }
}
