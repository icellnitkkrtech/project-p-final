import Admin from "../schema/admin/adminSchema.js";
import User from "../schema/userSchema.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Student from "../schema/student/studentSchema.js";
import Company from "../schema/company/companySchema.js";
import Placement from "../schema/placement/placementSchema.js";

export default class adminModel {
    admin = Admin;

    editAdmin = asyncHandler(async (adminData, id) => {
        const { updates } = adminData;
        const updatedAdmin = await this.admin.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedAdmin) {
            return apiResponse(404, "Admin not found");
        }
        return apiResponse(200, "Admin updated successfully", updatedAdmin);
    });

    createAdmin = asyncHandler(async (adminData, id) => {
        try {
            const {permissions} = adminData;
            const newAdmin = await this.admin.create({
                userid: id,
                permissions: permissions,
            });

            return apiResponse(200, "Admin created successfully", newAdmin);
        } catch (error) {
            return apiResponse(500, "An error occurred while creating admin", { error: error.message });
        }
    });

    deleteAdminById = asyncHandler(async (id) => {
        const deletedAdmin = await this.admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return apiResponse(404, "Admin not found");
        }
        return apiResponse(200, "Admin deleted successfully");
    });

    // Dashboard analytics methods
    getDashboardAnalytics = asyncHandler(async (filters = {}) => {
        try {
            // Build query based on filters
            const query = this.buildFilterQuery(filters);
            
            // Get total students count
            const totalStudents = await Student.countDocuments(query.studentQuery);
            
            // Get companies visited count
            const companiesVisited = await Company.countDocuments(query.companyQuery);
            
            // Get placement data
            const placements = await Placement.find(query.placementQuery);
            
            // Calculate placed students (students who have accepted offers)
            let placedStudents = 0;
            let totalPackage = 0;
            
            // Process placements to get placed students and package details
            placements.forEach(placement => {
                // Count students who have been selected in final rounds
                if (placement.roundDetails && placement.roundDetails.rounds) {
                    const finalRound = placement.roundDetails.rounds[placement.roundDetails.rounds.length - 1];
                    if (finalRound && finalRound.selectedStudents) {
                        placedStudents += finalRound.selectedStudents.length;
                    }
                }
                
                // Sum up package details if available
                if (placement.jobProfile && placement.jobProfile.salary) {
                    totalPackage += placement.jobProfile.salary.ctc || 0;
                }
            });
            
            // Calculate placement rate
            const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
            
            // Calculate average package
            const avgPackage = placedStudents > 0 ? (totalPackage / placedStudents).toFixed(2) : 0;
            
            return {
                totalStudents,
                companiesVisited,
                placedStudents,
                placementRate,
                avgPackage
            };
        } catch (error) {
            console.error("Error in getDashboardAnalytics:", error);
            return {
                totalStudents: 0,
                companiesVisited: 0,
                placedStudents: 0,
                placementRate: 0,
                avgPackage: 0
            };
        }
    });
    
    // Get previous period stats for comparison
    getPreviousPeriodStats = asyncHandler(async (filters = {}) => {
        try {
            // Determine previous period based on current filters
            const previousPeriodFilters = { ...filters };
            
            // If session filter exists, get previous session
            if (filters.session) {
                const [startYear, endYear] = filters.session.split('-').map(Number);
                previousPeriodFilters.session = `${startYear - 1}-${endYear - 1}`;
            }
            
            // Get stats for previous period
            return await this.getDashboardAnalytics(previousPeriodFilters);
        } catch (error) {
            console.error("Error in getPreviousPeriodStats:", error);
            return {
                totalStudents: 0,
                companiesVisited: 0,
                placedStudents: 0,
                placementRate: 0,
                avgPackage: 0
            };
        }
    });
    
    // Get placement progress data
    getPlacementProgress = asyncHandler(async (filters = {}) => {
        try {
            // Build query based on filters
            const query = this.buildFilterQuery(filters);
            
            // Get placements
            const placements = await Placement.find(query.placementQuery);
            
            // Group placements by month
            const monthlyData = {};
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'];
            
            months.forEach(month => {
                monthlyData[month] = { month, placed: 0, target: 0 };
            });
            
            // Set target values (these could come from a settings collection)
            const monthlyTargets = {
                'July': 10, 'August': 20, 'September': 30, 'October': 40,
                'November': 50, 'December': 60, 'January': 70, 'February': 80,
                'March': 90, 'April': 95, 'May': 100, 'June': 100
            };
            
            // Update targets
            Object.entries(monthlyTargets).forEach(([month, target]) => {
                if (monthlyData[month]) {
                    monthlyData[month].target = target;
                }
            });
            
            // Count placements by month
            placements.forEach(placement => {
                // Use creation date if offer date is not available
                const date = placement.createdAt ? new Date(placement.createdAt) : new Date();
                const month = months[date.getMonth()];
                
                // Count students who have been selected in final rounds
                if (placement.roundDetails && placement.roundDetails.rounds) {
                    const finalRound = placement.roundDetails.rounds[placement.roundDetails.rounds.length - 1];
                    if (finalRound && finalRound.selectedStudents) {
                        if (monthlyData[month]) {
                            monthlyData[month].placed += finalRound.selectedStudents.length;
                        }
                    }
                }
            });
            
            // Get total students for calculating overall percentage
            const totalStudents = await Student.countDocuments(query.studentQuery);
            
            // Calculate total placed students
            let placedStudents = 0;
            Object.values(monthlyData).forEach(data => {
                placedStudents += data.placed;
            });
            
            const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
            
            return {
                monthly: Object.values(monthlyData),
                overall: {
                    total: totalStudents,
                    placed: placedStudents,
                    percentage: placementPercentage
                }
            };
        } catch (error) {
            console.error("Error in getPlacementProgress:", error);
            return {
                monthly: [],
                overall: {
                    total: 0,
                    placed: 0,
                    percentage: 0
                }
            };
        }
    });
    
    // Get company statistics
    getCompanyStats = asyncHandler(async (filters = {}) => {
        try {
            // Build query based on filters
            const query = this.buildFilterQuery(filters);
            
            // Get companies
            const companies = await Company.find(query.companyQuery);
            
            // Get placements
            const placements = await Placement.find(query.placementQuery)
                .populate('companyDetails.companyId');
            
            // Group by company type
            const companyTypes = {
                'IT': 0,
                'Finance': 0,
                'Consulting': 0,
                'Manufacturing': 0,
                'Others': 0
            };
            
            companies.forEach(company => {
                const type = company.type || 'Others';
                if (companyTypes[type] !== undefined) {
                    companyTypes[type]++;
                } else {
                    companyTypes['Others']++;
                }
            });
            
            return {
                total: companies.length,
                byType: Object.entries(companyTypes).map(([type, count]) => ({
                    type,
                    count
                }))
            };
        } catch (error) {
            console.error("Error in getCompanyStats:", error);
            return {
                total: 0,
                byType: []
            };
        }
    });
    
    // Get job profile statistics
    getJobProfiles = asyncHandler(async (filters = {}) => {
        try {
            // Build query based on filters
            const query = this.buildFilterQuery(filters);
            
            // Get placements
            const placements = await Placement.find(query.placementQuery);
            
            // Group by job profile
            const jobProfiles = {};
            
            placements.forEach(placement => {
                if (placement.jobProfile && placement.jobProfile.designation) {
                    const designation = placement.jobProfile.designation;
                    if (!jobProfiles[designation]) {
                        jobProfiles[designation] = {
                            name: designation,
                            count: 0,
                            avgSalary: 0,
                            totalSalary: 0
                        };
                    }
                    
                    jobProfiles[designation].count++;
                    
                    if (placement.jobProfile.salary && placement.jobProfile.salary.ctc) {
                        jobProfiles[designation].totalSalary += placement.jobProfile.salary.ctc;
                    }
                }
            });
            
            // Calculate average salaries
            Object.values(jobProfiles).forEach(profile => {
                if (profile.count > 0) {
                    profile.avgSalary = (profile.totalSalary / profile.count).toFixed(2);
                }
                delete profile.totalSalary; // Remove the total salary from the response
            });
            
            return Object.values(jobProfiles);
        } catch (error) {
            console.error("Error in getJobProfiles:", error);
            return [];
        }
    });
    
    // Helper method to build filter queries
    buildFilterQuery = (filters) => {
        const studentQuery = {};
        const companyQuery = {};
        const placementQuery = {};
        
        // Apply session filter
        if (filters.session && filters.session !== 'all') {
            studentQuery.session = filters.session;
            companyQuery.session = filters.session;
            placementQuery['applicationDetails.session'] = filters.session;
        }
        
        // Apply education level filter
        if (filters.educationLevel && filters.educationLevel !== 'all') {
            studentQuery.educationLevel = filters.educationLevel;
            placementQuery['eligibilityCriteria.educationLevel'] = filters.educationLevel;
        }
        
        // Apply drive type filter
        if (filters.driveType && filters.driveType !== 'all') {
            placementQuery['placementDrive_type'] = filters.driveType;
        }
        
        // Apply offer type filter
        if (filters.offerType && filters.offerType !== 'all') {
            placementQuery['jobProfile.offerType'] = filters.offerType;
        }
        
        return {
            studentQuery,
            companyQuery,
            placementQuery
        };
    };
}