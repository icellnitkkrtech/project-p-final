import companyModel from "../models/companyModel.js";
import UserModel from "../models/userModel.js";
import User from "../schema/userSchema.js";
import apiResponse from "../utils/apiResponse.js";

export default class companyServices {
    constructor() {
        this.CompanyModel = new companyModel;
        this.userModel = new UserModel();
    }

    async getAllCompanies() {
        console.log("Service layer: getAllCompanies called");
        try {
            const response = await this.CompanyModel.getAllCompanies();
            return new apiResponse(200, response, "Companies Fetched Successfully");
        }
        catch (error) {
            return new apiResponse(500, null, error.message);
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
        console.log("Service layer: getCompany called");
        try {
            const response = await this.CompanyModel.findCompanyById(id);

            return new apiResponse(200, response, "Company Found successfully");
        }
        catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async updateCompany(id, updates) {
        console.log("Service layer: updateCompany called");
        try {
            const response = await this.CompanyModel.updateCompany(id, updates);
            return new apiResponse(200, response, "Company Updated successfully");
        }
        catch (error) {
            return new apiResponse(500, null, error.message);
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
}

