import companyServices from "../../services/companyServices.js";
import apiResponse from "../../utils/apiResponse.js";
import companyModel from "../../models/companyModel.js";
import asyncHandler from "../../utils/asyncHandler.js";

export default class CompanyController {
    constructor(companyServices) {
        this.companyServices = companyServices;
        // Bind the methods to this instance
        this.getAllCompanies = this.getAllCompanies.bind(this);
        this.getCompanyVisits = this.getCompanyVisits.bind(this);
        this.getPlacedStudents = this.getPlacedStudents.bind(this);
        this.getJobProfiles = this.getJobProfiles.bind(this);
        this.getCompanyById = this.getCompanyById.bind(this);
        this.addJNFToCompany = this.addJNFToCompany.bind(this);
        this.getDriveApplications = this.getDriveApplications.bind(this);
    }

    getAllCompanies = asyncHandler(async (req, res) => {
        try {
            console.log("Getting all companies...");
            const companies = await this.companyServices.getAllCompanies();
            console.log("Companies fetched:", companies);
            
            if (!companies.success) {
                console.log("No companies found");
                return res.status(404).json(companies);
            }

            return res.status(200).json(companies);
        } catch (error) {
            console.error("Error in getAllCompanies controller:", error);
            return res.status(500).json(
                new apiResponse(500, null, error.message || "Internal Server Error")
            );
        }
    });

    getCompanyByUserId = asyncHandler(async (req, res) => {
        try {
            const company = await this.companyServices.getCompanyByUserId(req.params.userId);
            return res.status(200).json(company);
        } catch (error) {
            return res.status(500).json(new apiResponse(500, null, error.message));
        }
    });

    getCompanyById = asyncHandler(async (req, res) => {
        try {
            console.log("Getting company details for ID:", req.params.id);
            const company = await this.companyServices.getCompanyById(req.params.id);
            
            if (!company.success) {
                return res.status(404).json(company);
            }

            return res.status(200).json(company);
        } catch (error) {
            console.error("Error in getCompanyById controller:", error);
            return res.status(500).json(
                new apiResponse(500, null, error.message || "Internal Server Error")
            );
        }
    });

    getCompanyVisits = asyncHandler(async (req, res) => {
        try {
            const visits = await this.companyServices.getCompanyVisits(req.params.id);
            
            if (!visits.success) {
                return res.status(404).json(visits);
            }

            return res.status(200).json(visits);
        } catch (error) {
            console.error("Error in getCompanyVisits controller:", error);
            return res.status(500).json(
                new apiResponse(500, null, error.message || "Internal Server Error")
            );
        }
    });

    async getPlacedStudents(req, res) {
        try {
            const { id } = req.params;
            const students = await this.companyServices.getPlacedStudents(id);
            return res.status(200).json(new apiResponse(200, students, "Placed students fetched successfully"));
        } catch (error) {
            return res.status(500).json(new apiResponse(500, null, error.message));
        }
    }

    async getJobProfiles(req, res) {
        try {
            const { id } = req.params;
            console.log("Controller: Getting job profiles for company:", id);

            const response = await this.companyServices.getJobProfiles(id);
            return res.status(200).json(response);
        } catch (error) {
            console.error("Controller Error:", error);
            return res.status(error.statusCode || 500).json(
                new apiResponse(error.statusCode || 500, null, error.message)
            );
        }
    }

    async createCompany(req, res) {
        try {
            const response = await this.companyServices.createCompany(req.body);

            if (!response) {
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
            const response = await this.companyServices.getCompanyById(id);
            if (!response) {
                new apiResponse(404, null, "Not Found");
            }
            res.status(200).json(response);
        }
        catch (error) {
            new apiResponse(500, null, error.message);
        }
    }

    updateCompany = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            console.log("Controller: Updating company:", id, "with data:", req.body);
            
            const updatedCompany = await this.companyServices.updateCompany(id, req.body);
            
            if (!updatedCompany.success) {
                return res.status(404).json(updatedCompany);
            }

            return res.status(200).json(updatedCompany);
        } catch (error) {
            console.error("Error in updateCompany controller:", error);
            return res.status(500).json(
                new apiResponse(500, null, error.message || "Internal Server Error")
            );
        }
    });

    deleteCompany = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const result = await this.companyServices.deleteCompany(id);
            
            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in deleteCompany controller:", error);
            return res.status(500).json(
                new apiResponse(500, null, error.message || "Internal Server Error")
            );
        }
    });

    addJNFToCompany = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            console.log("Controller: Adding JNF to company:", id);
            
            const jnfData = req.body;
            
            const result = await this.companyServices.addJNFToCompany(id, jnfData);
            
            if (!result.success) {
                return res.status(404).json(result);
            }
            
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error in addJNFToCompany controller:", error);
            return res.status(500).json(
                new apiResponse(500, null, error.message || "Internal Server Error")
            );
        }
    });

    async getJNFsForCompany(req, res) {
        const { id } = req.params;
        try {
            const response = await this.companyServices.getJNFsForCompany(id);
            if (!response) {
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
            const response = await this.companyServices.getTotalCompanies();
            if (!response) {
                return res.status(404).json(new apiResponse(404, null, "Not Found"));
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }

    async getVisitHistory(req, res) {
        const { id } = req.params;
        try {
            const response = await this.companyServices.getVisitHistory(id);
            if (!response) {
                return res.status(404).json(new apiResponse(404, null, "Visit history not found"));
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }

    async addPlacement(req, res) {
        const { id } = req.params;
        try {
            const response = await this.companyServices.addPlacement(id, req.body);
            if (!response.success) {
                return res.status(400).json(response);
            }
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }

    async getPlacementStats(req, res) {
        const { id } = req.params;
        try {
            const response = await this.companyServices.getPlacementStats(id);
            if (!response.success) {
                return res.status(404).json(response);
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json(new apiResponse(500, null, error.message));
        }
    }

    async getDriveApplications(req, res) {
        try {
            const { driveId } = req.params;
            console.log("Controller: Getting applications for drive:", driveId);

            const response = await this.companyServices.getDriveApplications(driveId);
            return res.status(200).json(response);
        } catch (error) {
            console.error("Controller Error:", error);
            return res.status(error.statusCode || 500).json(
                new apiResponse(error.statusCode || 500, null, error.message)
            );
        }
    }
}
