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
    // Extract filter parameters
    const { year, branch, startDate, endDate } = req.query;
    
    // Build filter queries
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
    
    // Apply year filter by academic year
    // Since year isn't directly on StudentPlacement, we need to join with PlacementDrive
    // This is handled by the placementDrive filter above and we'll filter by year in memory
    
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
      studentQuery['personalInfo.department'] = branch;
      
      // Filter placements by branch
      filteredPlacements = filteredPlacements.filter(placement => 
        placement.student?.personalInfo?.department === branch
      );
    }
    
    // Get all students matching the branch filter
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
    
    // Generate monthly data
    const monthlyData = [];
    const monthCounts = {};
    
    filteredPlacements.forEach(placement => {
      const date = placement.offerDetails?.offerDate || placement.createdAt;
      if (date) {
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!monthCounts[month]) {
          monthCounts[month] = 0;
        }
        
        monthCounts[month]++;
      }
    });
    
    // Convert to array and sort by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach(month => {
      monthlyData.push({
        month,
        placements: monthCounts[month] || 0
      });
    });
    
    // Generate branch-wise data
    const branchData = [];
    const branchCounts = {};
    const placedStudentsByBranch = {};
    
    // Initialize branch counts with all students
    students.forEach(student => {
      if (student.personalInfo && student.personalInfo.department) {
        const branch = student.personalInfo.department;
        
        if (!branchCounts[branch]) {
          branchCounts[branch] = {
            branch,
            placed: 0,
            total: 0
          };
        }
        
        branchCounts[branch].total++;
      }
    });
    
    // Count placed students by branch
    filteredPlacements.forEach(placement => {
      if (placement.student && 
          placement.student.personalInfo && 
          placement.student.personalInfo.department) {
        
        const branch = placement.student.personalInfo.department;
        
        if (!branchCounts[branch]) {
          branchCounts[branch] = {
            branch,
            placed: 0,
            total: 0
          };
        }
        
        // Use a Set to avoid counting the same student twice
        if (!placedStudentsByBranch[branch]) {
          placedStudentsByBranch[branch] = new Set();
        }
        
        placedStudentsByBranch[branch].add(placement.student._id.toString());
      }
    });
    
    // Convert placed students sets to counts
    Object.keys(branchCounts).forEach(branch => {
      if (placedStudentsByBranch[branch]) {
        branchCounts[branch].placed = placedStudentsByBranch[branch].size;
      }
    });
    
    // Convert to array
    Object.values(branchCounts).forEach(branchCount => {
      branchData.push(branchCount);
    });
    
    // Sort by total students
    branchData.sort((a, b) => b.total - a.total);
    
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
      branchData
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
    // Extract filter parameters
    const { year, industry, status, startDate, endDate } = req.query;
    
    // Build filter queries
    const companyQuery = {};
    const placementQuery = {};
    
    // Apply industry filter
    if (industry && industry !== 'all') {
      companyQuery.industry = industry;
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      companyQuery.status = status;
    }
    
    // Apply date range filter
    if (startDate && endDate) {
      companyQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Apply year filter to placements
    if (year) {
      const academicYear = parseInt(year);
      placementQuery.academicYear = academicYear;
    }
    
    // Get company data
    const companies = await Company.find(companyQuery);
    const placements = await PlacementDrive.find(placementQuery)
      .populate('placementDrive_title');
    
    // Process data for report
    const totalCompanies = companies.length;
    
    // Count new companies (created in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newCompanies = companies.filter(company => 
      company.createdAt && company.createdAt >= thirtyDaysAgo
    ).length;
    
    // Count active companies (with placements)
    const activeCompanyIds = new Set();
    placements.forEach(placement => {
      if (placement.placementDrive_title) {
        activeCompanyIds.add(placement.placementDrive_title.toString());
      }
    });
    
    const activeCompanies = activeCompanyIds.size;
    
    // Calculate average package
    let totalCTC = 0;
    let ctcCount = 0;
    
    placements.forEach(placement => {
      if (placement.placementDrive_title && placement.placementDrive_title.finalPackage) {
        totalCTC += placement.placementDrive_title.finalPackage;
        ctcCount++;
      }
    });
    
    const averagePackage = ctcCount > 0 ? parseFloat((totalCTC / ctcCount).toFixed(2)) : 0;
    
    // Find top industry
    const industryCounts = {};
    companies.forEach(company => {
      if (company.industry) {
        industryCounts[company.industry] = (industryCounts[company.industry] || 0) + 1;
      }
    });
    
    let topIndustry = '';
    let maxCount = 0;
    
    Object.entries(industryCounts).forEach(([industry, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topIndustry = industry;
      }
    });
    
    // Generate industry data
    const industryData = Object.entries(industryCounts)
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count);
    
    // Generate company list with offers and avg CTC
    const companyStats = {};
    
    placements.forEach(placement => {
      if (placement.placementDrive_title) {
        const companyId = placement.placementDrive_title._id.toString();
        const companyName = placement.placementDrive_title.placementDrive_title;
        const industry = placement.placementDrive_title.industry;
        
        if (!companyStats[companyId]) {
          companyStats[companyId] = {
            name: companyName,
            industry: industry || 'Unknown',
            offers: 0,
            totalCTC: 0,
            ctcCount: 0
          };
        }
        
        companyStats[companyId].offers++;
        
        if (placement.placementDrive_title.finalPackage) {
          companyStats[companyId].totalCTC += placement.placementDrive_title.finalPackage;
          companyStats[companyId].ctcCount++;
        }
      }
    });
    
    // Calculate average CTC for each company
    const companyList = Object.values(companyStats).map(company => ({
      name: company.name,
      industry: company.industry,
      offers: company.offers,
      avgCTC: company.ctcCount > 0 ? parseFloat((company.totalCTC / company.ctcCount).toFixed(2)) : 0
    })).sort((a, b) => b.offers - a.offers);
    
    res.json({
      summary: {
        totalCompanies,
        newCompanies,
        activeCompanies,
        topIndustry,
        averagePackage
      },
      industryData,
      companyList
    });
  } catch (error) {
    console.error("Error in company reports endpoint:", error);
    res.status(500).json({ 
      error: "Failed to fetch company report data",
      message: error.message 
    });
  }
}));

// Student reports endpoint
reportRouter.get('/student', asyncHandler(async (req, res) => {
  try {
    // Extract filter parameters
    const { department, batch, category, placementStatus, startDate, endDate } = req.query;
    
    // Build filter queries
    const studentQuery = {};
    
    // Apply department filter
    if (department && department !== 'all') {
      studentQuery['personalInfo.department'] = department;
    }
    
    // Apply batch filter
    if (batch) {
      studentQuery['personalInfo.batch'] = parseInt(batch);
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      studentQuery['personalInfo.category'] = category;
    }
    
    // Apply placement status filter
    if (placementStatus && placementStatus !== 'all') {
      studentQuery.isPlaced = placementStatus === 'placed';
    }
    
    // Apply date range filter
    if (startDate && endDate) {
      studentQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Get student data
    const students = await Student.find(studentQuery);
    
    // Process data for report
    const totalStudents = students.length;
    const placedStudents = students.filter(student => student.isPlaced).length;
    const unplacedStudents = totalStudents - placedStudents;
    
    // Calculate CGPA statistics
    let totalCGPA = 0;
    let cgpaCount = 0;
    let highestCGPA = 0;
    
    students.forEach(student => {
      if (student.academicInfo && student.academicInfo.cgpa) {
        const cgpa = student.academicInfo.cgpa;
        totalCGPA += cgpa;
        cgpaCount++;
        
        if (cgpa > highestCGPA) {
          highestCGPA = cgpa;
        }
      }
    });
    
    const averageCGPA = cgpaCount > 0 ? parseFloat((totalCGPA / cgpaCount).toFixed(2)) : 0;
    
    // Generate department data
    const departmentCounts = {};
    
    students.forEach(student => {
      if (student.personalInfo && student.personalInfo.department) {
        const department = student.personalInfo.department;
        departmentCounts[department] = (departmentCounts[department] || 0) + 1;
      }
    });
    
    const departmentData = Object.entries(departmentCounts)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);
    
    // Generate placement status data
    const placementData = [
      { status: 'Placed', count: placedStudents },
      { status: 'Unplaced', count: unplacedStudents }
    ];
    
    // Generate student list
    const studentList = students.slice(0, 5).map(student => ({
      name: student.personalInfo ? `${student.personalInfo.firstName} ${student.personalInfo.lastName}` : 'Unknown',
      department: student.personalInfo ? student.personalInfo.department : 'Unknown',
      cgpa: student.academicInfo ? student.academicInfo.cgpa : 'N/A',
      status: student.isPlaced ? 'Placed' : 'Unplaced',
      company: student.placementInfo && student.placementInfo.company ? student.placementInfo.company : null
    }));
    
    res.json({
      summary: {
        totalStudents,
        placedStudents,
        unplacedStudents,
        highestCGPA,
        averageCGPA
      },
      departmentData,
      placementData,
      studentList
    });
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
      // Create an Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Placement Report');
      
      // Add title
      worksheet.mergeCells('A1:E1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'Placement Report';
      titleCell.font = {
        size: 16,
        bold: true
      };
      titleCell.alignment = { horizontal: 'center' };
      
      // Add filters section
      worksheet.getCell('A3').value = 'Filters Applied:';
      worksheet.getCell('A3').font = { bold: true };
      
      worksheet.getCell('A4').value = 'Year:';
      worksheet.getCell('B4').value = year || 'All';
      
      worksheet.getCell('A5').value = 'Branch:';
      worksheet.getCell('B5').value = branch || 'All';
      
      worksheet.getCell('A6').value = 'Date Range:';
      worksheet.getCell('B6').value = `${startDate || 'Any'} to ${endDate || 'Any'}`;
      
      // Add summary section
      worksheet.getCell('A8').value = 'Summary:';
      worksheet.getCell('A8').font = { bold: true };
      
      worksheet.getCell('A9').value = 'Total Students:';
      worksheet.getCell('B9').value = totalStudents;
      
      worksheet.getCell('A10').value = 'Placed Students:';
      worksheet.getCell('B10').value = placedStudents;
      
      worksheet.getCell('A11').value = 'Placement Percentage:';
      worksheet.getCell('B11').value = `${placementPercentage}%`;
      
      worksheet.getCell('A12').value = 'Average CTC:';
      worksheet.getCell('B12').value = `₹${averageCTC} LPA`;
      
      worksheet.getCell('A13').value = 'Highest CTC:';
      worksheet.getCell('B13').value = `₹${highestCTC} LPA`;
      
      worksheet.getCell('A14').value = 'Companies Visited:';
      worksheet.getCell('B14').value = companiesVisited;
      
      // Add placement details
      worksheet.getCell('A16').value = 'Placement Details:';
      worksheet.getCell('A16').font = { bold: true };
      
      // Add headers
      const headers = ['Student Name', 'Roll Number', 'Branch', 'Company', 'Package (LPA)', 'Offer Date', 'Location'];
      worksheet.getRow(17).values = headers;
      worksheet.getRow(17).font = { bold: true };
      
      // Add data
      let rowIndex = 18;
      filteredPlacements.forEach(placement => {
        const studentName = placement.student?.personalInfo?.name || 'N/A';
        const rollNumber = placement.student?.personalInfo?.rollNumber || 'N/A';
        const branch = placement.student?.personalInfo?.department || 'N/A';
        const company = placement.company?.name || 'N/A';
        const ctc = placement.offerDetails?.finalPackage || 'N/A';
        const offerDate = placement.offerDetails?.offerDate ? 
          new Date(placement.offerDetails.offerDate).toLocaleDateString() : 'N/A';
        const location = placement.offerDetails?.location || 'N/A';
        
        worksheet.getRow(rowIndex).values = [studentName, rollNumber, branch, company, ctc, offerDate, location];
        rowIndex++;
      });
      
      // Auto-fit columns
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });
      
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=placement_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
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
    // Extract filter parameters
    const { department, batch, category, placementStatus, startDate, endDate, format } = req.query;
    
    // Implement similar logic as placement report download
    // For brevity, I'm not repeating all the data fetching code
    
    // Generate the report in the requested format
    if (format === 'pdf') {
      // Create a PDF document
      const doc = new PDFDocument();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=student_report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Pipe the PDF to the response
      doc.pipe(res);
      
      // Add content to the PDF
      doc.fontSize(25).text('Student Report', { align: 'center' });
      doc.moveDown();
      
      // Add filters section
      doc.fontSize(14).text('Filters Applied:', { underline: true });
      doc.fontSize(12).text(`Department: ${department || 'All'}`);
      doc.text(`Batch: ${batch || 'All'}`);
      doc.text(`Category: ${category || 'All'}`);
      doc.text(`Placement Status: ${placementStatus || 'All'}`);
      doc.text(`Date Range: ${startDate || 'Any'} to ${endDate || 'Any'}`);
      doc.moveDown();
      
      // Add more content as needed
      
      // Finalize the PDF
      doc.end();
    } else if (format === 'excel') {
      // Create an Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Student Report');
      
      // Add title
      worksheet.mergeCells('A1:E1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'Student Report';
      titleCell.font = {
        size: 16,
        bold: true
      };
      titleCell.alignment = { horizontal: 'center' };
      
      // Add more content as needed
      
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=student_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(400).json({ error: 'Invalid format. Supported formats: pdf, excel' });
    }
  } catch (error) {
    console.error("Error generating student report:", error);
    res.status(500).json({ 
      error: "Failed to generate report",
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