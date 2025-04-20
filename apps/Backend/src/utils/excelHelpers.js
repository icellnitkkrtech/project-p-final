import ExcelJS from 'exceljs';

/**
 * Adds standardized headers to the worksheet
 * @param {ExcelJS.Worksheet} worksheet - The worksheet to add headers to
 * @param {string} reportType - The type of report (Placement/Company/Student)
 * @param {number} totalColumns - Total number of columns in the report
 */
export const addStandardHeaders = (worksheet, reportType, totalColumns) => {
  // Calculate last column letter for merging
  const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + totalColumns - 1);

  // Define header texts
  const headerRows = [
    'TRAINING AND PLACEMENT CELL',
    'NATIONAL INSTITUTE OF TECHNOLOGY KURUKSHETRA',
    `${reportType} Statistics: Academic Session 2023–24`
  ];

  // Clear any existing merged cells in the header area
  worksheet.unMergeCells(`A1:${lastColLetter}3`);

  // Add headers row by row
  headerRows.forEach((text, index) => {
    const rowNum = index + 1;
    
    // First add the text to the first cell
    const firstCell = worksheet.getCell(`A${rowNum}`);
    firstCell.value = text;
    
    // Then merge the cells
    worksheet.mergeCells(`A${rowNum}:${lastColLetter}${rowNum}`);
    
    // Style the merged cell
    const mergedCell = worksheet.getCell(`A${rowNum}`);
    mergedCell.font = { bold: true, size: 14 };
    mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Set row height
    worksheet.getRow(rowNum).height = 30;
  });

  // Add spacing row
  worksheet.addRow([]);
  worksheet.getRow(4).height = 15; // Set spacing row height
};