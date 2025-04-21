import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import Student from "../schema/student/studentSchema.js";
import PlacementDrive from "../schema/placement/placementSchema.js";
import StudentPlacement from "../schema/placement/studentPlacementSchema.js";
import Company from "../schema/company/companySchema.js";
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

import fs from 'fs';
import path from 'path';
import { addStandardHeaders } from '../utils/excelHelpers.js';
import ReportTemplate from '../schema/report/reportTemplateSchema.js';

const reportRouter = Router();

// Placement reports endpoint
reportRouter.get('/placement', asyncHandler(async (req, res) => {
  try {
    const { year, branch, startDate, endDate } = req.query;
    
    // Build student query
    const studentQuery = {};
    const placementQuery = {};
    
    if (branch && branch !== 'all') {
      studentQuery['personalInfo.department'] = branch;
    }

    // Apply year filter if provided
    if (year) {
      const academicYear = parseInt(year);
      studentQuery['personalInfo.batch'] = academicYear;
    }

    // Apply date range filter
    if (startDate && endDate) {
      placementQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get all students first
    const students = await Student.find(studentQuery)
      .populate({
        path: 'applications',
        populate: {
          path: 'placementDrive',
          select: 'companyDetails jobProfile'
        }
      })
      .select('personalInfo academics applications isPlaced')
      .lean();

    // Get placement drives
    const drives = await PlacementDrive.find(placementQuery)
      .populate('selectedStudents')
      .lean();

    // Calculate statistics
    const totalStudents = students.length;
    const placedStudents = students.filter(student => student.isPlaced).length;
    const placementPercentage = totalStudents > 0 ? 
      Math.round((placedStudents / totalStudents) * 100 * 10) / 10 : 0;

    // Calculate CTC statistics
    let totalCTC = 0;
    let ctcCount = 0;
    let highestCTC = 0;

    drives.forEach(drive => {
      if (drive.jobProfile?.ctc) {
        const ctc = drive.jobProfile.ctc;
        totalCTC += ctc * (drive.selectedStudents?.length || 0);
        ctcCount += drive.selectedStudents?.length || 0;
        
        if (ctc > highestCTC) {
          highestCTC = ctc;
        }
      }
    });

    // Calculate average CTC
    const averageCTC = ctcCount > 0 ? 
      parseFloat((totalCTC / ctcCount).toFixed(2)) : 0;

    // Count unique companies
    const uniqueCompanies = new Set(
      drives.map(drive => drive.companyDetails?.name).filter(Boolean)
    );

    const companiesVisited = uniqueCompanies.size;

    // Generate monthly placement trend
    const monthlyData = [];
    const monthCounts = {};

    // Get all student placements for the selected drives
    const studentPlacements = await StudentPlacement.find({
        placementDrive: { $in: drives.map(d => d._id) },
        status: { $in: ['offer_accepted', 'joined'] }
    }).populate('placementDrive').lean();

    // Process monthly data
    studentPlacements.forEach(placement => {
        if (placement.placementDrive?.createdAt) {
            const date = new Date(placement.placementDrive.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });
            
            if (!monthCounts[month]) {
                monthCounts[month] = 0;
            }
            monthCounts[month]++;
        }
    });

    // Convert to array format for frontend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach(month => {
        monthlyData.push({
            month,
            placements: monthCounts[month] || 0
        });
    });

    // Generate branch-wise placement data
    const branchData = {};
    
    students.forEach(student => {
        const branch = student.personalInfo?.department;
        if (branch) {
            if (!branchData[branch]) {
                branchData[branch] = {
                    branch,
                    total: 0,
                    placed: 0,
                    placementPercentage: 0
                };
            }
            branchData[branch].total++;
            if (student.isPlaced) {
                branchData[branch].placed++;
            }
        }
    });

    // Calculate placement percentages for each branch
    Object.values(branchData).forEach(branch => {
        branch.placementPercentage = branch.total > 0 ? 
            ((branch.placed / branch.total) * 100).toFixed(2) : 0;
    });

    // Return the response
    res.json({
      summary: {
        totalStudents,
        placedStudents,
        placementPercentage,
        averageCTC,
        highestCTC,
        companiesVisited
      },
      monthlyData,
      branchData: Object.values(branchData).sort((a, b) => b.total - a.total),
      // ... rest of your existing response structure
    });

  } catch (error) {
    console.error("Error in placement reports endpoint:", error);
    res.status(500).json({ 
      error: "Failed to fetch placement report data",
      message: error.message 
    });
  }
}));

// Company reports endpoint
reportRouter.get('/company', asyncHandler(async (req, res) => {
    try {
        const { year, industry, status } = req.query;
        
        const driveQuery = {};
        if (industry && industry !== 'all') {
            driveQuery['companyDetails.domain'] = industry;
        }
        if (status && status !== 'all') {
            driveQuery.driveStatus = status;
        }

        const drives = await PlacementDrive.find(driveQuery)
            .select('companyDetails jobProfile selectedStudents driveStatus createdAt')
            .lean();

        const companyStats = {};
        drives.forEach(drive => {
            const companyName = drive.companyDetails.name;
            const domain = drive.companyDetails.domain;
            
            if (!companyStats[companyName]) {
                companyStats[companyName] = {
                    name: companyName,
                    industry: domain,
                    visits: 0,
                    positions: new Set(),
                    studentsHired: 0,
                    totalCTC: 0,
                    ctcCount: 0
                };
            }

            companyStats[companyName].visits++;
            
            if (drive.jobProfile?.designation) {
                companyStats[companyName].positions.add(drive.jobProfile.designation);
            }

            if (drive.selectedStudents?.length) {
                companyStats[companyName].studentsHired += drive.selectedStudents.length;
            }

            if (drive.jobProfile?.ctc) {
                companyStats[companyName].totalCTC += drive.jobProfile.ctc;
                companyStats[companyName].ctcCount++;
            }
        });

        // Modified: Create detailed companies array for the main table
        const companies = Object.values(companyStats).map(company => ({
            name: company.name,
            visits: company.visits,
            // Change this line - return positions as array instead of string
            positions: Array.from(company.positions), // Return as array instead of joining
            studentsHired: company.studentsHired,
            averagePackage: company.ctcCount > 0 ? 
                parseFloat((company.totalCTC / company.ctcCount).toFixed(2)) : 0
        }));

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Replace the industryData reduction
        const industryData = Object.values(companyStats).reduce((acc, company) => {
            if (!acc[company.industry]) {
                acc[company.industry] = { industry: company.industry, count: 0 };
            }
            acc[company.industry].count++;
            return acc;
        }, {});

        // Convert industryData object to array before sending
        res.json({
            summary: {
                totalCompanies: Object.keys(companyStats).length,
                newCompanies: drives.filter(drive => 
                    drive.createdAt && drive.createdAt >= thirtyDaysAgo
                ).length,
                activeCompanies: Object.values(companyStats)
                    .filter(c => c.studentsHired > 0).length,
                topIndustry: Object.values(companyStats)
                    .reduce((acc, curr) => {
                        if (!acc[curr.industry]) acc[curr.industry] = 0;
                        acc[curr.industry]++;
                        return acc;
                    }, {}),
                averagePackage: parseFloat((Object.values(companyStats)
                    .reduce((sum, c) => sum + (c.totalCTC / c.ctcCount || 0), 0) / 
                    Object.keys(companyStats).length).toFixed(2)) || 0
            },
            // Convert to array here
            industryData: Object.values(industryData),
            companies: companies, // Added: Detailed company data for main table
            companyList: companies.map(c => ({
                name: c.name,
                industry: companyStats[c.name].industry,
                offers: c.studentsHired,
                avgCTC: c.averagePackage
            }))
        });

    } catch (error) {
        console.error("Error in company reports:", error);
        res.status(500).json({ 
            error: "Failed to fetch company report data",
            message: error.message 
        });
    }
}));

// Student reports endpoint
reportRouter.get('/student', asyncHandler(async (req, res) => {
  try {
    const { department, batch, category, placementStatus } = req.query;
    console.log("Received filters:", { department, batch, category, placementStatus });

    // Build student query
    const studentQuery = {};
    
    if (department && department !== 'all') {
      studentQuery['personalInfo.department'] = department;
    }
    
    if (batch && batch !== 'all') {
      studentQuery['personalInfo.batch'] = parseInt(batch);
    }
    
    if (category && category !== 'all') {
      studentQuery['personalInfo.category'] = category;
    }

    // Get students with populated placements
    const students = await Student.find(studentQuery)
      .populate({
        path: 'applications',
        populate: {
          path: 'placementDrive',
          select: 'companyDetails status '
        }
      })
      .select('personalInfo academics applications isPlaced')
      .lean();

    console.log(`Found ${students.length} students`);

    // Process students
    const processedStudents = students.map(student => {
      // Use the isPlaced field directly from the student document
      return {
        ...student,
        isPlaced: student.isPlaced || false, // Use the schema field directly
        cgpa: student.academics?.cgpa || 0
      };
    });

    // Calculate statistics using the isPlaced field
    const totalStudents = processedStudents.length;
    const placedStudents = students.filter(student => student.isPlaced).length;
    const unplacedStudents = totalStudents - placedStudents;

    // Calculate CGPA statistics
    let totalCGPA = 0;
    let cgpaCount = 0;
    let highestCGPA = 0;

    processedStudents.forEach(student => {
      if (student.academics?.cgpa) {
        const cgpa = parseFloat(student.academics.cgpa);
        if (!isNaN(cgpa) && cgpa > 0) {
          totalCGPA += cgpa;
          cgpaCount++;
          if (cgpa > highestCGPA) {
            highestCGPA = cgpa;
          }
        }
      }
    });

    const averageCGPA = cgpaCount > 0 ? 
      parseFloat((totalCGPA / cgpaCount).toFixed(2)) : 0;

    // Generate department data using isPlaced field
    const departmentData = processedStudents.reduce((acc, student) => {
      const dept = student.personalInfo?.department;
      if (dept) {
        if (!acc[dept]) {
          acc[dept] = { department: dept, count: 0, placed: 0 };
        }
        acc[dept].count++;
        if (student.isPlaced) { // Use isPlaced field
          acc[dept].placed++;
        }
      }
      return acc;
    }, {});

    // Generate student list with isPlaced field
    const studentList = processedStudents
      .slice(0, 10)
      .map(student => ({
        id: student._id,
        name: student.personalInfo?.name || 'N/A',
        rollNumber: student.personalInfo?.rollNumber || 'N/A',
        department: student.personalInfo?.department || 'N/A',
        batch: student.personalInfo?.batch || 'N/A',
        cgpa: student.academics?.cgpa || 'N/A',
        status: student.isPlaced ? 'Placed' : 'Not Placed', // Use isPlaced field
        placedAt: student.placedAt || 'N/A', // Add placement company if available
        placementDate: student.placementDate || 'N/A' // Add placement date if available
      }));

    const response = {
      summary: {
        totalStudents,
        placedStudents,
        unplacedStudents,
        placementPercentage: totalStudents > 0 ? 
          ((placedStudents / totalStudents) * 100).toFixed(2) : '0',
        highestCGPA: parseFloat(highestCGPA.toFixed(2)),
        averageCGPA
      },
      departmentData: Object.values(departmentData),
      placementData: [
        { status: 'Placed', count: placedStudents },
        { status: 'Not Placed', count: unplacedStudents }
      ],
      studentList
    };

    console.log("Sending response:", response);
    res.json(response);

  } catch (error) {
    console.error("Error in student reports endpoint:", error);
    res.status(500).json({ 
      error: "Failed to fetch student report data",
      message: error.message 
    });
  }
}));

// Placement report download endpoint
const generatePlacementReport = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Placement Report');

  const headers = [
    'Programme',
    'No. of Eligible Students',
    'No. of Placement Offers',
    'No. of Students Placed',
    '% of Students Placed',
    'Range of Package (in lakh)',
    'Median Package (in lakh)',
    'Avg. Package (in lakh)'
  ];

  // Add standard headers
  addStandardHeaders(worksheet, headers);

  // Add data rows
  worksheet.addRows(data);

  return workbook;
};

const styleDataCells = (worksheet) => {
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 4) { // Skip header rows
      row.eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  });
};

reportRouter.get('/placement/download', asyncHandler(async (req, res) => {
  try {
    const { year, branch, startDate, endDate } = req.query;
    
    const departments = [
      'Civil Engineering',
      'Computer Engineering',
      'Information Technology', 
      'Electronics & Communication Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Production & Industrial Engineering'
    ];

    // Get placement data per department
    const placementData = await Promise.all(departments.map(async (dept) => {
      const deptStudents = await Student.find({
        'personalInfo.department': dept
      }).select('isPlaced applications personalInfo').populate({
        path: 'applications',
        populate: {
          path: 'placementDrive',
          select: 'jobProfile companyDetails'
        }
      }).lean();

      const eligibleStudents = deptStudents.length;
      const placedStudents = deptStudents.filter(s => s.isPlaced).length;

      // Get valid offers
      const validOffers = deptStudents
        .flatMap(student => student.applications || [])
        .filter(app => 
          app?.placementDrive?.jobProfile?.ctc > 0 && 
          app.offerDetails?.status === 'accepted'
        );

      // Calculate package statistics
      const packages = validOffers.map(offer => 
        offer.placementDrive.jobProfile.ctc
      );

      const minPackage = packages.length ? Math.min(...packages) : 0;
      const maxPackage = packages.length ? Math.max(...packages) : 0;
      const avgPackage = packages.length ? 
        (packages.reduce((sum, ctc) => sum + ctc, 0) / packages.length) : 0;
      
      const sortedPackages = [...packages].sort((a, b) => a - b);
      const medianPackage = packages.length ? 
        packages.length % 2 === 0 ?
          (sortedPackages[packages.length/2 - 1] + sortedPackages[packages.length/2]) / 2 :
          sortedPackages[Math.floor(packages.length/2)] : 0;

      return {
        'Programme': dept,
        'No. of Eligible Students': eligibleStudents,
        'No. of Placement offers': validOffers.length,
        'Range of Package (in lakh)': `${minPackage.toFixed(2)}-${maxPackage.toFixed(2)}`,
        'Avg. Package (in lakh)': avgPackage.toFixed(2),
        'No. of Students Placed': placedStudents,
        '% of Students Placed': eligibleStudents > 0 ? 
          ((placedStudents / eligibleStudents) * 100).toFixed(2) : '0',
        'Median Package (in lakh)': medianPackage.toFixed(2)
      };
    }));

    // Calculate totals
    const totalRow = {
      'Programme': 'Total',
      'No. of Eligible Students': placementData.reduce((sum, dept) => 
        sum + dept['No. of Eligible Students'], 0),
      'No. of Placement offers': placementData.reduce((sum, dept) => 
        sum + dept['No. of Placement offers'], 0),
      'No. of Students Placed': placementData.reduce((sum, dept) => 
        sum + dept['No. of Students Placed'], 0),
      '% of Students Placed': (
        (placementData.reduce((sum, dept) => sum + dept['No. of Students Placed'], 0) /
        placementData.reduce((sum, dept) => sum + dept['No. of Eligible Students'], 0)) * 100
      ).toFixed(2),
      'Range of Package (in lakh)': `${
        Math.min(...placementData.map(dept => 
          parseFloat(dept['Range of Package (in lakh)'].split('-')[0])
        )).toFixed(2)
      }-${
        Math.max(...placementData.map(dept => 
          parseFloat(dept['Range of Package (in lakh)'].split('-')[1])
        )).toFixed(2)
      }`,
      'Median Package (in lakh)': (
        placementData.reduce((sum, dept) => 
          sum + parseFloat(dept['Median Package (in lakh)']), 0) / 
        placementData.length
      ).toFixed(2),
      'Avg. Package (in lakh)': (
        placementData.reduce((sum, dept) => 
          sum + parseFloat(dept['Avg. Package (in lakh)']), 0) / 
        placementData.length
      ).toFixed(2)
    };

    const reportData = [...placementData, totalRow];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('UG Placement Report');

    // Define the ordered headers
    const orderedHeaders = [
      'Programme',
      'No. of Eligible Students',
      'No. of Placement Offers',
      'No. of Students Placed',
      '% of Students Placed',
      'Range of Package (in lakh)',
      'Median Package (in lakh)',
      'Avg. Package (in lakh)'
    ];

    // Calculate last column letter for merging
    const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + orderedHeaders.length - 1);

    // Add and style title (Row 1)
    worksheet.mergeCells(`A1:${lastColLetter}1`);
    worksheet.getCell('A1').value = 'TRAINING AND PLACEMENT CELL';
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    // Add and style subtitle (Row 2)
    worksheet.mergeCells(`A2:${lastColLetter}2`);
    worksheet.getCell('A2').value = 'NATIONAL INSTITUTE OF TECHNOLOGY KURUKSHETRA';
    worksheet.getCell('A2').font = { bold: true, size: 14 };
    worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

    // Add empty row for spacing (Row 3)
    worksheet.addRow([]);

    // Add headers (Row 4)
    const headerRow = worksheet.addRow(orderedHeaders);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

    // Set column widths
    worksheet.columns = [
      { key: 'Programme', width: 40 },
      { key: 'No. of Eligible Students', width: 20 },
      { key: 'No. of Placement Offers', width: 20 },
      { key: 'No. of Students Placed', width: 20 },
      { key: '% of Students Placed', width: 20 },
      { key: 'Range of Package (in lakh)', width: 25 },
      { key: 'Median Package (in lakh)', width: 20 },
      { key: 'Avg. Package (in lakh)', width: 20 }
    ];

    // Reorder and format data according to headers
    const formattedData = placementData.map(dept => ({
      'Programme': dept['Programme'],
      'No. of Eligible Students': dept['No. of Eligible Students'],
      'No. of Placement Offers': dept['No. of Placement offers'],
      'No. of Students Placed': dept['No. of Students Placed'],
      '% of Students Placed': dept['% of Students Placed'],
      'Range of Package (in lakh)': dept['Range of Package (in lakh)'],
      'Median Package (in lakh)': dept['Median Package (in lakh)'],
      'Avg. Package (in lakh)': dept['Avg. Package (in lakh)']
    }));

    // Add data rows
    worksheet.addRows(formattedData);

    // Add total row
    const summaryRow = {
      'Programme': 'Total',
      'No. of Eligible Students': formattedData.reduce((sum, row) => 
        sum + row['No. of Eligible Students'], 0),
      'No. of Placement Offers': formattedData.reduce((sum, row) => 
        sum + row['No. of Placement Offers'], 0),
      'No. of Students Placed': formattedData.reduce((sum, row) => 
        sum + row['No. of Students Placed'], 0),
      '% of Students Placed': (
        formattedData.reduce((sum, row) => sum + row['No. of Students Placed'], 0) /
        formattedData.reduce((sum, row) => sum + row['No. of Eligible Students'], 0) * 100
      ).toFixed(2),
      'Range of Package (in lakh)': `${
        Math.min(...formattedData.map(row => 
          parseFloat(row['Range of Package (in lakh)'].split('-')[0])
        )).toFixed(2)
      }-${
        Math.max(...formattedData.map(row => 
          parseFloat(row['Range of Package (in lakh)'].split('-')[1])
        )).toFixed(2)
      }`,
      'Median Package (in lakh)': (
        formattedData.reduce((sum, row) => 
          sum + parseFloat(row['Median Package (in lakh)']), 0) / 
        formattedData.length
      ).toFixed(2),
      'Avg. Package (in lakh)': (
        formattedData.reduce((sum, row) => 
          sum + parseFloat(row['Avg. Package (in lakh)']), 0) / 
        formattedData.length
      ).toFixed(2)
    };

    worksheet.addRow(summaryRow);

    // Style all cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip title row
        row.eachCell(cell => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Style total row
    const lastRow = worksheet.lastRow;
    lastRow.font = { bold: true };
    lastRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };

    // Set row heights
    worksheet.getRow(1).height = 30; // Title row
    worksheet.getRow(2).height = 30; // Subtitle row
    worksheet.getRow(4).height = 25; // Header row

    // Set response headers
    res.setHeader(
      'Content-Type', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition', 
      'attachment; filename=UG_Placement_Report_2023_24.xlsx'
    );

    // Write to response
    await workbook.xlsx.write(res);
    return res.end();

  } catch (error) {
    console.error('Error generating placement report:', error);
    res.status(500).json({ 
      error: 'Failed to generate report',
      message: error.message 
    });
  }
}));

// Company report download endpoint
reportRouter.get('/company/download', asyncHandler(async (req, res) => {
  try {
    const { year, industry, status } = req.query;
    
    // Fetch and process company data
    const drives = await PlacementDrive.find()
      .populate('selectedStudents')
      .lean();

    // Process data into companyStats (existing logic)
    const companyStats = {};
    // ... existing drive processing logic ...

    // Format data for Excel
    const formattedData = Object.values(companyStats).map(company => ({
      companyName: company.companyName,
      industry: company.industry,
      visits: company.visits,
      positions: Array.from(company.positions).join(', '),
      studentsHired: company.studentsHired,
      averagePackage: company.studentsHired > 0
        ? (company.totalCTC / company.studentsHired).toFixed(2)
        : '0',
      jobProfiles: Array.from(company.jobProfiles).join(', ')
    }));

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Company Report');

    // Define column structure first
    worksheet.columns = [
      { header: 'Company Name', key: 'companyName', width: 40 },
      { header: 'Industry', key: 'industry', width: 25 },
      { header: 'Visits', key: 'visits', width: 15 },
      { header: 'Positions', key: 'positions', width: 40 },
      { header: 'Students Hired', key: 'studentsHired', width: 20 },
      { header: 'Average Package', key: 'averagePackage', width: 20 },
      { header: 'Job Profiles', key: 'jobProfiles', width: 40 }
    ];

    // Calculate last column letter
    const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + worksheet.columns.length - 1);

    // Row 1: Title
    worksheet.mergeCells(`A1:${lastColLetter}1`);
    worksheet.getCell('A1').value = 'TRAINING AND PLACEMENT CELL';
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 30;

    // Row 2: Institute
    worksheet.mergeCells(`A2:${lastColLetter}2`);
    worksheet.getCell('A2').value = 'NATIONAL INSTITUTE OF TECHNOLOGY KURUKSHETRA';
    worksheet.getCell('A2').font = { bold: true, size: 14 };
    worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(2).height = 30;

    // Row 3: Context
    worksheet.mergeCells(`A3:${lastColLetter}3`);
    worksheet.getCell('A3').value = 'Company Statistics: Academic Session 2023–24';
    worksheet.getCell('A3').font = { bold: true, size: 14 };
    worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(3).height = 30;

    // Row 4: Empty spacer
    worksheet.addRow([]);
    worksheet.getRow(4).height = 15;

    // Row 5: Headers (auto-generated from columns definition)
    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    // Rows 6+: Data
    worksheet.addRows(formattedData);

    // Last Row: Summary
    const summaryRow = {
      companyName: 'Summary',
      industry: `Total Companies: ${formattedData.length}`,
      visits: formattedData.reduce((sum, row) => sum + row.visits, 0),
      positions: `Unique: ${new Set(formattedData.flatMap(row => 
        row.positions.split(', ').filter(Boolean))).size}`,
      studentsHired: formattedData.reduce((sum, row) => sum + row.studentsHired, 0),
      averagePackage: (
        formattedData.reduce((sum, row) => sum + parseFloat(row.averagePackage || 0), 0) /
        formattedData.length
      ).toFixed(2),
      jobProfiles: `Unique: ${new Set(formattedData.flatMap(row => 
        row.jobProfiles.split(', ').filter(Boolean))).size}`
    };
    
    const summaryRowObj = worksheet.addRow(summaryRow);
    summaryRowObj.font = { bold: true };
    summaryRowObj.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };

    // Style all data cells (including summary)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 5) { // Headers and data rows
        row.eachCell(cell => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Company_Report.xlsx'
    );

    await workbook.xlsx.write(res);
    return res.end();

  } catch (error) {
    console.error('Error generating company report:', error);
    res.status(500).json({
      error: 'Failed to generate report',
      message: error.message
    });
  }
}));

// Student report download endpoint
reportRouter.get('/student/download', asyncHandler(async (req, res) => {
  try {
    const { department, batch, category } = req.query;
    
    // Build student query
    const studentQuery = {};
    if (department && department !== 'all') {
      studentQuery['personalInfo.department'] = department;
    }
    if (batch && batch !== 'all') {
      studentQuery['personalInfo.batch'] = parseInt(batch);
    }
    if (category && category !== 'all') {
      studentQuery['personalInfo.category'] = category;
    }

    // Get students with populated data
    const students = await Student.find(studentQuery)
      .populate({
        path: 'applications',
        populate: {
          path: 'placementDrive',
          select: 'companyDetails jobProfile status'
        }
      })
      .select('personalInfo academics applications isPlaced')
      .lean();

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student Report');

    // Define columns with proper widths
    worksheet.columns = [
      { header: 'Roll Number', key: 'rollNumber', width: 15 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Department', key: 'department', width: 40 },
      { header: 'Batch', key: 'batch', width: 10 },
      { header: 'CGPA', key: 'cgpa', width: 10 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Company', key: 'company', width: 40 },
      { header: 'Package (LPA)', key: 'package', width: 15 }
    ];
// Define ordered headers
 const orderedHeaders = [
  'Roll Number',
  'Name',
  'Department',
  'Batch',
  'CGPA',
  'Category',
  'Status',
  
  'Company',
  'Package (LPA)'
];
    // Calculate last c// Define ordered headers
 

    const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + worksheet.columns.length - 1);

    // Add titles
    worksheet.mergeCells(`A1:${lastColLetter}1`);
    worksheet.mergeCells(`A2:${lastColLetter}2`);
    worksheet.mergeCells(`A3:${lastColLetter}3`);

    worksheet.getCell('A1').value = 'TRAINING AND PLACEMENT CELL';
    worksheet.getCell('A2').value = 'NATIONAL INSTITUTE OF TECHNOLOGY KURUKSHETRA';
    worksheet.getCell('A3').value = 'Student Statistics: Academic Session 2023–24';

    ['A1', 'A2', 'A3'].forEach(cell => {
      worksheet.getCell(cell).font = { bold: true, size: 14 };
      worksheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Add spacing row
    worksheet.addRow([]);
   

worksheet.addRow(orderedHeaders)
    // Process student data
    const formattedData = students.map(student => {
      const placedOffer = student.applications?.find(app => 
        app.status === 'offer_accepted' || app.status === 'joined'
      );


      return {
        rollNumber: student.personalInfo?.rollNumber || 'N/A',
        name: student.personalInfo?.name || 'N/A',
        department: student.personalInfo?.department || 'N/A',
        batch: student.personalInfo?.batch || 'N/A',
        cgpa: student.academics?.cgpa?.toFixed(2) || 'N/A',
        category: student.personalInfo?.category || 'N/A',
        status: student.isPlaced ? 'Placed' : 'Not Placed',
        company: placedOffer?.placementDrive?.companyDetails?.name || 'N/A',
        package: placedOffer?.placementDrive?.jobProfile?.ctc?.toFixed(2) || 'N/A'
      };
    });

    // Add data rows
    worksheet.addRows(formattedData);

    // Add summary row
    const summaryRow = {
      rollNumber: 'Summary',
      name: `Total Students: ${formattedData.length}`,
      department: '',
      batch: '',
      cgpa: (formattedData.reduce((sum, student) => 
        sum + (parseFloat(student.cgpa) || 0), 0) / formattedData.length
      ).toFixed(2),
      category: '',
      status: `Placed: ${formattedData.filter(s => s.status === 'Placed').length}`,
      company: '',
      package: (formattedData.reduce((sum, student) => 
        sum + (parseFloat(student.package) || 0), 0) / 
        formattedData.filter(s => s.status === 'Placed').length
      ).toFixed(2)
    };

    worksheet.addRow(summaryRow);

    // Style all cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 4) {
        row.eachCell(cell => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Style summary row
    const lastRow = worksheet.lastRow;
    lastRow.font = { bold: true };
    lastRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };

    // Set row heights
    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 30;
    worksheet.getRow(3).height = 30;
    worksheet.getRow(5).height = 25;

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Student_Report.xlsx'
    );

    // Write to response
    await workbook.xlsx.write(res);
    return res.end();

  } catch (error) {
    console.error('Error generating student report:', error);
    res.status(500).json({
      error: 'Failed to generate report',
      message: error.message
    });
  }
}));

// Report templates endpoints
reportRouter.get('/templates', asyncHandler(async (req, res) => {
  try {
    const templates = await ReportTemplate.find()
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(templates);
  } catch (error) {
    console.error("Error fetching report templates:", error);
    res.status(500).json({ 
      error: "Failed to fetch report templates",
      message: error.message 
    });
  }
}));

reportRouter.post('/templates', asyncHandler(async (req, res) => {
  try {
    const templateData = req.body;

    // Validate required fields
    if (!templateData.name || !templateData.type || !templateData.metrics) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, type, and metrics are required'
      });
    }

    // Create new template
    const template = new ReportTemplate({
      name: templateData.name,
      type: templateData.type,
      metrics: templateData.metrics,
      filters: {
        startDate: templateData.filters?.startDate || null,
        endDate: templateData.filters?.endDate || null,
        departments: templateData.filters?.departments || [],
        categories: templateData.filters?.categories || []
      }
    });

    // Save template
    await template.save();

    res.status(201).json({
      id: template._id,
      ...template.toObject(),
      createdAt: template.createdAt.toISOString()
    });

  } catch (error) {
    console.error("Error saving report template:", error);
    res.status(500).json({ 
      error: "Failed to save report template",
      message: error.message 
    });
  }
}));

reportRouter.delete('/templates/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete template:', id); // Add logging

    const template = await ReportTemplate.findByIdAndDelete(id);
    
    if (!template) {
      return res.status(404).json({
        error: 'Template not found',
        message: 'The requested template does not exist'
      });
    }

    res.json({ 
      success: true, 
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error("Error deleting report template:", error);
    res.status(500).json({ 
      error: "Failed to delete report template",
      message: error.message 
    });
  }
}));

// Custom report generation
import { createObjectCsvStringifier } from 'csv-writer';

reportRouter.post('/generate', asyncHandler(async (req, res) => {
  try {
    const { type, metrics, filters } = req.body;
    
    if (!type || !metrics) {
      throw new Error('Missing required parameters: type and metrics');
    }

    console.log('Generating report:', { type, metrics, filters });

    let reportData = [];
    
    switch (type) {
      case 'placement': {
        const departments = [
          'Civil Engineering',
          'Computer Engineering',
          'Information Technology', 
          'Electronics & Communication Engineering',
          'Electrical Engineering',
          'Mechanical Engineering',
          'Production & Industrial Engineering'
        ];

        // Get placement data per department
        reportData = await Promise.all(departments.map(async (dept) => {
          const deptStudents = await Student.find({
            'personalInfo.department': dept
          }).select('isPlaced applications personalInfo').populate({
            path: 'applications',
            populate: {
              path: 'placementDrive',
              select: 'jobProfile companyDetails'
            }
          }).lean();

          const eligibleStudents = deptStudents.length;
          const placedStudents = deptStudents.filter(s => s.isPlaced).length;

          // Get valid offers
          const validOffers = deptStudents
            .flatMap(student => student.applications || [])
            .filter(app => 
              app?.placementDrive?.jobProfile?.ctc > 0 && 
              app.offerDetails?.status === 'accepted'
            );

          // Calculate package statistics
          const packages = validOffers.map(offer => 
            offer.placementDrive.jobProfile.ctc
          );

          const minPackage = packages.length ? Math.min(...packages) : 0;
          const maxPackage = packages.length ? Math.max(...packages) : 0;
          const avgPackage = packages.length ? 
            (packages.reduce((sum, ctc) => sum + ctc, 0) / packages.length) : 0;
          
          const sortedPackages = [...packages].sort((a, b) => a - b);
          const medianPackage = packages.length ? 
            packages.length % 2 === 0 ?
              (sortedPackages[packages.length/2 - 1] + sortedPackages[packages.length/2]) / 2 :
              sortedPackages[Math.floor(packages.length/2)] : 0;

          // Return data object with requested metrics
          const data = {};
          metrics.forEach(metric => {
            switch(metric) {
              case 'Programme':
                data[metric] = dept;
                break;
              case 'No. of Eligible Students':
                data[metric] = eligibleStudents;
                break;
              case 'No. of Placement Offers':
                data[metric] = validOffers.length;
                break;
              case 'Range of Package (in lakh)':
                data[metric] = `${minPackage.toFixed(2)}-${maxPackage.toFixed(2)}`;
                break;
              case 'Avg. Package (in lakh)':
                data[metric] = avgPackage.toFixed(2);
                break;
              case 'No. of Students Placed':
                data[metric] = placedStudents;
                break;
              case '% of Students Placed':
                data[metric] = eligibleStudents > 0 ? 
                  ((placedStudents / eligibleStudents) * 100).toFixed(2) : '0';
                break;
              case 'Median Package (in lakh)':
                data[metric] = medianPackage.toFixed(2);
                break;
              default:
                data[metric] = 'N/A';
            }
          });
          return data;
        }));

        // Calculate and add total row
        const totalRow = {};
        metrics.forEach(metric => {
          switch(metric) {
            case 'Programme':
              totalRow[metric] = 'Total';
              break;
            case 'No. of Eligible Students':
            case 'No. of Placement Offers':
            case 'No. of Students Placed':
              totalRow[metric] = reportData.reduce((sum, dept) => 
                sum + parseInt(dept[metric]), 0);
              break;
            case '% of Students Placed':
              totalRow[metric] = (
                (reportData.reduce((sum, dept) => sum + parseInt(dept['No. of Students Placed']), 0) /
                reportData.reduce((sum, dept) => sum + parseInt(dept['No. of Eligible Students']), 0) * 100)
              ).toFixed(2);
              break;
            case 'Range of Package (in lakh)':
              totalRow[metric] = `${
                Math.min(...reportData.map(dept => 
                  parseFloat(dept[metric].split('-')[0])
                )).toFixed(2)
              }-${
                Math.max(...reportData.map(dept => 
                  parseFloat(dept[metric].split('-')[1])
                )).toFixed(2)
              }`;
              break;
            case 'Median Package (in lakh)':
            case 'Avg. Package (in lakh)':
              totalRow[metric] = (
                reportData.reduce((sum, dept) => 
                  sum + parseFloat(dept[metric]), 0) / reportData.length
              ).toFixed(2);
              break;
            default:
              totalRow[metric] = 'N/A';
          }
        });
        
        reportData.push(totalRow);
        break;
      }

      case 'student': {
        // Build student query
        const studentQuery = {};
        
        if (filters.department && filters.department !== 'all') {
          studentQuery['personalInfo.department'] = filters.department;
        }
        if (filters.batch && filters.batch !== 'all') {
          studentQuery['personalInfo.batch'] = parseInt(filters.batch);
        }
        if (filters.category && filters.category !== 'all') {
          studentQuery['personalInfo.category'] = filters.category;
        }

        // Get students with populated data
        const students = await Student.find(studentQuery)
          .populate({
            path: 'applications',
            populate: {
              path: 'placementDrive',
              select: 'companyDetails jobProfile status'
            }
          })
          .select('personalInfo academics applications isPlaced')
          .lean();

        // Transform student data according to metrics
        reportData = students.map(student => {
          const data = {};
          metrics.forEach(metric => {
            switch(metric) {
              case 'Name':
                data[metric] = student.personalInfo?.name || 'N/A';
                break;
              case 'Department':
                data[metric] = student.personalInfo?.department || 'N/A';
                break;
              case 'CGPA':
                data[metric] = student.academics?.cgpa || 'N/A';
                break;
              case 'Status':
                data[metric] = student.isPlaced ? 'Placed' : 'Not Placed';
                break;
              case 'Company':
                const placedOffer = student.applications?.find(app => 
                  app.status === 'offer_accepted' || app.status === 'joined'
                );
                data[metric] = placedOffer?.placementDrive?.companyDetails?.name || 'N/A';
                break;
              case 'Package (CTC)':
                const acceptedOffer = student.applications?.find(app => 
                  app.status === 'offer_accepted' || app.status === 'joined'
                );
                data[metric] = acceptedOffer?.placementDrive?.jobProfile?.ctc?.toFixed(2) || 'N/A';
                break;
              case 'Batch':
                data[metric] = student.personalInfo?.batch || 'N/A';
                break;
              case 'Category':
                data[metric] = student.personalInfo?.category || 'N/A';
                break;
              default:
                data[metric] = 'N/A';
            }
          });
          return data;
        });
        break;
      }

      case 'company': {
        // Fetch company data
        const drives = await PlacementDrive.find({
          createdAt: { 
            $gte: new Date(filters.startDate), 
            $lte: new Date(filters.endDate) 
          }
        })
        .populate('selectedStudents')
        .select('companyDetails jobProfile selectedStudents driveStatus createdAt')
        .lean();

        // Process company data
        const companyStats = {};
        
        drives.forEach(drive => {
          const companyName = drive.companyDetails?.name;
          if (!companyName) return;

          if (!companyStats[companyName]) {
            companyStats[companyName] = {
              'Company Name': companyName,
              'Industry': drive.companyDetails?.domain || 'N/A',
              'Visits': 0,
              'Positions': new Set(),
              'Students Hired': 0,
              'Average Package': 0,
              'Total CTC': 0,
              'Job Profiles': new Set()
            };
          }

          companyStats[companyName]['Visits']++;
          if (drive.jobProfile?.designation) {
            companyStats[companyName]['Positions'].add(drive.jobProfile.designation);
            companyStats[companyName]['Job Profiles'].add(drive.jobProfile.designation);
          }
          if (drive.selectedStudents?.length) {
            companyStats[companyName]['Students Hired'] += drive.selectedStudents.length;
            if (drive.jobProfile?.ctc) {
              companyStats[companyName]['Total CTC'] += drive.jobProfile.ctc * drive.selectedStudents.length;
            }
          }
        });

        // Transform data for report
        let formattedData = Object.values(companyStats).map(company => {
          const data = {};
          metrics.forEach(metric => {
            switch(metric) {
              case 'Company Name':
                data[metric] = company['Company Name'];
                break;
              case 'Industry':
                data[metric] = company['Industry'];
                break;
              case 'Visits':
                data[metric] = company['Visits'];
                break;
              case 'Positions':
                data[metric] = Array.from(company['Positions']).join(', ');
                break;
              case 'Students Hired':
                data[metric] = company['Students Hired'];
                break;
              case 'Average Package':
                data[metric] = company['Students Hired'] > 0 ? 
                  (company['Total CTC'] / company['Students Hired']).toFixed(2) : '0';
                break;
              case 'Job Profiles':
                data[metric] = Array.from(company['Job Profiles']).join(', ');
                break;
              default:
                data[metric] = 'N/A';
            }
          });
          return data;
        });

        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Company Report');

        // Add title headers first (Rows 1-3)
        const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + metrics.length - 1);
        
        worksheet.mergeCells(`A1:${lastColLetter}1`);
        worksheet.mergeCells(`A2:${lastColLetter}2`);
        worksheet.mergeCells(`A3:${lastColLetter}3`);

        worksheet.getCell('A1').value = 'TRAINING AND PLACEMENT CELL';
        worksheet.getCell('A2').value = 'NATIONAL INSTITUTE OF TECHNOLOGY KURUKSHETRA';
        worksheet.getCell('A3').value = 'Company Statistics: Academic Session 2023–24';

        ['A1', 'A2', 'A3'].forEach(cell => {
          worksheet.getCell(cell).font = { bold: true, size: 14 };
          worksheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Add spacing row (Row 4)
        worksheet.addRow([]);

        // Add column definitions (Row 5)
        worksheet.columns = metrics.map(header => ({
          header,
          key: header,
          width: 25
        }));

        // Style header row (Row 5)
        const headerRow = worksheet.getRow(5);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

        // Add data rows (starting Row 6)
        worksheet.addRows(formattedData);

        // Add summary row after all data
        const summaryRow = {
          'Company Name': 'Summary',
          'Industry': `Total Companies: ${formattedData.length}`,
          'Visits': formattedData.reduce((sum, row) => sum + (parseInt(row['Visits']) || 0), 0),
          'Positions': `Unique: ${new Set(formattedData.flatMap(row => 
            (row['Positions'] || '').split(', ').filter(Boolean))).size}`,
          'Students Hired': formattedData.reduce((sum, row) => 
            sum + (parseInt(row['Students Hired']) || 0), 0),
          'Average Package': (formattedData.reduce((sum, row) => 
            sum + (parseFloat(row['Average Package']) || 0), 0) / formattedData.length).toFixed(2),
          'Job Profiles': `Unique: ${new Set(formattedData.flatMap(row => 
            (row['Job Profiles'] || '').split(', ').filter(Boolean))).size}`
        };

        // Add summary row and style it
        worksheet.addRow(summaryRow);
        const lastRow = worksheet.lastRow;
        lastRow.font = { bold: true };
        lastRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F0F0' }
        };

        // Style all data cells
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 4) {
            row.eachCell(cell => {
              cell.alignment = { horizontal: 'center', vertical: 'middle' };
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          }
        });

        // Set row heights
        worksheet.getRow(1).height = 30; // Title
        worksheet.getRow(2).height = 30; // Subtitle
        worksheet.getRow(3).height = 30; // Year
        worksheet.getRow(5).height = 30; // Headers

        // Update reportData to include summary row
        reportData = [...formattedData, summaryRow];
        break;
      }

      default:
        throw new Error(`Unsupported report type: ${type}`);
    }

    // Verify we have data before proceeding
    if (!reportData.length) {
      throw new Error('No data found for the specified criteria');
    }

    // Generate Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Get headers and calculate last column for merging
    const headers = metrics; // Use the provided metrics instead of trying to get keys
    const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + headers.length - 1);

    // Add title and institute name
    worksheet.mergeCells(`A1:${lastColLetter}1`);
    worksheet.mergeCells(`A2:${lastColLetter}2`);

    worksheet.getCell('A1').value = 'TRAINING AND PLACEMENT CELL';
    worksheet.getCell('A2').value = 'NATIONAL INSTITUTE OF TECHNOLOGY KURUKSHETRA';

    ['A1', 'A2'].forEach(cell => {
      worksheet.getCell(cell).font = { bold: true, size: 14 };
      worksheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Add empty row for spacing
    worksheet.addRow([]);

    // Add standardized headers based on report type
    const reportTypeMap = {
      placement: 'Placement',
      company: 'Company',
      student: 'Student'
    };

    addStandardHeaders(worksheet, reportTypeMap[type], metrics.length);

    // Add column headers (now starting at row 5)
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    // Set column widths
    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: 25
    }));

    // Add data rows (now starting from row 6)
    worksheet.addRows(reportData);

    // Style all cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 4) { // Skip header rows
        row.eachCell(cell => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Set row heights
    worksheet.getRow(1).height = 30; // Title row
    worksheet.getRow(2).height = 30; // Subtitle row
    worksheet.getRow(4).height = 25; // Header row

    // Set response headers
    res.setHeader(
      'Content-Type', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=${type}_report.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
    return res.end();

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      error: 'Failed to generate report',
      message: error.message
    });
  }
}));

export default reportRouter;