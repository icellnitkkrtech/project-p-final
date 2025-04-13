import Student from "../schema/student/studentSchema.js";
import Company from "../schema/company/companySchema.js";
import Placement from "../schema/placement/placementSchema.js";

const dashboardService = {
  // Build filter queries based on filters
  buildFilterQueries: (filters) => {
    const { session, educationLevel, driveType, offerType } = filters;
    
    const studentQuery = {};
    const companyQuery = {};
    const placementQuery = {};
    
    // Apply batch filter (equivalent to session)
    if (session && session !== 'all') {
      // Convert session (e.g., "2023-24") to batch year (e.g., 2023)
      const batchYear = parseInt(session.split('-')[0]);
      studentQuery['personalInfo.batch'] = batchYear;
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
    
    return { studentQuery, companyQuery, placementQuery };
  },
  
  // Get analytics data
  getAnalytics: async (filters) => {
    const { studentQuery, companyQuery, placementQuery } = dashboardService.buildFilterQueries(filters);
    
    // Get total students count
    const totalStudents = await Student.countDocuments(studentQuery);
    
    // Get placed students count
    const placedStudentsQuery = { ...studentQuery, isPlaced: true };
    const placedStudents = await Student.countDocuments(placedStudentsQuery);
    
    // Get total companies count
    const totalCompanies = await Company.countDocuments(companyQuery);
    
    // Get total placements count
    const totalPlacements = await Placement.countDocuments(placementQuery);
    
    // Calculate placement percentage
    const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
    
    // Get average CTC
    const placements = await Placement.find(placementQuery);
    let totalCTC = 0;
    let ctcCount = 0;
    
    placements.forEach(placement => {
      if (placement.jobProfile && placement.jobProfile.ctc) {
        totalCTC += placement.jobProfile.ctc;
        ctcCount++;
      }
    });
    
    const averageCTC = ctcCount > 0 ? (totalCTC / ctcCount).toFixed(2) : 0;
    
    return {
      totalStudents,
      placedStudents,
      totalCompanies,
      totalPlacements,
      placementPercentage,
      averageCTC
    };
  },
  
  // Get placement progress data
  getPlacementProgress: async (filters) => {
    const { studentQuery, placementQuery } = dashboardService.buildFilterQueries(filters);
    
    // Get all placements
    const placements = await Placement.find(placementQuery).sort({ createdAt: 1 });
    
    // Process placements to get monthly data
    const monthlyData = {};
    const cumulativeData = [];
    let cumulativeCount = 0;
    
    placements.forEach(placement => {
      if (placement.createdAt) {
        const date = new Date(placement.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        
        if (!monthlyData[key]) {
          monthlyData[key] = 0;
        }
        
        // Count students placed in this drive
        if (placement.roundDetails && placement.roundDetails.rounds) {
          const finalRound = placement.roundDetails.rounds[placement.roundDetails.rounds.length - 1];
          if (finalRound && finalRound.selectedStudents) {
            monthlyData[key] += finalRound.selectedStudents.length;
          }
        }
      }
    });
    
    // Convert to array and sort by date
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });
    
    // Build cumulative data
    sortedMonths.forEach(month => {
      cumulativeCount += monthlyData[month];
      cumulativeData.push({
        month,
        placements: monthlyData[month],
        cumulative: cumulativeCount
      });
    });
    
    return cumulativeData;
  },
  
  // Get branch-wise stats
  getBranchStats: async (filters) => {
    const { studentQuery, placementQuery } = dashboardService.buildFilterQueries(filters);
    
    // Get all students
    const students = await Student.find(studentQuery);
    
    // Process students to get branch-wise data
    const branchData = {};
    
    students.forEach(student => {
      if (student.personalInfo && student.personalInfo.department) {
        const branch = student.personalInfo.department;
        
        if (!branchData[branch]) {
          branchData[branch] = {
            branch,
            total: 0,
            placed: 0
          };
        }
        
        branchData[branch].total++;
        
        if (student.isPlaced) {
          branchData[branch].placed++;
        }
      }
    });
    
    // Convert to array
    const branches = Object.values(branchData);
    
    return { branches };
  },
  
  // Get company stats
  getCompanyStats: async (filters) => {
    const { companyQuery, placementQuery } = dashboardService.buildFilterQueries(filters);
    
    // Get all companies
    const companies = await Company.find(companyQuery);
    
    // Get all placement drives that match the filters
    const placements = await Placement.find(placementQuery);
    
    // Calculate total companies
    const total = companies.length;
    
    // Calculate companies by status
    const byStatus = [
      { name: 'Active', value: companies.filter(company => company.status === 'active').length },
      { name: 'Inactive', value: companies.filter(company => company.status === 'inactive').length },
      { name: 'Blacklisted', value: companies.filter(company => company.status === 'blacklisted').length }
    ];
    
    // Calculate companies by type
    const byType = [
      { name: 'Product', value: companies.filter(company => company.type === 'product').length },
      { name: 'Service', value: companies.filter(company => company.type === 'service').length },
      { name: 'Startup', value: companies.filter(company => company.type === 'startup').length },
      { name: 'Others', value: companies.filter(company => !['product', 'service', 'startup'].includes(company.type)).length }
    ];
    
    // Calculate companies by package range
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
    
    return {
      total,
      byStatus,
      byType,
      byPackage
    };
  },
  
  // Get CTC analysis
  getCTCAnalysis: async (filters) => {
    const { placementQuery } = dashboardService.buildFilterQueries(filters);
    
    // Get all placement drives that match the filters
    const placements = await Placement.find(placementQuery);
    
    // Define CTC ranges
    const ctcRanges = [
      { range: '0-5 LPA', count: 0 },
      { range: '5-10 LPA', count: 0 },
      { range: '10-15 LPA', count: 0 },
      { range: '15-20 LPA', count: 0 },
      { range: '20+ LPA', count: 0 }
    ];
    
    // Branch-wise CTC data
    const branchCTC = {};
    
    // Process placements
    for (const placement of placements) {
      if (placement.jobProfile && placement.jobProfile.ctc) {
        const ctc = placement.jobProfile.ctc;
        
        // Process by CTC range
        for (const range of ctcRanges) {
          if (
            (range.range === '0-5 LPA' && ctc < 5) ||
            (range.range === '5-10 LPA' && ctc >= 5 && ctc < 10) ||
            (range.range === '10-15 LPA' && ctc >= 10 && ctc < 15) ||
            (range.range === '15-20 LPA' && ctc >= 15 && ctc < 20) ||
            (range.range === '20+ LPA' && ctc >= 20)
          ) {
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
    
    return {
      distribution: ctcRanges,
      branchWise: Object.values(branchCTC)
    };
  },
  
  // Get top companies
  getTopCompanies: async (filters) => {
    const { placementQuery } = dashboardService.buildFilterQueries(filters);
    
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
    
    return {
      topPaying,
      topHiring,
      leastPaying
    };
  },
  
  // Get job profiles
  getJobProfiles: async (filters) => {
    const { placementQuery } = dashboardService.buildFilterQueries(filters);
    
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
    
    return {
      sectors,
      profiles
    };
  },
  
  // Get career preferences
  getCareerPreferences: async (filters) => {
    const { studentQuery } = dashboardService.buildFilterQueries(filters);
    
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
    
    return {
      careerPreferences,
      branchWisePreferences
    };
  }
};

export default dashboardService; 