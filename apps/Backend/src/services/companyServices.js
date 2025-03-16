import companyModel from "../models/companyModel.js";
import UserModel from "../models/userModel.js";
import User from "../schema/userSchema.js";
import apiResponse from "../utils/apiResponse.js";
import Company from "../schema/company/companySchema.js";

export default class companyServices {
    constructor() {
        this.CompanyModel = new companyModel;
        this.userModel = new UserModel();
    }

    async getAllCompanies() {
        try {
            console.log("Service: Getting all companies");
            const companies = await Company.find()
                .populate({
                    path: 'JNFs',
                    populate: {
                        path: 'placementDrive'
                    }
                })
                .populate('user', 'name email')
                .lean();

            console.log("Service: Companies found:", companies?.length);

            if (!companies || companies.length === 0) {
                return new apiResponse(404, null, "No companies found");
            }

            return new apiResponse(200, { data: companies }, "Companies fetched successfully");
        } catch (error) {
            console.error("Service Error:", error);
            throw new Error(error.message || "Error fetching companies");
        }
    }

    async createCompany(companyData) {
        console.log("Service layer: createCompany called");
        try {
            if (!companyData.companyName || !companyData.email || !companyData.website || !companyData.password) {
                return new apiResponse(500, null, "Missing required Details");
            }
            const user = {
                email: companyData.email,
                password: companyData.password,
                user_role: "company"
            };

            const userData = await this.userModel.createUser(user);
            console.log("User creation response:", userData);

            if (!userData.success) {
                return new apiResponse(500, "User creation Failed", userData.message);
            }
            const response = await this.CompanyModel.createCompany(companyData, userData.data._id);
            console.log("Company creation response:", response);

            if (!response.success) {
                await this.userModel.deleteUser(userData.data._id);
                return new apiResponse(500, "Creation of Company Failed", response.message);
            }

            await User.findByIdAndUpdate(userData.data._id, {
                Company: response.data._id
            });

            return new apiResponse(200, response, "Company Created");
        }
        catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getCompanyById(id) {
        try {
            const company = await Company.findById(id)
                .populate({
                    path: 'JNFs',
                    populate: {
                        path: 'placementDrive'
                    }
                })
                .populate('user', 'name email')
                .lean();

            if (!company) {
                return new apiResponse(404, null, "Company not found");
            }

            return new apiResponse(200, { data: company }, "Company fetched successfully");
        } catch (error) {
            console.error("Service Error:", error);
            throw new Error(error.message || "Error fetching company");
        }
    }

    async updateCompany(id, updateData) {
        try {
            console.log("Service: Updating company", id, "with data:", updateData);
            
            const company = await Company.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!company) {
                return new apiResponse(404, null, "Company not found");
            }

            return new apiResponse(200, { data: company }, "Company updated successfully");
        } catch (error) {
            console.error("Service Error:", error);
            throw new Error(error.message || "Error updating company");
        }
    }

    async deleteCompany(id_company,id_user) {
        console.log("Service layer: deleteCompany called");
        try {
            const response = await this.CompanyModel.deleteCompany(id_company,id_user);

            if (response.success) {
                await this.userModel.deleteUser(id);
                return new apiResponse(500, null, response.message);
            }
            return new apiResponse(200, response, "Company deleted successfully");
        }
        catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async addJNFToCompany(companyId, jnfData) {
        console.log("Service layer: addJNFToCompany called");
        try {
            const company = await this.CompanyModel.findCompanyById(companyId);
            if (!company) {
                console.error(`Company with ID ${companyId} does not exist`);
                return null;
            }

            const userId = company.user;

            const response = await this.CompanyModel.addJNFToCompany(companyId, jnfData, userId);

            console.log("added JNF", response);
            return new apiResponse(200, response, "JNF Added To Company Successfully");
        }
        catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getJNFsForCompany(companyId) {
        console.log("Service layer: getJNFsForCompany called");
        try {
            const response = await this.CompanyModel.getJNFsForCompany(companyId);
            return new apiResponse(200, response, "JNF Fetched Successfully");
        }
        catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getVisitHistory(companyId) {
        try {
            const response = await this.CompanyModel.getVisitHistory(companyId);
            return new apiResponse(200, response, "Visit history fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getPlacedStudents(companyId) {
        try {
            const response = await this.CompanyModel.getPlacedStudents(companyId);
            return new apiResponse(200, response, "Placed students fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getJobProfiles(companyId) {
        try {
            const response = await this.CompanyModel.getJobProfiles(companyId);
            return new apiResponse(200, response, "Job profiles fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async updateRecruitmentStatus(companyId) {
        try {
            const company = await this.CompanyModel.findById(companyId)
                .populate({
                    path: 'JNFs',
                    populate: {
                        path: 'placementDrive'
                    }
                });

            if (!company) {
                return new apiResponse(404, null, "Company not found");
            }

            // Determine status based on JNFs and placement drives
            let recruitmentStatus = 'upcoming';

            if (company.JNFs.length === 0) {
                recruitmentStatus = 'inactive';
            } else if (company.JNFs.some(jnf => 
                jnf.placementDrive && jnf.placementDrive.status === 'inProgress'
            )) {
                recruitmentStatus = 'ongoing';
            } else if (company.JNFs.every(jnf => 
                jnf.placementDrive && jnf.placementDrive.status === 'completed'
            )) {
                recruitmentStatus = 'completed';
            }

            // Update company status
            company.recruitmentStatus = recruitmentStatus;
            await company.save();

            return new apiResponse(200, company, "Recruitment status updated successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getCompanyVisits(id) {
        try {
            const company = await Company.findById(id)
                .select('lastVisit')
                .lean();

            if (!company) {
                return new apiResponse(404, null, "Company not found");
            }

            return new apiResponse(200, { data: company.lastVisit }, "Visit history fetched successfully");
        } catch (error) {
            console.error("Service Error:", error);
            throw new Error(error.message || "Error fetching visit history");
        }
    }
}

