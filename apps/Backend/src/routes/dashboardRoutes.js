import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import Student from "../schema/student/studentSchema.js";
import Company from "../schema/company/companySchema.js";
import Placement from "../schema/placement/placementSchema.js";

const dashboardRouter = Router();

// Analytics endpoint with filter support
dashboardRouter.get('/analytics', asyncHandler(async (req, res) => {
    try {
        // Extract filter parameters
        const { session, educationLevel, driveType, offerType } = req.query;
        
        // Build filter queries based on actual schema structure
        const studentQuery = {};
        const companyQuery = {};
        const placementQuery = {};
        
        // Apply placement session filter
        if (session && session !== 'all') {
            placementQuery['placementSession'] = session;
        }
        
        // Apply education level filter
        if (educationLevel && educationLevel !== 'all') {
            // Map educationLevel to department or degree type
            if (educationLevel === 'UG') {
                studentQuery['personalInfo.department'] = { $in: ['Computer Engineering', 'Information Technology', 'Electronics & Communication Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Production & Industrial Engineering', 'Civil Engineering'] };
            } else if (educationLevel === 'PG') {
                studentQuery['personalInfo.department'] = { $in: ['M.Tech', 'MBA', 'MCA', 'M.Sc', 'PhD'] };
            }
        }
        
        // Apply drive type filter to placement drives
        if (driveType && driveType !== 'all') {
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'internPpo'] };
            }
        }
        
        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = 'internPpo';
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = 'fteIntern';
            }
        }
        
        // Get total students count
        const totalStudents = await Student.countDocuments(studentQuery);
        
        // Get companies visited count
        const companiesVisited = await Company.countDocuments(companyQuery);
        
        // Get placement data
        const placements = await Placement.find(placementQuery);
        
        // Calculate placed students (students who have been selected)
        let placedStudents = 0;
        let totalPackage = 0;
        
        // Process placements to get placed students and package details
        for (const placement of placements) {
            if (placement.roundDetails && placement.roundDetails.rounds) {
                const finalRound = placement.roundDetails.rounds[placement.roundDetails.rounds.length - 1];
                if (finalRound && finalRound.selectedStudents) {
                    placedStudents += finalRound.selectedStudents.length;
                    
                    // Calculate total package for average
                    if (placement.jobProfile && placement.jobProfile.ctc) {
                        totalPackage += placement.jobProfile.ctc * finalRound.selectedStudents.length;
                    }
                }
            }
        }
        
        // Calculate placement rate and average package
        const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
        const avgPackage = placedStudents > 0 ? (totalPackage / placedStudents).toFixed(2) : 0;
        
        // Get previous period data for comparison
        // This would require historical data which we don't have access to
        // For now, we'll return 0 for growth metrics
        const studentGrowth = 0;
        const companyGrowth = 0;
        const placementRateChange = 0;
        const packageGrowth = 0;
        
        res.json({
            totalStudents,
            companiesVisited,
            placedStudents,
            placementRate,
            avgPackage,
            studentGrowth,
            companyGrowth,
            placementRateChange,
            packageGrowth
        });
    } catch (error) {
        console.error("Error in analytics endpoint:", error);
        res.status(500).json({ 
            error: "Failed to fetch analytics data",
            message: error.message 
        });
    }
}));

// Placement progress endpoint with filter support
dashboardRouter.get('/placement-progress', asyncHandler(async (req, res) => {
    try {
        const { session, educationLevel } = req.query;
        
        // Build filter queries
        const studentQuery = {};
        
        // Apply session filter
        if (session && session !== 'all') {
            studentQuery['personalInfo.batch'] = Number(session.split('-')[0]);
        }
        
        // Apply education level filter
        if (educationLevel && educationLevel !== 'all') {
            if (educationLevel === 'UG') {
                studentQuery['personalInfo.department'] = {
                    $in: ['Computer Engineering', 'Information Technology', 
                          'Electronics & Communication Engineering', 'Electrical Engineering', 
                          'Mechanical Engineering', 'Production & Industrial Engineering', 
                          'Civil Engineering']
                };
            } else if (educationLevel === 'PG') {
                studentQuery['personalInfo.department'] = {
                    $in: ['M.Tech', 'MBA', 'MCA']
                };
            }
        }

        // Get total students with filters
        const totalStudents = await Student.countDocuments(studentQuery);

        // Get placed students with their placement dates
        const placedStudents = await Student.find({
            ...studentQuery,
            isPlaced: true,
            placementDate: { $exists: true }
        }).sort({ placementDate: 1 });

        // Initialize monthly data with academic year order (July to June)
        const months = ['July', 'August', 'September', 'October', 'November', 'December',
                       'January', 'February', 'March', 'April', 'May', 'June'];
        
        let monthlyData = months.map(month => ({
            month,
            placed: 0,
            target: Math.round((totalStudents * months.indexOf(month) + 1) / months.length)
        }));

        // Calculate cumulative placements by month
        let cumulativePlaced = 0;
        placedStudents.forEach(student => {
            if (student.placementDate) {
                const date = new Date(student.placementDate);
                const monthName = months[(date.getMonth() + 6) % 12]; // Adjust for academic year
                const monthIndex = months.indexOf(monthName);
                
                if (monthIndex !== -1) {
                    cumulativePlaced++;
                    // Update all months from this point forward with cumulative count
                    for (let i = monthIndex; i < months.length; i++) {
                        monthlyData[i].placed = cumulativePlaced;
                    }
                }
            }
        });

        // Calculate overall percentage
        const placementPercentage = totalStudents > 0 
            ? Math.round((placedStudents.length / totalStudents) * 100) 
            : 0;

        res.json({
            overall: {
                total: totalStudents,
                placed: placedStudents.length,
                percentage: placementPercentage
            },
            monthly: monthlyData
        });

    } catch (error) {
        console.error("Error in placement-progress endpoint:", error);
        res.status(500).json({ 
            error: "Failed to fetch placement progress data",
            message: error.message 
        });
    }
}));

// Company stats endpoint
dashboardRouter.get('/company-stats', asyncHandler(async (req, res) => {
    try {
        // Extract filter parameters
        const { session, educationLevel, driveType, offerType } = req.query;
        
        // Build filter queries based on actual schema structure
        const companyQuery = {};
        const placementQuery = {};
        
        // Apply placement session filter
        if (session && session !== 'all') {
            placementQuery['placementSession'] = session;
        }
        
        // Apply drive type filter to placement drives
        if (driveType && driveType !== 'all') {
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'internPpo'] };
            }
        }
        
        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = 'internPpo';
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = 'fteIntern';
            }
        }
        
        // Get all companies
        const companies = await Company.find(companyQuery);
        
        // Get all placement drives that match the filters
        const placements = await Placement.find(placementQuery);
        
        // Calculate total companies
        const total = companies.length;
        
        // Group companies by status
        const byStatus = [
            { status: 'Ongoing', count: companies.filter(c => c.recruitmentStatus === 'ongoing').length },
            { status: 'Upcoming', count: companies.filter(c => c.recruitmentStatus === 'upcoming').length },
            { status: 'Completed', count: companies.filter(c => c.recruitmentStatus === 'completed').length }
        ];
        
        // Group companies by type
        const companyTypes = {};
        placements.forEach(placement => {
            if (placement.companyDetails && placement.companyDetails.companyType) {
                const type = placement.companyDetails.companyType;
                companyTypes[type] = (companyTypes[type] || 0) + 1;
            }
        });
        
        const byType = Object.entries(companyTypes).map(([type, count]) => ({
            type,
            count
        }));
        
        // Group companies by package range
        const packageRanges = {
            '> 20 LPA': 0,
            '15-20 LPA': 0,
            '10-15 LPA': 0,
            '5-10 LPA': 0,
            '< 5 LPA': 0
        };
        
        placements.forEach(placement => {
            if (placement.jobProfile && placement.jobProfile.ctc) {
                const ctc = placement.jobProfile.ctc;
                
                if (ctc > 20) {
                    packageRanges['> 20 LPA']++;
                } else if (ctc >= 15) {
                    packageRanges['15-20 LPA']++;
                } else if (ctc >= 10) {
                    packageRanges['10-15 LPA']++;
                } else if (ctc >= 5) {
                    packageRanges['5-10 LPA']++;
                } else {
                    packageRanges['< 5 LPA']++;
                }
            }
        });
        
        const byPackage = Object.entries(packageRanges).map(([range, count]) => ({
            range,
            count
        }));
        
        res.json({
            total,
            byStatus,
            byType,
            byPackage
        });
    } catch (error) {
        console.error("Error in company-stats endpoint:", error);
        res.status(500).json({ 
            error: "Failed to fetch company stats data",
            message: error.message 
        });
    }
}));

// Branch stats endpoint
dashboardRouter.get('/branch-stats', asyncHandler(async (req, res) => {
    try {
        const { session, educationLevel, driveType, offerType } = req.query;
        
        // Build filter queries
        const studentQuery = {};
        const placementQuery = {};
        
        // Apply session filter
        if (session && session !== 'all') {
            studentQuery['personalInfo.batch'] = Number(session.split('-')[0]);
            placementQuery['placementSession'] = session;
        }
        
        // Apply education level filter
        if (educationLevel && educationLevel !== 'all') {
            if (educationLevel === 'UG') {
                studentQuery['personalInfo.department'] = {
                    $in: ['Computer Engineering', 'Information Technology', 
                          'Electronics & Communication Engineering', 'Electrical Engineering', 
                          'Mechanical Engineering', 'Production & Industrial Engineering', 
                          'Civil Engineering']
                };
            } else if (educationLevel === 'PG') {
                studentQuery['personalInfo.department'] = {
                    $in: ['M.Tech', 'MBA', 'MCA']
                };
            }
        }

        // Apply drive type filter
        if (driveType && driveType !== 'all') {
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'internPpo'] };
            }
        }

        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = 'internPpo';
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = 'fteIntern';
            }
        }

        // Get all students with department grouping
        const students = await Student.find(studentQuery);
        
        // Get placements with selected students
        const placements = await Placement.find(placementQuery)
            .populate({
                path: 'roundDetails.rounds.selectedStudents',
                select: 'personalInfo.department'
            });

        // Initialize branch data
        const branchData = {};
        
        // Count total students per branch
        students.forEach(student => {
            if (student.personalInfo?.department) {
                const department = student.personalInfo.department;
                if (!branchData[department]) {
                    branchData[department] = {
                        branch: department,
                        total: 0,
                        placed: 0
                    };
                }
                branchData[department].total++;
            }
        });

        // Count placed students per branch
        placements.forEach(placement => {
            if (placement.roundDetails?.rounds) {
                const finalRound = placement.roundDetails.rounds[placement.roundDetails.rounds.length - 1];
                if (finalRound?.selectedStudents) {
                    finalRound.selectedStudents.forEach(student => {
                        if (student.personalInfo?.department) {
                            const department = student.personalInfo.department;
                            if (branchData[department]) {
                                branchData[department].placed++;
                            }
                        }
                    });
                }
            }
        });

        // Convert to array and sort by branch name
        const branches = Object.values(branchData).sort((a, b) => 
            a.branch.localeCompare(b.branch)
        );

        res.json({ branches });

    } catch (error) {
        console.error("Error in branch-stats endpoint:", error);
        res.status(500).json({ 
            error: "Failed to fetch branch stats data",
            message: error.message 
        });
    }
}));

// CTC analysis endpoint
dashboardRouter.get('/ctc-analysis', asyncHandler(async (req, res) => {
    try {
        // Extract filter parameters
        const { session, educationLevel, driveType, offerType } = req.query;
        
        // Build filter queries based on actual schema structure
        const placementQuery = {};
        
        // Apply placement session filter
        if (session && session !== 'all') {
            placementQuery['placementSession'] = session;
        }
        
        // Apply drive type filter to placement drives
        if (driveType && driveType !== 'all') {
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'internPpo'] };
            }
        }
        
        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = 'internPpo';
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = 'fteIntern';
            }
        }
        
        // Get all placement drives that match the filters
        const placements = await Placement.find(placementQuery);
        
        // CTC distribution ranges
        const ctcRanges = [
            { range: "0-5 LPA", min: 0, max: 5, count: 0 },
            { range: "5-10 LPA", min: 5, max: 10, count: 0 },
            { range: "10-15 LPA", min: 10, max: 15, count: 0 },
            { range: "15-20 LPA", min: 15, max: 20, count: 0 },
            { range: "20+ LPA", min: 20, max: Infinity, count: 0 }
        ];
        
        // Branch-wise CTC data
        const branchCTC = {};
        
        // Process placements to calculate CTC distribution
        for (const placement of placements) {
            if (placement.jobProfile && placement.jobProfile.ctc) {
                const ctc = placement.jobProfile.ctc;
                
                // Count in CTC ranges
                for (const range of ctcRanges) {
                    if (ctc >= range.min && ctc < range.max) {
                        range.count++;
                        break;
                    }
                }
                
                // Process by branch
                if (placement.roundDetails && placement.roundDetails.rounds) {
                    const finalRound = placement.roundDetails.rounds[placement.roundDetails.rounds.length - 1];
                    if (finalRound && finalRound.selectedStudents) {
                        for (const studentId of finalRound.selectedStudents) {
                            try {
                                const student = await Student.findById(studentId);
                                if (student && student.personalInfo && student.personalInfo.department) {
                                    const branch = student.personalInfo.department;
                                    
                                    if (!branchCTC[branch]) {
                                        branchCTC[branch] = {
                                            branch,
                                            totalCTC: 0,
                                            count: 0,
                                            avgCTC: 0
                                        };
                                    }
                                    
                                    branchCTC[branch].totalCTC += ctc;
                                    branchCTC[branch].count++;
                                }
                            } catch (err) {
                                console.error("Error finding student:", err);
                            }
                        }
                    }
                }
            }
        }
        
        // Calculate average CTC by branch
        Object.values(branchCTC).forEach(branch => {
            if (branch.count > 0) {
                branch.avgCTC = (branch.totalCTC / branch.count).toFixed(2);
            }
            delete branch.totalCTC; // Remove the total CTC from the response
            delete branch.count; // Remove the count from the response
        });
        
        res.json({
            distribution: ctcRanges,
            branchWise: Object.values(branchCTC)
        });
    } catch (error) {
        console.error("Error in ctc-analysis endpoint:", error);
        res.status(500).json({ 
            error: "Failed to fetch CTC analysis data",
            message: error.message 
        });
    }
}));

// Top companies endpoint
dashboardRouter.get('/top-companies', asyncHandler(async (req, res) => {
    try {
        // Extract filter parameters
        const { session, educationLevel, driveType, offerType } = req.query;
        
        // Build filter queries based on actual schema structure
        const placementQuery = {};
        
        // Apply placement session filter
        if (session && session !== 'all') {
            placementQuery['placementSession'] = session;
        }
        
        // Apply drive type filter to placement drives
        if (driveType && driveType !== 'all') {
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'internPpo'] };
            }
        }
        
        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = 'internPpo';
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = 'fteIntern';
            }
        }
        
        // Get all placement drives that match the filters
        const placements = await Placement.find(placementQuery);
        
        // Process placements to get company statistics
        const companyStats = {};
        
        for (const placement of placements) {
            if (placement.companyDetails && placement.companyDetails.name) {
                const companyName = placement.companyDetails.name;
                
                if (!companyStats[companyName]) {
                    companyStats[companyName] = {
                        name: companyName,
                        ctc: 0,
                        hired: 0,
                        totalCTC: 0
                    };
                }
                
                // Count hired students
                if (placement.roundDetails && placement.roundDetails.rounds) {
                    const finalRound = placement.roundDetails.rounds[placement.roundDetails.rounds.length - 1];
                    if (finalRound && finalRound.selectedStudents) {
                        companyStats[companyName].hired += finalRound.selectedStudents.length;
                        
                        // Calculate total CTC
                        if (placement.jobProfile && placement.jobProfile.ctc) {
                            companyStats[companyName].totalCTC += placement.jobProfile.ctc * finalRound.selectedStudents.length;
                        }
                    }
                }
                
                // Set CTC
                if (placement.jobProfile && placement.jobProfile.ctc) {
                    // If multiple CTCs for same company, take the highest
                    if (companyStats[companyName].ctc < placement.jobProfile.ctc) {
                        companyStats[companyName].ctc = placement.jobProfile.ctc;
                    }
                }
            }
        }
        
        // Calculate average CTC for each company
        Object.values(companyStats).forEach(company => {
            if (company.hired > 0) {
                company.avgCTC = (company.totalCTC / company.hired).toFixed(2);
            }
            delete company.totalCTC; // Remove the total CTC from the response
        });
        
        // Convert to array and sort for different categories
        const companiesArray = Object.values(companyStats);
        
        // Top paying companies (by CTC)
        const topPaying = [...companiesArray]
            .sort((a, b) => b.ctc - a.ctc)
            .slice(0, 5);
        
        // Top hiring companies (by number of students hired)
        const topHiring = [...companiesArray]
            .sort((a, b) => b.hired - a.hired)
            .slice(0, 5);
        
        // Least paying companies (by CTC, excluding zeros)
        const leastPaying = [...companiesArray]
            .filter(company => company.ctc > 0)
            .sort((a, b) => a.ctc - b.ctc)
            .slice(0, 5);
        
        res.json({
            topPaying,
            topHiring,
            leastPaying
        });
    } catch (error) {
        console.error("Error in top-companies endpoint:", error);
        res.status(500).json({ 
            error: "Failed to fetch top companies data",
            message: error.message 
        });
    }
}));

// Job profiles endpoint
dashboardRouter.get('/job-profiles', asyncHandler(async (req, res) => {
    try {
        // Extract filter parameters
        const { session, educationLevel, driveType, offerType } = req.query;
        
        // Build filter queries based on actual schema structure
        const placementQuery = {};
        
        // Apply placement session filter
        if (session && session !== 'all') {
            placementQuery['placementSession'] = session;
        }
        
        // Apply drive type filter to placement drives
        if (driveType && driveType !== 'all') {
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'internPpo'] };
            }
        }
        
        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = 'fte';
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = 'internPpo';
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = 'fteIntern';
            }
        }
        
        // Get all placement drives that match the filters
        const placements = await Placement.find(placementQuery);
        
        // Process placements to get sector distribution
        const sectorCounts = {};
        let totalSectors = 0;
        
        // Process placements to get profile analysis
        const profileStats = {};
        
        for (const placement of placements) {
            // Process sector data
            if (placement.companyDetails && placement.companyDetails.domain) {
                const sector = placement.companyDetails.domain;
                sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
                totalSectors++;
            }
            
            // Process profile data
            if (placement.jobProfile && placement.jobProfile.profileId) {
                const profile = placement.jobProfile.profileId;
                
                if (!profileStats[profile]) {
                    profileStats[profile] = {
                        profile,
                        count: 0,
                        totalCTC: 0,
                        avgCTC: 0
                    };
                }
                
                // Count students in this profile
                if (placement.roundDetails && placement.roundDetails.rounds) {
                    const finalRound = placement.roundDetails.rounds[placement.roundDetails.rounds.length - 1];
                    if (finalRound && finalRound.selectedStudents) {
                        profileStats[profile].count += finalRound.selectedStudents.length;
                        
                        // Calculate total CTC
                        if (placement.jobProfile.ctc) {
                            profileStats[profile].totalCTC += placement.jobProfile.ctc * finalRound.selectedStudents.length;
                        }
                    }
                }
            }
        }
        
        // Convert sector counts to percentages
        const sectors = Object.entries(sectorCounts).map(([name, count]) => ({
            name,
            value: Math.round((count / totalSectors) * 100) || 0
        }));
        
        // Calculate average CTC for each profile
        Object.values(profileStats).forEach(profile => {
            if (profile.count > 0) {
                profile.avgCTC = parseFloat((profile.totalCTC / profile.count).toFixed(2));
            }
            delete profile.totalCTC; // Remove the total CTC from the response
        });
        
        // Convert profiles to array and sort by count
        const profiles = Object.values(profileStats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Get top 5 profiles
        
        res.json({
            sectors,
            profiles
        });
    } catch (error) {
        console.error("Error in job-profiles endpoint:", error);
        res.status(500).json({ 
            error: "Failed to fetch job profile data",
            message: error.message 
        });
    }
}));

// Career preferences endpoint
dashboardRouter.get('/career-preferences', asyncHandler(async (req, res) => {
    try {
        // Extract filter parameters
        const { session, educationLevel } = req.query;
        
        // Build filter queries based on actual schema structure
        const studentQuery = {};
        
        // Apply placement session filter
        if (session && session !== 'all') {
            placementQuery['placementSession'] = session;
        }
        
        // Apply education level filter
        if (educationLevel && educationLevel !== 'all') {
            // Map educationLevel to department or degree type
            if (educationLevel === 'UG') {
                studentQuery['personalInfo.department'] = { $in: ['Computer Engineering', 'Information Technology', 'Electronics & Communication Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Production & Industrial Engineering', 'Civil Engineering'] };
            } else if (educationLevel === 'PG') {
                studentQuery['personalInfo.department'] = { $in: ['M.Tech', 'MBA', 'MCA', 'M.Sc', 'PhD'] };
            }
        }
        
        // Add filter for non-enrolled students (students who are not placed)
        studentQuery['isPlaced'] = { $ne: true };
        
        // Get all students that match the filters
        const students = await Student.find(studentQuery);
        
        // Process students to get career preferences
        const careerCounts = {
            'Higher Studies': 0,
            'Startup': 0,
            'Civil Services': 0,
            'Research': 0,
            'Family Business': 0,
            'Other': 0
        };
        
        // Branch-wise preferences
        const branchPreferences = {};
        
        for (const student of students) {
            // Get career preference
            let careerPreference = 'Other';
            
            if (student.careerPreference) {
                careerPreference = student.careerPreference;
            }
            
            // Count career preferences
            if (careerCounts[careerPreference] !== undefined) {
                careerCounts[careerPreference]++;
            } else {
                careerCounts['Other']++;
            }
            
            // Process branch-wise preferences
            if (student.personalInfo && student.personalInfo.department) {
                const branch = student.personalInfo.department;
                
                if (!branchPreferences[branch]) {
                    branchPreferences[branch] = {
                        branch,
                        'Higher Studies': 0,
                        'Startup': 0,
                        'Civil Services': 0,
                        'Research': 0,
                        'Family Business': 0,
                        'Other': 0
                    };
                }
                
                // Count preference for this branch
                if (branchPreferences[branch][careerPreference] !== undefined) {
                    branchPreferences[branch][careerPreference]++;
                } else {
                    branchPreferences[branch]['Other']++;
                }
            }
        }
        
        // Calculate total for percentages
        const totalStudents = students.length;
        
        // Convert career counts to percentages
        const careerPreferences = Object.entries(careerCounts).map(([name, count]) => ({
            name,
            value: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
        })).filter(item => item.value > 0);
        
        // Convert branch preferences to array and rename keys for the radar chart
        const branchWisePreferences = Object.values(branchPreferences).map(branch => ({
            branch: branch.branch,
            higherStudies: branch['Higher Studies'],
            startup: branch['Startup'],
            civilServices: branch['Civil Services'],
            research: branch['Research'],
            familyBusiness: branch['Family Business'],
            other: branch['Other']
        }));
        
        res.json({
            careerPreferences,
            branchWisePreferences
        });
    } catch (error) {
        console.error("Error in career-preferences endpoint:", error);
        res.status(500).json({ 
            error: "Failed to fetch career preference data",
            message: error.message 
        });
    }
}));

export default dashboardRouter;