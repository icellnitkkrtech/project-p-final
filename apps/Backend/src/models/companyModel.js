import Company  from "../schema/company/companySchema.js";
import JNF from "../schema/company/jnfSchema.js";
import User from "../schema/userSchema.js";
import apiResponse from "../utils/apiResponse.js";
import PlacementDrive from "../schema/placement/placementSchema.js";
import StudentPlacement from "../schema/placement/studentPlacementSchema.js";

export default class companyModel {
    company = Company;
    user = User;

    async getAllCompanies() {
        console.log("Company Model: getAllCompanies called");
        try {
            const companies = await this.company.find()
                .populate({
                    path: 'JNFs',
                    populate: {
                        path: 'placementDrive'
                    }
                })
                .sort({ createdAt: -1 });

            return companies;
        } catch (error) {
            throw error;
        }
    }

    async createCompany(companyData, userId) {
        console.log("Company Model: createCompany called");
        const {companyName, email, website} = companyData;
        try {
            const createdCompany = await this.company.create(
                {
                    user: userId,
                    companyName: companyName, 
                    email: email, 
                    website: website
                } 
            );
            console.log(createdCompany);
            return new apiResponse(201, null, "Company created successfully", createdCompany);
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }
    async createCompanyBYAdmin(companyData, userId) {
        console.log("Company Model: createCompany called");
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }
    
            if (!companyData.companyName) {
                throw new Error('Company name is required');
            }
    
            if (!companyData.email) {
                throw new Error('Company email is required');
            }
    
            const createdCompany = await this.company.create({
                user: userId,
                companyName: companyData.companyName,
                email: companyData.email,
                website: companyData.website,
                JNFs: companyData.JNFs || [], // Handle JNFs array if provided
                recruitmentStatus: companyData.recruitmentStatus || 'upcoming',
                hiringSince: companyData.hiringSince || new Date(),
                status: 'active'
            });
    
            console.log("Created company:", createdCompany);
            return new apiResponse(201, createdCompany, "Company created successfully");
        } catch (error) {
            console.error("Error creating company:", error);
            return new apiResponse(500, null, error.message);
        }
    }
    async findCompanyById(id) {
        console.log("Model layer: findCompanyById called");
    
        try {
            const company = await this.company.findById(id).populate("JNFs"); 
            if (!company) {
                return null; 
            }
    
            return new apiResponse(200, company, "Company retrieved successfully"); 
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async updateCompany(id, updates) {
        console.log("Company Model: updateCompany called");
        try {
            const updatedCompany = await this.company.findByIdAndUpdate(id, updates, { new: true });
            console.log(updatedCompany);

            if (!updatedCompany)
                { 
                    console.log("not updated");
                    return null;
                }
            return updatedCompany;

        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async deleteCompany(id_company,id_user) {
        console.log("Company Model: deleteCompany called");
        try {
            const deletedUser = await this.user.findByIdAndDelete(id_user);
            if (!deletedUser) {
                return new apiResponse(404, null, "User not found");
            }
            const deletedCompany = await this.company.findByIdAndDelete(id_company);
            if (!deletedCompany) {
                return new apiResponse(404, null, "Company not found");
            }
            return new apiResponse(200, null, "Company deleted successfully");
            
        } catch (error) {
            console.error("Error in deleteCompany:", error.message);
            return new apiResponse(500, null, "Internal server error");
        }
    }

    async addJNFToCompany(companyId, jnfData, userId) {
        console.log("Company Model: addJNFToCompany called");
        try {
            // Create a new JNF document
            const newJNF = new JNF({
                company: companyId,
                user: userId,
                companyDetails: jnfData.companyDetails,
                jobProfiles: jnfData.jobProfiles,
                eligibilityCriteria: jnfData.eligibilityCriteria,
                eligibleBranchesForProfiles: jnfData.eligibleBranchesForProfiles,
                selectionProcessForProfiles: jnfData.selectionProcessForProfiles,
                bondDetails: jnfData.bondDetails,
                pointOfContact: jnfData.pointOfContact,
                additionalInfo: jnfData.additionalInfo,
                status: "pending" // Default status for new JNFs
            });
            
            // Save the JNF
            const savedJNF = await newJNF.save();
            
            if (!savedJNF) {
                return null;
            }
            
            // Update the company document to include this JNF
            const updatedCompany = await this.company.findByIdAndUpdate(
                companyId,
                { $push: { JNFs: savedJNF._id } },
                { new: true }
            );
            
            if (!updatedCompany) {
                // If company update fails, delete the JNF to avoid orphaned records
                await JNF.findByIdAndDelete(savedJNF._id);
                return null;
            }
            
            return savedJNF;
        } catch (error) {
            console.error("Error in addJNFToCompany model:", error);
            return null;
        }
    }

    async getJNFsForCompany(companyId) {
        console.log("Company Model: getJNFsForCompany called");
        try {
            const company = await this.company.findById(companyId).populate("JNFs");
            if (!company) {
                return new apiResponse(404, null, "Company not found");
            }
            return new apiResponse(200, company.JNFs, "JNFs fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getTotalCompanies() {
        try {
            const totalCompanies = await this.company.countDocuments({});
            return new apiResponse(200, totalCompanies, "Total companies fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, "An error occurred while fetching total companies");
        }
    }

    async getVisitHistory(companyId) {
        try {
            const company = await this.company.findById(companyId).populate('visits');
            if (!company) {
                return new apiResponse(404, null, "Company not found");
            }
            return new apiResponse(200, company.visits, "Visit history fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getPlacedStudents(companyId) {
        try {
            const placements = await StudentPlacement.find({ company: companyId })
                .populate({
                    path: 'student',
                    select: 'name email rollNo branch photo'
                })
                .populate('placementDrive', 'placementDrive_title')
                .sort({ joiningDate: -1 });

            if (!placements) {
                return new apiResponse(404, null, "No placements found");
            }

            const formattedPlacements = placements.map(placement => ({
                name: placement.student.name,
                email: placement.student.email,
                rollNo: placement.student.rollNo,
                branch: placement.student.branch,
                photo: placement.student.photo,
                position: placement.position,
                department: placement.department,
                package: placement.package,
                joiningDate: placement.joiningDate,
                status: placement.status,
                batch: placement.batch,
                offerLetterUrl: placement.offerLetterUrl,
                placementType: placement.placementType,
                driveName: placement.placementDrive?.placementDrive_title,
                selectionDetails: placement.selectionDetails
            }));

            return new apiResponse(200, formattedPlacements, "Placements fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async getJobProfiles(companyId) {
        try {
            const company = await this.company.findById(companyId).populate('jobProfiles');
            if (!company) {
                return new apiResponse(404, null, "Company not found");
            }
            return new apiResponse(200, company.jobProfiles, "Job profiles fetched successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async addPlacement(companyId, placementData) {
        try {
            const placement = new PlacementDrive({
                company: companyId,
                ...placementData
            });

            await placement.save();

            // Update company statistics
            await this.company.findByIdAndUpdate(companyId, {
                $inc: { 
                    totalHired: 1,
                    [`${placement.batch}Hired`]: 1
                },
                $max: { highestPackage: placement.package },
                $avg: { avgPackage: placement.package }
            });

            return new apiResponse(201, placement, "Placement added successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

    async updatePlacement(placementId, updates) {
        try {
            const placement = await PlacementDrive.findByIdAndUpdate(
                placementId,
                { ...updates },
                { new: true }
            ).populate('student');

            if (!placement) {
                return new apiResponse(404, null, "Placement not found");
            }

            return new apiResponse(200, placement, "Placement updated successfully");
        } catch (error) {
            return new apiResponse(500, null, error.message);
        }
    }

}
