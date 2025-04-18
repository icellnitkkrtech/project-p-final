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
reportRouter.get('/placement/download', asyncHandler(async (req, res) => {
  try {
    // Extract filter parameters
    const { year, branch, startDate, endDate, format } = req.query;
    
    // Build filter queries - same logic as the regular endpoint
    const placementDriveQuery = {};
    const studentQuery = {};
    
    // Apply date range filter if explicitly provided
    if (startDate && endDate) {
      placementDriveQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Get placement drives based on filters
    const placementDrives = await PlacementDrive.find(placementDriveQuery);
    const placementDriveIds = placementDrives.map(drive => drive._id);
    
    // Get student placements for these drives
    const studentPlacementQuery = {
      placementDrive: { $in: placementDriveIds },
      status: { $in: ['offer_accepted', 'joined'] } // Only count accepted offers
    };
    
    // Get student placements
    const studentPlacements = await StudentPlacement.find(studentPlacementQuery)
      .populate({
        path: 'student',
        select: 'personalInfo academics user'
      })
      .populate({
        path: 'company',
        select: 'name website companyType domain'
      })
      .populate({
        path: 'placementDrive',
        select: 'placementDrive_title createdAt'
      });
    
    // Filter by academic year if specified
    let filteredPlacements = studentPlacements;
    if (year) {
      const academicYear = parseInt(year);
      // Academic year typically runs from July to June
      const startYearDate = new Date(`${academicYear}-07-01`);
      const endYearDate = new Date(`${academicYear + 1}-06-30`);
      
      filteredPlacements = studentPlacements.filter(placement => {
        const driveDate = placement.placementDrive?.createdAt || placement.createdAt;
        return driveDate >= startYearDate && driveDate <= endYearDate;
      });
    }
    
    // Apply branch filter to students
    if (branch && branch !== 'all') {
      // Filter placements by branch
      filteredPlacements = filteredPlacements.filter(placement => 
        placement.student?.personalInfo?.department === branch
      );
    }
    
    // Get all students for branch statistics
    if (branch && branch !== 'all') {
      studentQuery['personalInfo.department'] = branch;
    }
    const students = await Student.find(studentQuery);
    
    // Process data for report
    const totalStudents = students.length;
    
    // Count unique students who got placed
    const placedStudentIds = new Set();
    filteredPlacements.forEach(placement => {
      if (placement.student) {
        placedStudentIds.add(placement.student._id.toString());
      }
    });
    
    const placedStudents = placedStudentIds.size;
    const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100 * 10) / 10 : 0;
    
    // Calculate CTC statistics
    let totalCTC = 0;
    let ctcCount = 0;
    let highestCTC = 0;
    
    filteredPlacements.forEach(placement => {
      if (placement.offerDetails && placement.offerDetails.finalPackage) {
        const ctc = placement.offerDetails.finalPackage;
        totalCTC += ctc;
        ctcCount++;
        
        if (ctc > highestCTC) {
          highestCTC = ctc;
        }
      }
    });
    
    const averageCTC = ctcCount > 0 ? parseFloat((totalCTC / ctcCount).toFixed(2)) : 0;
    
    // Count unique companies
    const uniqueCompanies = new Set();
    filteredPlacements.forEach(placement => {
      if (placement.company) {
        uniqueCompanies.add(placement.company._id.toString());
      }
    });
    
    const companiesVisited = uniqueCompanies.size;
    
    // Generate the report in the requested format
    if (format === 'pdf') {
      // Create a PDF document
      const doc = new PDFDocument();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=placement_report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Pipe the PDF to the response
      doc.pipe(res);
      
      // Add content to the PDF
      doc.fontSize(25).text('Placement Report', { align: 'center' });
      doc.moveDown();
      
      // Add filters section
      doc.fontSize(14).text('Filters Applied:', { underline: true });
      doc.fontSize(12).text(`Year: ${year || 'All'}`);
      doc.text(`Branch: ${branch || 'All'}`);
      doc.text(`Date Range: ${startDate || 'Any'} to ${endDate || 'Any'}`);
      doc.moveDown();
      
      // Add summary section
      doc.fontSize(14).text('Summary:', { underline: true });
      doc.fontSize(12).text(`Total Students: ${totalStudents}`);
      doc.text(`Placed Students: ${placedStudents}`);
      doc.text(`Placement Percentage: ${placementPercentage}%`);
      doc.text(`Average CTC: ₹${averageCTC} LPA`);
      doc.text(`Highest CTC: ₹${highestCTC} LPA`);
      doc.text(`Companies Visited: ${companiesVisited}`);
      doc.moveDown();
      
      // Add placement details
      doc.fontSize(14).text('Placement Details:', { underline: true });
      doc.moveDown();
      
      // Create a table-like structure for placement details
      const tableTop = doc.y;
      const tableLeft = 50;
      const colWidth = 100;
      
      // Table headers
      doc.fontSize(10).text('Student Name', tableLeft, tableTop);
      doc.text('Branch', tableLeft + colWidth, tableTop);
      doc.text('Company', tableLeft + colWidth * 2, tableTop);
      doc.text('Package (LPA)', tableLeft + colWidth * 3, tableTop);
      
      doc.moveTo(tableLeft, tableTop + 15)
         .lineTo(tableLeft + colWidth * 4, tableTop + 15)
         .stroke();
      
      let rowTop = tableTop + 20;
      
      // Table rows - limit to first 30 placements to avoid huge PDFs
      const limitedPlacements = filteredPlacements.slice(0, 30);
      
      limitedPlacements.forEach((placement, index) => {
        const studentName = placement.student?.personalInfo?.name || 'N/A';
        const branch = placement.student?.personalInfo?.department || 'N/A';
        const company = placement.company?.name || 'N/A';
        const ctc = placement.offerDetails?.finalPackage || 'N/A';
        
        doc.fontSize(9).text(studentName, tableLeft, rowTop);
        doc.text(branch, tableLeft + colWidth, rowTop);
        doc.text(company, tableLeft + colWidth * 2, rowTop);
        doc.text(ctc, tableLeft + colWidth * 3, rowTop);
        
        rowTop += 15;
        
        // Add a page break if needed
        if (rowTop > 700) {
          doc.addPage();
          rowTop = 50;
          
          // Repeat headers on new page
          doc.fontSize(10).text('Student Name', tableLeft, rowTop);
          doc.text('Branch', tableLeft + colWidth, rowTop);
          doc.text('Company', tableLeft + colWidth * 2, rowTop);
          doc.text('Package (LPA)', tableLeft + colWidth * 3, rowTop);
          
          doc.moveTo(tableLeft, rowTop + 15)
             .lineTo(tableLeft + colWidth * 4, rowTop + 15)
             .stroke();
          
          rowTop += 20;
        }
      });
      
      if (filteredPlacements.length > 30) {
        doc.moveDown();
        doc.fontSize(10).text(`Note: Showing only 30 out of ${filteredPlacements.length} placements.`, { italics: true });
      }
      
      // Finalize the PDF
      doc.end();
    } else if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students');
      
      // Add headers directly (without title and filters)
      const headers = ['Name', 'Roll Number', 'Department', 'CGPA', 'Status'];
      
      // Add header row
      worksheet.addRow(headers);
  
      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
      };
  
      // Process and add student data
      const studentData = students.map(student => ({
          name: student.personalInfo?.name || 'N/A',
          rollNumber: student.personalInfo?.rollNumber || 'N/A',
          department: student.personalInfo?.department || 'N/A',
          cgpa: student.academics?.cgpa || 'N/A',
          status: student.applications?.some(app => 
              app.status === 'offer_accepted' || app.status === 'joined'
          ) ? 'Placed' : 'Not Placed'
      }));
  
      // Add data rows
      worksheet.addRows(studentData);
  
      // Set column widths
      worksheet.columns = [
          { key: 'name', width: 30 },
          { key: 'rollNumber', width: 15 },
          { key: 'department', width: 25 },
          { key: 'cgpa', width: 10 },
          { key: 'status', width: 15 }
      ];
  
      // Apply borders to all cells
      worksheet.eachRow((row) => {
          row.eachCell((cell) => {
              cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
              };
          });
      });
  
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=student_report.xlsx');
  
      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(400).json({ error: 'Invalid format. Supported formats: pdf, excel' });
    }
  } catch (error) {
    console.error("Error generating placement report:", error);
    res.status(500).json({ 
      error: "Failed to generate report",
      message: error.message 
    });
  }
}));

// Company report download endpoint
reportRouter.get('/company/download', asyncHandler(async (req, res) => {
  try {
    // Extract filter parameters
    const { year, industry, status, startDate, endDate, format } = req.query;
    
    // Implement similar logic as placement report download
    // For brevity, I'm not repeating all the data fetching code
    
    // Generate the report in the requested format
    if (format === 'pdf') {
      // Create a PDF document
      const doc = new PDFDocument();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=company_report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Pipe the PDF to the response
      doc.pipe(res);
      
      // Add content to the PDF
      doc.fontSize(25).text('Company Report', { align: 'center' });
      doc.moveDown();
      
      // Add filters section
      doc.fontSize(14).text('Filters Applied:', { underline: true });
      doc.fontSize(12).text(`Year: ${year || 'All'}`);
      doc.text(`Industry: ${industry || 'All'}`);
      doc.text(`Status: ${status || 'All'}`);
      doc.text(`Date Range: ${startDate || 'Any'} to ${endDate || 'Any'}`);
      doc.moveDown();
      
      // Add more content as needed
      
      // Finalize the PDF
      doc.end();
    } else if (format === 'excel') {
      // Create an Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Company Report');
      
      // Add title
      worksheet.mergeCells('A1:E1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'Company Report';
      titleCell.font = {
        size: 16,
        bold: true
      };
      titleCell.alignment = { horizontal: 'center' };
      
      // Add more content as needed
      
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=company_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(400).json({ error: 'Invalid format. Supported formats: pdf, excel' });
    }
  } catch (error) {
    console.error("Error generating company report:", error);
    res.status(500).json({ 
      error: "Failed to generate report",
      message: error.message 
    });
  }
}));

// Student report download endpoint
reportRouter.get('/student/download', asyncHandler(async (req, res) => {
    try {
        const { department, batch, category, placementStatus, format } = req.query;
        
        // Build student query
        const studentQuery = {};
    
        if (department && department !== 'all') {
            studentQuery['personalInfo.department'] = department;
        }
        
        if (batch && batch !== 'all') {
            studentQuery['personalInfo.batch'] = parseInt(batch); // Fixed: Changed from academics.batch to personalInfo.batch
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
                    select: 'companyDetails status'
                }
            })
            .select('personalInfo academics applications')
            .lean();

        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Students');
            
            // Define headers
            const headers = ['Name', 'Roll Number', 'Department', 'CGPA', 'Status'];
            
            // Add header row
            worksheet.addRow(headers);
            
            // Style header row
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });

            // Process and add student data
            const studentRows = students.map(student => [
                student.personalInfo?.name || 'N/A',
                student.personalInfo?.rollNumber || 'N/A',
                student.personalInfo?.department || 'N/A',
                student.academics?.cgpa || 'N/A',
                student.applications?.some(app => 
                    app.status === 'offer_accepted' || app.status === 'joined'
                ) ? 'Placed' : 'Not Placed'
            ]);

            // Add data rows
            worksheet.addRows(studentRows);

            // Set column widths
            worksheet.columns = [
                { width: 30 }, // Name
                { width: 15 }, // Roll Number
                { width: 25 }, // Department
                { width: 10 }, // CGPA
                { width: 15 }  // Status
            ];

            // Apply borders and alignment to all cells
            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
            });

            // Set response headers
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=student_report.xlsx');

            // Write to response
            await workbook.xlsx.write(res);
            res.end();
        } else {
            res.status(400).json({ error: 'Invalid format. Supported format: excel' });
        }
    } catch (error) {
        console.error("Error generating Excel report:", error);
        res.status(500).json({ 
            error: "Failed to generate Excel report",
            message: error.message 
        });
    }
}));

// Report templates endpoints
reportRouter.get('/templates', asyncHandler(async (req, res) => {
  try {
    // Implement fetching saved report templates from database
    // For now, return empty array
    res.json([]);
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
    // Implement saving report template to database
    // For now, return the template with an ID
    const template = req.body;
    res.json({
      id: Date.now().toString(),
      ...template,
      createdAt: new Date().toISOString()
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
    // Implement deleting report template from database
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting report template:", error);
    res.status(500).json({ 
      error: "Failed to delete report template",
      message: error.message 
    });
  }
}));

// Custom report generation
reportRouter.post('/generate', asyncHandler(async (req, res) => {
  try {
    const { type, metrics, filters, format } = req.body;
    
    // Get appropriate report data based on type
    let reportData;
    
    if (type === 'placement') {
      reportData = await getPlacementReportData(filters);
    } else if (type === 'company') {
      // Implement company report data retrieval
      reportData = {};
    } else if (type === 'student') {
      // Implement student report data retrieval
      reportData = {};
    } else {
      return res.status(400).json({ error: 'Invalid report type' });
    }
    
    // Generate report in requested format
    if (format === 'pdf') {
      // Generate PDF
      const doc = new PDFDocument();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=custom_report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Pipe PDF to response
      doc.pipe(res);
      
      // Add content to PDF
      doc.fontSize(20).text('Custom Report', { align: 'center' });
      doc.moveDown();
      
      // Add report content based on metrics
      // This would be customized based on the selected metrics
      
      // Finalize PDF
      doc.end();
    } else if (format === 'excel') {
      // Generate Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Custom Report');
      
      // Add report content based on metrics
      // This would be customized based on the selected metrics
      
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=custom_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(400).json({ error: 'Invalid format. Supported formats: pdf, excel' });
    }
  } catch (error) {
    console.error("Error generating custom report:", error);
    res.status(500).json({ 
      error: "Failed to generate custom report",
      message: error.message 
    });
  }
}));

export default reportRouter;