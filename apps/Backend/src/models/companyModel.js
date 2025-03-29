import Company  from "../schema/company/companySchema.js";
import JNF from "../schema/company/jnfSchema.js";
import User from "../schema/userSchema.js";
import apiResponse from "../utils/apiResponse.js";
import PlacementDrive from "../schema/placement/placementSchema.js";
import StudentPlacement from "../schema/placement/studentPlacementSchema.js";
import {Application } from "../schema/general/applicationSchema.js";

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
// these job profiles are comming from jnf schema  instead of this  we can  also fetch jb profiles from drive 

    async getCompanyJobProfiles(companyId) {
        console.log("Company Model: getCompanyJobProfiles called for company:", companyId);
        try {
            // Find company and populate JNFs
            const company = await this.company.findById(companyId)
                .populate({
                    path: 'JNFs',
                    select: '-__v',
                    // Only get approved JNFs
                    match: { status: 'approved' }
                });

            if (!company) {
                console.log("Company not found with ID:", companyId);
                return new apiResponse(404, null, "Company not found");
            }

            console.log("Found company:", company.companyName);
            console.log("Number of JNFs:", company.JNFs?.length);

            // Transform JNFs into job profiles
            const jobProfiles = company.JNFs.map(jnf => {
                console.log("Processing JNF:", jnf._id);
                return {
                    id: jnf._id,
                    companyDetails: {
                        name: jnf.companyDetails?.name || company.companyName,
                        email: jnf.companyDetails?.email || company.email,
                        website: jnf.companyDetails?.website || company.website,
                        companyType: jnf.companyDetails?.companyType,
                        domain: jnf.companyDetails?.domain,
                        description: jnf.companyDetails?.description
                    },
                    jobProfiles: jnf.jobProfiles?.map(profile => ({
                        profileId: profile.profileId,
                        designation: profile.designation,
                        course: profile.course,
                        jobDescription: {
                            description: profile.jobDescription?.description,
                            hasFile: profile.jobDescription?.attachFile,
                            filePath: profile.jobDescription?.file
                        },
                        ctc: profile.ctc,
                        takeHome: profile.takeHome,
                        perks: profile.perks,
                        trainingPeriod: profile.trainingPeriod,
                        placeOfPosting: profile.placeOfPosting,
                        jobType: profile.jobType,
                        stipend: profile.stipend,
                        internDuration: profile.internDuration
                    })),
                    eligibilityCriteria: {
                        minCgpa: jnf.eligibilityCriteria?.minCgpa,
                        backlogAllowed: jnf.eligibilityCriteria?.backlogAllowed
                    },
                    selectionProcess: jnf.selectionProcessForProfiles?.map(process => ({
                        profileId: process.profileId,
                        rounds: process.rounds,
                        expectedRecruits: process.expectedRecruits,
                        tentativeDate: process.tentativeDate
                    })),
                    bondDetails: {
                        hasBond: jnf.bondDetails?.hasBond,
                        details: jnf.bondDetails?.details
                    },
                    status: jnf.status,
                    submissionDate: jnf.submissionDate
                };
            });

            console.log(`Found ${jobProfiles.length} job profiles for company ${company.companyName}`);

            return new apiResponse(200, {
                company: {
                    id: company._id,
                    name: company.companyName,
                    email: company.email,
                    website: company.website,
                    status: company.status,
                    recruitmentStatus: company.recruitmentStatus,
                    totalJNFs: company.JNFs.length,
                    activeJobProfiles: jobProfiles.length,
                    statistics: {
                        offersCount: company.offersCount || 0,
                        avgPackage: company.avgPackage || 0,
                        totalHired: company.totalHired || 0
                    }
                },
                jobProfiles: jobProfiles
            }, "Job profiles fetched successfully");

        } catch (error) {
            console.error("Model Error in getCompanyJobProfiles:", error);
            return new apiResponse(500, null, `Error fetching job profiles: ${error.message}`);
        }
    } //for fetching job profiles from plcement drive  here is the code below 
    // async getCompanyJobProfiles(companyId) {
    //     console.log("Company Model: getCompanyJobProfiles called for company:", companyId);
    //     try {
    //         // Find company and populate JNFs with placement drives
    //         const company = await this.company.findById(companyId)
    //             .populate({
    //                 path: 'JNFs',
    //                 populate: {
    //                     path: 'placementDrive',
    //                     select: 'placementDrive_title jobProfile applicationDetails status companyDetails'
    //                 }
    //             });
    
    //         if (!company) {
    //             console.log("Company not found with ID:", companyId);
    //             return new apiResponse(404, null, "Company not found");
    //         }
    
    //         console.log("Found company:", company.companyName);
    //         console.log("Number of JNFs:", company.JNFs?.length);
            
    //         // Debug JNFs data
    //         company.JNFs?.forEach((jnf, index) => {
    //             console.log(`JNF ${index + 1}:`, {
    //                 id: jnf._id,
    //                 hasPlacementDrive: !!jnf.placementDrive,
    //                 driveDetails: jnf.placementDrive ? {
    //                     title: jnf.placementDrive.placementDrive_title,
    //                     status: jnf.placementDrive.status
    //                 } : 'No drive attached'
    //             });
    //         });
    
    //         // Filter and transform JNFs with placement drives
    //         const jobProfiles = company.JNFs
    //             .filter(jnf => {
    //                 const hasPlacementDrive = !!jnf.placementDrive;
    //                 console.log(`JNF ${jnf._id} has placement drive: ${hasPlacementDrive}`);
    //                 return hasPlacementDrive;
    //             })
    //             .map(jnf => {
    //                 const drive = jnf.placementDrive;
    //                 return {
    //                     id: drive._id,
    //                     jnfId: jnf._id,
    //                     title: drive.placementDrive_title,
    //                     jobProfile: {
    //                         designation: drive.jobProfile?.designation,
    //                         ctc: drive.jobProfile?.ctc,
    //                         jobType: drive.jobProfile?.jobType,
    //                         description: drive.jobProfile?.jobDescription?.description || '',
    //                         stipend: drive.jobProfile?.stipend,
    //                         internDuration: drive.jobProfile?.internDuration,
    //                         placeOfPosting: drive.jobProfile?.placeOfPosting
    //                     },
    //                     applicationDetails: {
    //                         deadline: drive.applicationDetails?.applicationDeadline,
    //                         applicationLink: drive.applicationDetails?.applicationLink
    //                     },
    //                     status: drive.status,
    //                     companyDetails: {
    //                         name: company.companyName,
    //                         email: company.email,
    //                         website: company.website,
    //                         recruitmentStatus: company.recruitmentStatus
    //                     }
    //                 };
    //             });
    
    //         console.log(`Found ${jobProfiles.length} job profiles for company ${company.companyName}`);
    
    //         return new apiResponse(200, {
    //             company: {
    //                 id: company._id,
    //                 name: company.companyName,
    //                 email: company.email,
    //                 website: company.website,
    //                 recruitmentStatus: company.recruitmentStatus,
    //                 totalJNFs: company.JNFs.length,
    //                 activeJobProfiles: jobProfiles.length
    //             },
    //             jobProfiles: jobProfiles
    //         }, "Job profiles fetched successfully");
    
    //     } catch (error) {
    //         console.error("Model Error in getCompanyJobProfiles:", error);
    //         return new apiResponse(500, null, `Error fetching job profiles: ${error.message}`);
    //     }
    // }

    async getDriveApplications(companyId) {
        
        try {
           // First, find company and populate JNFs with placement drives
        const company = await this.company.findById(companyId)
        .populate({
            path: 'JNFs',
            match: { status: 'approved' },
            populate: {
                path: 'placementDrive',
                select: 'placementDrive_title jobProfile applicationDetails status companyDetails applicantStudents'
            }
        });

    if (!company) {
        return new apiResponse(404, null, "Company not found");
    }
 console.log(company.JNFs);
    // Get the first JNF with an active placement drive
    const activeJNF = company.JNFs.find(jnf => jnf.placementDrive );

    console.log("Active JNF:", activeJNF);
    
    if (!activeJNF?.placementDrive) {
        return new apiResponse(200, {
            driveDetails: null,
            applications: []
        }, "No active placement drive found");
    }

    const driveId = activeJNF.placementDrive._id;
    console.log("Company Model: getDriveApplications called for drive:", driveId);
            // Find drive with populated applicant students
            const drive = await PlacementDrive.findById(driveId)
                .populate({
                    path: 'applicantStudents',
                    select: 'personalInfo academics user photo',
                    populate: {
                        path: 'user',
                        select: 'email'
                    }
                });

            if (!drive) {
                return new apiResponse(404, null, "Placement drive not found");
            }

            // Get applications for this drive
            const applications = await Application.find({ 
                placementDrive: driveId 
            }).populate('student', 'personalInfo academics');

            // Map applications with student details
            const applicationDetails = drive.applicantStudents.map(student => {
                const studentApplication = applications.find(
                    app => app.student._id.toString() === student._id.toString()
                );

                // Get current round info
                const currentRound = studentApplication?.roundStatus?.length > 0 
                    ? studentApplication.roundStatus[studentApplication.roundStatus.length - 1]
                    : null;

                return {
                    studentId: student._id,
                    name: student.personalInfo?.name,
                    email: student.user?.email,
                    rollNo: student.personalInfo?.rollNumber,
                    branch: student.personalInfo?.department,
                    semester: student.academics?.currentSemester,
                    cgpa: student.academics?.cgpa,
                    photo: student.photo,
                    position: drive.jobProfile?.designation,
                    appliedDate: studentApplication?.appliedAt,
                    status: studentApplication?.status || 'applied',
                    currentRound: currentRound ? {
                        number: currentRound.roundNumber,
                        name: currentRound.roundName,
                        status: currentRound.status,
                        date: currentRound.date
                    } : null,
                    timeline: studentApplication?.timeline || [],
                    offerDetails: studentApplication?.offerDetails,
                    documents: studentApplication?.documents,
                    isSelected: drive.selectedStudents.includes(student._id)
                };
            });

            return new apiResponse(200, {
                driveDetails: {
                    id: drive._id,
                    title: drive.placementDrive_title,
                    company: drive.companyDetails,
                    jobProfile: {
                        designation: drive.jobProfile.designation,
                        ctc: drive.jobProfile.ctc,
                        type: drive.jobProfile.jobType
                    },
                    status: drive.status,
                    deadline: drive.applicationDetails.applicationDeadline,
                    rounds: drive.selectionProcess[0]?.rounds || [],
                    eligibility: drive.eligibilityCriteria
                },
                statistics: {
                    totalApplications: applicationDetails.length,
                    selectedCount: drive.selectedStudents.length,
                    inProcessCount: applicationDetails.filter(app => app.status === 'in-process').length,
                    rejectedCount: applicationDetails.filter(app => app.status === 'rejected').length
                },
                applications: applicationDetails
            }, "Applications fetched successfully");

        } catch (error) {
            console.error("Model Error in getDriveApplications:", error);
            return new apiResponse(500, null, error.message);
        }
    }

}
