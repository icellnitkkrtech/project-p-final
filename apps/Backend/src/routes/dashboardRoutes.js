import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import Student from "../schema/student/studentSchema.js";
import Company from "../schema/company/companySchema.js";
import Placement from "../schema/placement/placementSchema.js";
import placementSession from "../schema/placement/placementSessionSchema.js";
const dashboardRouter = Router();

// Analytics endpoint with filter support
dashboardRouter.get('/analytics', asyncHandler(async (req, res) => {
    try {
        // Extract filter parameters
        const { session, educationLevel, driveType, offerType } = req.query;
        
        console.log("Analytics endpoint called with filters:", { session, educationLevel, driveType, offerType });
        
        // Build filter queries based on actual schema structure
        const studentQuery = {};
        const companyQuery = {};
        const placementQuery = {};
        
        // Apply placement session filter
        if (session && session !== 'all') {
            try {
                // Find the session data by ID
                const placementSessionData = await placementSession.findById(session);
                
                if (!placementSessionData) {
                    console.warn(`Session with ID ${session} not found`);
                } else {
                    console.log(`Found session: ${placementSessionData.name}`);
                    
                    // Add session to placement query
                    placementQuery['placementSession'] = placementSessionData._id;
                    
                    // Extract batch year from session name (e.g., "2023-24" -> "2023")
                    const sessionYears = placementSessionData.name.split('-');
                    if (sessionYears.length > 0) {
                        const batchYear = parseInt(sessionYears[1]);
                        if (!isNaN(batchYear)) {
                            studentQuery['personalInfo.batch'] = batchYear;
                            console.log(`Filtering students by batch year: ${batchYear}`);
                        }
                    }
                }
            } catch (err) {
                console.error(`Error finding session with ID ${session}:`, err);
            }
        }
        
        // Apply education level filter
        if (educationLevel && educationLevel !== 'all') {
            console.log(`Applying education level filter: ${educationLevel}`);
            
            // Map educationLevel to course values
            if (educationLevel === 'UG') {
                studentQuery['personalInfo.course'] = { $in: ['btech', 'B.Tech', 'BTech'] };
            } 
            else if (educationLevel === 'PG') {
                studentQuery['personalInfo.course'] = { 
                    $in: ['mtech', 'M.Tech', 'MTech', 'mca', 'MCA', 'mba', 'MBA'] 
                };
            }
        }
        
        // Apply drive type filter to placement drives
        if (driveType && driveType !== 'all') {
            console.log(`Applying drive type filter: ${driveType}`);
            
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = { $in: ['fte', 'FTE'] };
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { 
                    $in: ['fteIntern', 'internPpo', 'intern', 'Intern', 'internship', 'Internship'] 
                };
            }
        }
        
        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            console.log(`Applying offer type filter: ${offerType}`);
            
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = { $in: ['fte', 'FTE'] };
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = { $in: ['internPpo', 'InternPPO'] };
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'FTEIntern'] };
            }
        }
        
        console.log("Final query filters:");
        console.log("Student query:", JSON.stringify(studentQuery));
        console.log("Company query:", JSON.stringify(companyQuery));
        console.log("Placement query:", JSON.stringify(placementQuery));
        
        // Get total students count - IMPORTANT: This must match the placement-progress endpoint
        const totalStudents = await Student.countDocuments(studentQuery);
        console.log(`Total students matching criteria: ${totalStudents}`);
        
        // Get companies visited count
        const companiesVisited = await Company.countDocuments(companyQuery);
        console.log(`Companies visited: ${companiesVisited}`);
        
        // Get placement data
        const placements = await Placement.find(placementQuery);
        console.log(`Placements found: ${placements.length}`);
        
        // Calculate placed students (students who have been selected)
        // Using the same logic as in placement-progress endpoint
        const placedStudentIds = new Set(); // To avoid counting duplicates
        let totalPackage = 0;
        
        // First, get all students that match our filters
        const eligibleStudents = await Student.find(studentQuery).select('_id');
        const eligibleStudentIds = new Set(eligibleStudents.map(s => s._id.toString()));
        console.log(`Eligible students: ${eligibleStudentIds.size}`);
        
        // Process placements to get placed students and package details
        for (const placement of placements) {
            if (placement.roundDetails && placement.roundDetails.rounds) {
                // Find the completed rounds
                const completedRounds = placement.roundDetails.rounds.filter(
                    round => round.roundStatus === 'completed'
                );
                
                if (completedRounds.length > 0) {
                    // Get the final completed round
                    const finalRound = completedRounds[completedRounds.length - 1];
                    
                    if (finalRound && finalRound.selectedStudents && Array.isArray(finalRound.selectedStudents)) {
                        // Count unique students only if they match our student filters
                        finalRound.selectedStudents.forEach(studentId => {
                            if (studentId) {
                                const studentIdStr = studentId.toString();
                                
                                // Only count students that match our filters
                                if (eligibleStudentIds.has(studentIdStr) && !placedStudentIds.has(studentIdStr)) {
                                    placedStudentIds.add(studentIdStr);
                                    
                                    // Add to total package if CTC is available
                                    if (placement.jobProfile && placement.jobProfile.ctc) {
                                        const ctc = parseFloat(placement.jobProfile.ctc);
                                        if (!isNaN(ctc)) {
                                            totalPackage += ctc;
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
        
        const placedStudents = placedStudentIds.size;
        console.log(`Placed students (unique): ${placedStudents}`);
        console.log(`Total package sum: ${totalPackage}`);
        
        // Calculate placement rate and average package
        const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
        const avgPackage = placedStudents > 0 ? (totalPackage / placedStudents).toFixed(2) : 0;
        
        console.log(`Placement rate: ${placementRate}%`);
        console.log(`Average package: ${avgPackage} LPA`);
        
        // Get previous period data for comparison
        // For now, using placeholder values that show some growth
        const studentGrowth = 5.2;  // 5.2% increase from previous period
        const companyGrowth = 8.7;  // 8.7% increase from previous period
        const placementRateChange = 3.4;  // 3.4% increase from previous period
        const packageGrowth = 12.5;  // 12.5% increase from previous period
        
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
        // Extract filter parameters
        const { session, educationLevel, driveType, offerType } = req.query;
        
        console.log("Placement progress endpoint called with filters:", { session, educationLevel, driveType, offerType });
        
        // Build filter queries
        const studentQuery = {};
        const placementQuery = {};
        
        // Apply session filter
        if (session && session !== 'all') {
            try {
                // Find the session data by ID
                const placementSessionData = await placementSession.findById(session);
                
                if (!placementSessionData) {
                    console.warn(`Session with ID ${session} not found`);
                } else {
                    console.log(`Found session: ${placementSessionData.name}`);
                    
                    // Add session to placement query
                    placementQuery['placementSession'] = placementSessionData._id;
                    
                    // Extract batch year from session name (e.g., "2023-24" -> "2024")
                    const sessionYears = placementSessionData.name.split('-');
                    if (sessionYears.length > 1) {
                        const batchYear = parseInt(sessionYears[1]);
                        if (!isNaN(batchYear)) {
                            studentQuery['personalInfo.batch'] = batchYear;
                            console.log(`Filtering students by batch year: ${batchYear}`);
                        }
                    }
                }
            } catch (err) {
                console.error(`Error finding session with ID ${session}:`, err);
            }
        }
        
        // Apply education level filter
        if (educationLevel && educationLevel !== 'all') {
            console.log(`Applying education level filter: ${educationLevel}`);
            
            if (educationLevel === 'UG') {
                studentQuery['personalInfo.course'] = { 
                    $in: ['btech', 'B.Tech', 'BTech'] 
                };
            } else if (educationLevel === 'PG') {
                studentQuery['personalInfo.course'] = { 
                    $in: ['mtech', 'M.Tech', 'MTech', 'mba', 'MBA', 'mca', 'MCA'] 
                };
            }
        }
        
        // Get total students with filters
        const totalStudents = await Student.countDocuments(studentQuery);
        console.log(`Total students matching criteria: ${totalStudents}`);
        
        // Create a copy of the student query and add isPlaced=true to find placed students
        const placedStudentQuery = { ...studentQuery, isPlaced: true };
        
        // Count placed students directly from the Student collection
        const placedStudents = await Student.countDocuments(placedStudentQuery);
        console.log(`Placed students (with isPlaced=true): ${placedStudents}`);
        
        // Get all placed students with their placement dates
        const placedStudentDetails = await Student.find(placedStudentQuery)
            .select('_id placementDate')
            .lean();
        
        console.log(`Placed students with details: ${placedStudentDetails.length}`);
        
        // Extract placement dates
        const placementDates = [];
        placedStudentDetails.forEach(student => {
            // Check both possible locations for placement date
            let placementDate = null;
            if (student.placementDate) {
                placementDate = student.placementDate;
            } else if (student.placementInfo && student.placementInfo.placementDate) {
                placementDate = student.placementInfo.placementDate;
            }
            
            if (placementDate) {
                placementDates.push({
                    studentId: student._id.toString(),
                    date: new Date(placementDate)
                });
            } else {
                // If no placement date is available, use a default date (start of current month)
                const defaultDate = new Date();
                defaultDate.setDate(1); // First day of current month
                
                placementDates.push({
                    studentId: student._id.toString(),
                    date: defaultDate
                });
            }
        });
        
        console.log(`Placement dates collected: ${placementDates.length}`);
        
        // Sort placement dates chronologically
        placementDates.sort((a, b) => a.date - b.date);
        
        // Initialize monthly data with academic year order (July to June)
        const months = [
            'July', 'August', 'September', 'October', 'November', 'December',
            'January', 'February', 'March', 'April', 'May', 'June'
        ];
        
        // Get current date to determine which months to include
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentAcademicMonthIndex = currentMonth >= 6 
            ? currentMonth - 6  // July-December: 0-5
            : currentMonth + 6; // January-June: 6-11
        
        // Create monthly data array with only months up to current month
        let monthlyData = months.slice(0, currentAcademicMonthIndex + 1).map((month, index) => {
            // Calculate progressive target (more students should be placed as the year progresses)
            // Target by end of year is 80% of total students
            const targetPercentage = (index + 1) / months.length;
            const target = Math.round(totalStudents * 0.8 * targetPercentage);
            
            return {
                month,
                placed: 0,
                target
            };
        });
        
        // Calculate cumulative placements by month
        let cumulativePlaced = 0;
        
        placementDates.forEach(placement => {
            const date = placement.date;
            let monthIndex;
            
            // Determine academic month index
            if (date.getMonth() >= 6) { // July-December
                monthIndex = date.getMonth() - 6;
            } else { // January-June
                monthIndex = date.getMonth() + 6;
            }
            
            // Only count if the month is in our filtered list
            if (monthIndex <= currentAcademicMonthIndex) {
                cumulativePlaced++;
                
                // Update all months from this point forward with cumulative count
                for (let i = monthIndex; i < monthlyData.length; i++) {
                    monthlyData[i].placed = cumulativePlaced;
                }
            }
        });
        
        // Calculate overall placement percentage
        const placementPercentage = totalStudents > 0 
            ? Math.round((placedStudents / totalStudents) * 100) 
            : 0;
        
        console.log(`Overall placement percentage: ${placementPercentage}%`);
        console.log(`Monthly data:`, monthlyData);
        
        res.json({
            overall: {
                total: totalStudents,
                placed: placedStudents,
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
        
        console.log("Company stats endpoint called with filters:", { session, educationLevel, driveType, offerType });
        
        // Build filter queries based on actual schema structure
        const placementQuery = {};
        
        // Apply placement session filter
        if (session && session !== 'all') {
            try {
                // Find the session data by ID
                const placementSessionData = await placementSession.findById(session);
                
                if (!placementSessionData) {
                    console.warn(`Session with ID ${session} not found`);
                } else {
                    console.log(`Found session: ${placementSessionData.name}`);
                    
                    // Add session to placement query
                    placementQuery['placementSession'] = placementSessionData._id;
                }
            } catch (err) {
                console.error(`Error finding session with ID ${session}:`, err);
            }
        }
        
        // Apply education level filter
        if (educationLevel && educationLevel !== 'all') {
            console.log(`Applying education level filter: ${educationLevel}`);
            
            if (educationLevel === 'UG') {
                // For UG, look for placements with btech in eligible branches
                placementQuery['eligibleBranchesForProfiles.branches.btech'] = { $exists: true, $ne: [] };
            } else if (educationLevel === 'PG') {
                // For PG, look for placements with mtech, mba, or mca in eligible branches
                placementQuery['$or'] = [
                    { 'eligibleBranchesForProfiles.branches.mtech': { $exists: true, $ne: [] } },
                    { 'eligibleBranchesForProfiles.branches.mba': { $exists: true, $ne: [] } },
                    { 'eligibleBranchesForProfiles.branches.mca': { $exists: true, $ne: [] } }
                ];
            }
        }
        
        // Create a copy of the base query for each job type filter
        let fteQuery = { ...placementQuery };
        let internQuery = { ...placementQuery };
        let internPpoQuery = { ...placementQuery };
        let fteInternQuery = { ...placementQuery };
        
        // Apply drive type filter
        if (driveType && driveType !== 'all') {
            console.log(`Applying drive type filter: ${driveType}`);
            
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = { $in: ['fte', 'FTE'] };
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { 
                    $in: ['fteIntern', 'internPpo', 'intern', 'Intern', 'internship', 'Internship'] 
                };
            }
        }
        
        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            console.log(`Applying offer type filter: ${offerType}`);
            
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = { $in: ['fte', 'FTE'] };
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = { $in: ['internPpo', 'InternPPO'] };
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'FTEIntern'] };
            }
        }
        
        console.log("Final placement query:", JSON.stringify(placementQuery));
        
        // Get all placement drives that match the filters
        const placements = await Placement.find(placementQuery);
        console.log(`Placements found: ${placements.length}`);
        
        // Extract unique companies from placements
        const companyMap = new Map();
        
        placements.forEach(placement => {
            if (placement.companyDetails && placement.companyDetails.name) {
                const companyName = placement.companyDetails.name;
                
                // If we haven't seen this company yet, add it to the map
                if (!companyMap.has(companyName)) {
                    companyMap.set(companyName, {
                        name: companyName,
                        type: placement.companyDetails.companyType || 'Unknown',
                        domain: placement.companyDetails.domain || 'Unknown',
                        status: placement.driveStatus || 'Unknown',
                        jobTypes: new Set() // Track all job types offered by this company
                    });
                }
                
                // Add this placement's job type to the company's job types
                if (placement.jobProfile && placement.jobProfile.jobType) {
                    companyMap.get(companyName).jobTypes.add(placement.jobProfile.jobType.toLowerCase());
                }
            }
        });
        
        console.log(`Unique companies found: ${companyMap.size}`);
        
        // Filter companies based on job types if needed
        let filteredCompanies = Array.from(companyMap.values());
        
        // Apply additional filtering based on job types if needed
        if (driveType === 'placement' || offerType === 'fte') {
            filteredCompanies = filteredCompanies.filter(company => 
                Array.from(company.jobTypes).some(type => 
                    ['fte'].includes(type.toLowerCase())
                )
            );
        } else if (driveType === 'intern') {
            filteredCompanies = filteredCompanies.filter(company => 
                Array.from(company.jobTypes).some(type => 
                    ['fteintern', 'internppo', 'intern', 'internship'].includes(type.toLowerCase())
                )
            );
        } else if (offerType === 'intern+ppo') {
            filteredCompanies = filteredCompanies.filter(company => 
                Array.from(company.jobTypes).some(type => 
                    ['internppo'].includes(type.toLowerCase())
                )
            );
        } else if (offerType === 'intern+fte') {
            filteredCompanies = filteredCompanies.filter(company => 
                Array.from(company.jobTypes).some(type => 
                    ['fteintern'].includes(type.toLowerCase())
                )
            );
        }
        
        console.log(`Companies after job type filtering: ${filteredCompanies.length}`);
        
        // Calculate total companies
        const total = filteredCompanies.length;
        
        // Group companies by status
        const statusCounts = {
            'ongoing': 0,
            'upcoming': 0,
            'completed': 0,
            'unknown': 0
        };
        
        filteredCompanies.forEach(company => {
            const status = company.status.toLowerCase();
            if (status === 'ongoing' || status === 'inprogress') {
                statusCounts.ongoing++;
            } else if (status === 'upcoming') {
                statusCounts.upcoming++;
            } else if (status === 'completed' || status === 'closed') {
                statusCounts.completed++;
            } else {
                statusCounts.unknown++;
            }
        });
        
        const byStatus = [
            { status: 'Ongoing', count: statusCounts.ongoing },
            { status: 'Upcoming', count: statusCounts.upcoming },
            { status: 'Completed', count: statusCounts.completed }
        ];
        
        if (statusCounts.unknown > 0) {
            byStatus.push({ status: 'Unknown', count: statusCounts.unknown });
        }
        
        // Group companies by type
        const companyTypes = {};
        
        filteredCompanies.forEach(company => {
            const type = company.type || 'Unknown';
            companyTypes[type] = (companyTypes[type] || 0) + 1;
        });
        
        // Sort company types by count (descending)
        const byType = Object.entries(companyTypes)
            .map(([type, count]) => ({
                type: type || 'Unknown',
                count
            }))
            .sort((a, b) => b.count - a.count);
        
        // Group companies by package range
        const packageRanges = {
            '> 20 LPA': 0,
            '15-20 LPA': 0,
            '10-15 LPA': 0,
            '5-10 LPA': 0,
            '< 5 LPA': 0
        };
        
        // For each company, find their highest package
        filteredCompanies.forEach(company => {
            // Find all placements for this company
            const companyPlacements = placements.filter(p => 
                p.companyDetails && p.companyDetails.name === company.name
            );
            
            // Find the highest package offered by this company
            let highestPackage = 0;
            
            companyPlacements.forEach(placement => {
                if (placement.jobProfile && placement.jobProfile.ctc) {
                    let ctc = placement.jobProfile.ctc;
                    
                    // Convert string to number if needed
                    if (typeof ctc === 'string') {
                        ctc = parseFloat(ctc);
                    }
                    
                    if (!isNaN(ctc) && ctc > highestPackage) {
                        highestPackage = ctc;
                    }
                }
            });
            
            // Add to the appropriate package range
            if (highestPackage > 20) {
                packageRanges['> 20 LPA']++;
            } else if (highestPackage >= 15) {
                packageRanges['15-20 LPA']++;
            } else if (highestPackage >= 10) {
                packageRanges['10-15 LPA']++;
            } else if (highestPackage >= 5) {
                packageRanges['5-10 LPA']++;
            } else if (highestPackage > 0) {
                packageRanges['< 5 LPA']++;
            }
        });
        
        // Convert to array and sort by range (descending order of salary)
        const rangeOrder = {
            '> 20 LPA': 0,
            '15-20 LPA': 1,
            '10-15 LPA': 2,
            '5-10 LPA': 3,
            '< 5 LPA': 4
        };
        
        const byPackage = Object.entries(packageRanges)
            .map(([range, count]) => ({
                range,
                count
            }))
            .sort((a, b) => rangeOrder[a.range] - rangeOrder[b.range]);
        
        // Add top companies by package
        const topCompanies = filteredCompanies
            .map(company => {
                // Find all placements for this company
                const companyPlacements = placements.filter(p => 
                    p.companyDetails && p.companyDetails.name === company.name
                );
                
                // Find the highest package offered by this company
                let highestPackage = 0;
                
                companyPlacements.forEach(placement => {
                    if (placement.jobProfile && placement.jobProfile.ctc) {
                        let ctc = placement.jobProfile.ctc;
                        
                        // Convert string to number if needed
                        if (typeof ctc === 'string') {
                            ctc = parseFloat(ctc);
                        }
                        
                        if (!isNaN(ctc) && ctc > highestPackage) {
                            highestPackage = ctc;
                        }
                    }
                });
                
                return {
                    name: company.name,
                    package: highestPackage
                };
            })
            .filter(company => company.package > 0)
            .sort((a, b) => b.package - a.package)
            .slice(0, 5);
        
        console.log("Response data prepared:", {
            totalCompanies: total,
            statusBreakdown: byStatus.length,
            typeBreakdown: byType.length,
            packageBreakdown: byPackage.length,
            topCompanies: topCompanies.length
        });
        
        res.json({
            total,
            byStatus,
            byType,
            byPackage,
            topCompanies
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
        
        console.log("Branch stats endpoint called with filters:", { session, educationLevel, driveType, offerType });
        
        // Build filter queries
        const studentQuery = {};
        const placementQuery = {};
        
        // Apply session filter
        if (session && session !== 'all') {
            try {
                // Find the session data by ID
                const placementSessionData = await placementSession.findById(session);
                
                if (!placementSessionData) {
                    console.warn(`Session with ID ${session} not found`);
                } else {
                    console.log(`Found session: ${placementSessionData.name}`);
                    
                    // Add session to placement query
                    placementQuery['placementSession'] = placementSessionData._id;
                    
                    // Extract batch year from session name (e.g., "2023-24" -> "2024")
                    const sessionYears = placementSessionData.name.split('-');
                    if (sessionYears.length > 1) {
                        const batchYear = parseInt(sessionYears[1]);
                        if (!isNaN(batchYear)) {
                            studentQuery['personalInfo.batch'] = batchYear;
                            console.log(`Filtering students by batch year: ${batchYear}`);
                        }
                    }
                }
            } catch (err) {
                console.error(`Error finding session with ID ${session}:`, err);
            }
        }
        
        // Apply education level filter
        if (educationLevel && educationLevel !== 'all') {
            console.log(`Applying education level filter: ${educationLevel}`);
            
            if (educationLevel === 'UG') {
                studentQuery['personalInfo.course'] = { 
                    $in: ['btech', 'B.Tech', 'BTech'] 
                };
            } else if (educationLevel === 'PG') {
                studentQuery['personalInfo.course'] = { 
                    $in: ['mtech', 'M.Tech', 'MTech', 'mba', 'MBA', 'mca', 'MCA'] 
                };
            }
        }
        
        // Apply drive type filter to placement drives
        if (driveType && driveType !== 'all') {
            console.log(`Applying drive type filter: ${driveType}`);
            
            if (driveType === 'placement') {
                placementQuery['jobProfile.jobType'] = { $in: ['fte', 'FTE'] };
            } else if (driveType === 'intern') {
                placementQuery['jobProfile.jobType'] = { 
                    $in: ['fteIntern', 'internPpo', 'intern', 'Intern', 'internship', 'Internship'] 
                };
            }
        }
        
        // Apply offer type filter
        if (offerType && offerType !== 'all') {
            console.log(`Applying offer type filter: ${offerType}`);
            
            if (offerType === 'fte') {
                placementQuery['jobProfile.jobType'] = { $in: ['fte', 'FTE'] };
            } else if (offerType === 'intern+ppo') {
                placementQuery['jobProfile.jobType'] = { $in: ['internPpo', 'InternPPO'] };
            } else if (offerType === 'intern+fte') {
                placementQuery['jobProfile.jobType'] = { $in: ['fteIntern', 'FTEIntern'] };
            }
        }
        
        console.log("Final queries:");
        console.log("Student query:", JSON.stringify(studentQuery));
        console.log("Placement query:", JSON.stringify(placementQuery));
        
        // Get all students with department grouping
        const students = await Student.find(studentQuery);
        console.log(`Total students found: ${students.length}`);
        
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
                        placed: 0,
                        percentage: 0
                    };
                }
                branchData[department].total++;
            }
        });
        
        console.log(`Branches found: ${Object.keys(branchData).length}`);
        
        // Get all placements that match the filters
        const placements = await Placement.find(placementQuery)
            .populate({
                path: 'roundDetails.rounds.selectedStudents',
                select: '_id personalInfo.department isPlaced'
            });
        
        console.log(`Placements found: ${placements.length}`);
        
        // Create a set to track placed student IDs that match our filters
        const placedStudentIds = new Set();
        
        // Process placements to find placed students
        placements.forEach(placement => {
            if (placement.roundDetails && placement.roundDetails.rounds) {
                // Find completed rounds
                const completedRounds = placement.roundDetails.rounds.filter(
                    round => round.roundStatus === 'completed'
                );
                
                if (completedRounds.length > 0) {
                    // Get the final completed round
                    const finalRound = completedRounds[completedRounds.length - 1];
                    
                    if (finalRound && finalRound.selectedStudents && Array.isArray(finalRound.selectedStudents)) {
                        // Add each selected student ID to the set
                        finalRound.selectedStudents.forEach(student => {
                            if (student && student._id) {
                                placedStudentIds.add(student._id.toString());
                            }
                        });
                    }
                }
            }
        });
        
        console.log(`Unique placed student IDs from placements: ${placedStudentIds.size}`);
        
        // Create a copy of the student query and add isPlaced=true to find placed students
        const placedStudentQuery = { ...studentQuery, isPlaced: true };
        
        // Get all placed students that match our student filters
        const placedStudents = await Student.find(placedStudentQuery);
        console.log(`Placed students from student collection: ${placedStudents.length}`);
        
        // Create a set of placed student IDs that match both our student filters and placement filters
        const filteredPlacedStudentIds = new Set();
        
        // If we have placement filters, use the intersection of placement-based and isPlaced=true students
        if (Object.keys(placementQuery).length > 0) {
            placedStudents.forEach(student => {
                const studentId = student._id.toString();
                if (placedStudentIds.has(studentId)) {
                    filteredPlacedStudentIds.add(studentId);
                }
            });
            console.log(`Students matching both placement and student filters: ${filteredPlacedStudentIds.size}`);
        } else {
            // If no placement filters, just use all placed students
            placedStudents.forEach(student => {
                filteredPlacedStudentIds.add(student._id.toString());
            });
            console.log(`Using all placed students (no placement filters): ${filteredPlacedStudentIds.size}`);
        }
        
        // Reset placed counts
        Object.values(branchData).forEach(branch => {
            branch.placed = 0;
        });
        
        // Count placed students per branch
        placedStudents.forEach(student => {
            const studentId = student._id.toString();
            
            // Only count if the student matches our placement filters (or if we have no placement filters)
            if (Object.keys(placementQuery).length === 0 || placedStudentIds.has(studentId)) {
                if (student.personalInfo?.department) {
                    const department = student.personalInfo.department;
                    if (branchData[department]) {
                        branchData[department].placed++;
                    }
                }
            }
        });
        
        // Calculate placement percentage for each branch
        Object.values(branchData).forEach(branch => {
            if (branch.total > 0) {
                branch.percentage = Math.round((branch.placed / branch.total) * 100);
            }
        });
        
        // Convert to array and sort by branch name
        const branches = Object.values(branchData).sort((a, b) => 
            a.branch.localeCompare(b.branch)
        );
        
        console.log(`Processed branch stats: ${branches.length} branches`);
        
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