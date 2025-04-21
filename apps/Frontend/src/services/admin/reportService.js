import axios from '../../config/axios';
import { API_BASE_URL } from '../../config/constants';
import { saveAs } from 'file-saver';

// Mock data for testing until backend integration
const mockPlacementData = {
  overview: {
    totalStudents: 500,
    placedStudents: 450,
    averagePackage: "12.5 LPA",
    highestPackage: "45 LPA",
    placementPercentage: "90%"
  },
  branchWise: [
    { branch: "Computer Science", placed: 150, total: 160, percentage: "93.75%" },
    { branch: "Information Technology", placed: 140, total: 150, percentage: "93.33%" },
    { branch: "Electronics", placed: 120, total: 140, percentage: "85.71%" },
    { branch: "Mechanical", placed: 40, total: 50, percentage: "80%" }
  ],
  monthWise: [
    { month: "July 2023", placements: 50 },
    { month: "August 2023", placements: 100 },
    { month: "September 2023", placements: 150 },
    { month: "October 2023", placements: 100 },
    { month: "November 2023", placements: 50 }
  ],
  packageRanges: [
    { range: "3-5 LPA", count: 100 },
    { range: "5-10 LPA", count: 200 },
    { range: "10-15 LPA", count: 100 },
    { range: "15+ LPA", count: 50 }
  ]
};

const mockCompanyData = {
  companies: [
    { 
      name: "Google",
      visits: 2,
      positions: ["SDE", "Product Manager"],
      studentsHired: 15,
      averagePackage: "25 LPA"
    },
    // Add more company data
  ],
  industryWise: [
    { industry: "Technology", count: 25 },
    { industry: "Finance", count: 15 },
    { industry: "Consulting", count: 10 }
  ]
};

const mockStudentData = {
  departmentWise: [
    { department: "CSE", total: 160, placed: 150 },
    { department: "IT", total: 150, placed: 140 }
  ],
  categoryWise: [
    { category: "General", total: 200, placed: 180 },
    { category: "OBC", total: 150, placed: 140 }
  ]
};

// Mock templates data
const mockTemplates = [
  {
    id: 1,
    name: 'Monthly Placement Summary',
    type: 'placement',
    metrics: ['Total Students', 'Placed Students'],
    filters: { period: 'monthly' }
  },
  {
    id: 2,
    name: 'Company Visits Report',
    type: 'company',
    metrics: ['Total Visits', 'Students Hired'],
    filters: { period: 'yearly' }
  }
];

// Local storage key for templates
const TEMPLATES_STORAGE_KEY = 'report_templates';

export const reportService = {
  // Get all reports with filters
  getReports: async (filters, pagination) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`, {
        params: {
          ...filters,
          page: pagination.page,
          limit: pagination.rowsPerPage,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Return mock data for now
      return {
        placement: mockPlacementData,
        company: mockCompanyData,
        student: mockStudentData
      };
    }
  },

  // Generate a new report
  generateReport: async (reportConfig) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reports/generate`, reportConfig);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      // Mock response
      return {
        id: Date.now(),
        status: 'generated',
        ...reportConfig
      };
    }
  },

  // Schedule a report
  scheduleReport: async (scheduleConfig) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reports/schedule`, scheduleConfig);
      return response.data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      return {
        id: Date.now(),
        status: 'scheduled',
        ...scheduleConfig
      };
    }
  },

  // Download a report
  downloadReport: async (id, format = 'pdf') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/${id}/download`, {
        params: { format },
        responseType: 'blob',
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      console.error('Error downloading report:', error);
      // Mock download for testing
      console.log(`Downloading report ${id} in ${format} format`);
    }
  },

  async downloadReport(type, filters, format) {
    try {
        console.log(`Downloading ${type} report in ${format} format`);
        
        // Only include necessary parameters
        const params = new URLSearchParams({
            department: filters.department || 'all',
            batch: filters.batch || 'all',
            category: filters.category || 'all',
            placementStatus: filters.placementStatus || 'all',
            format: format
        });

        // Define content types for different formats
        const contentTypes = {
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel',
            'pdf': 'application/pdf'
        };

        // Fix the URL to match the working backend route
        const response = await axios.get(
            `${API_BASE_URL}/reports/${type}/download?${params}`,
            {
                responseType: 'blob',
                headers: {
                    'Accept': contentTypes[format] || contentTypes['excel']
                }
            }
        );

        // Create and handle download
        const blob = new Blob([response.data], {
            type: contentTypes[format] || contentTypes['excel']
        });
        
        // Define file extensions
        const fileExtensions = {
            'excel': 'xlsx',
            'xls': 'xls',
            'pdf': 'pdf'
        };

        // Use file-saver for reliable download
        const fileName = `${type}_report.${fileExtensions[format] || 'xlsx'}`;
        saveAs(blob, fileName);

        return true;
    } catch (error) {
        console.error('Error downloading report:', error);
        throw error;
    }
},

  // Delete a report
  deleteReport: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      return { success: true, message: 'Report deleted successfully' };
    }
  },

  // Get available report types
  getReportTypes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report types:', error);
      return [
        { id: 'placement', name: 'Placement Report' },
        { id: 'company', name: 'Company Report' },
        { id: 'student', name: 'Student Report' },
        { id: 'custom', name: 'Custom Report' }
      ];
    }
  },

  // Preview a report
  previewReport: async (reportConfig) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reports/preview`, reportConfig);
      return response.data;
    } catch (error) {
      console.error('Error previewing report:', error);
      // Return mock data based on report type
      switch (reportConfig.type) {
        case 'placement':
          return mockPlacementData;
        case 'company':
          return mockCompanyData;
        case 'student':
          return mockStudentData;
        default:
          return {};
      }
    }
  },

  // Get scheduled reports
  getScheduledReports: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/scheduled`);
      return response.data;
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      return [
        {
          id: 1,
          name: 'Monthly Placement Report',
          schedule: 'monthly',
          nextRun: '2024-04-01',
          type: 'placement'
        }
      ];
    }
  },

  // Cancel a scheduled report
  cancelScheduledReport: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/reports/scheduled/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling scheduled report:', error);
      return { success: true, message: 'Scheduled report canceled successfully' };
    }
  },

  // Get filtered reports based on type and filters
  getFilteredReports: async (type, filters) => {
    try {
      const response = await axios.get(`/reports/${type}`, {
        params: {
          ...filters,
          startDate: filters.startDate?.format('YYYY-MM-DD'),
          endDate: filters.endDate?.format('YYYY-MM-DD')
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} reports:`, error);
      // Return mock data for development
      if (error.response && error.response.status === 404) {
        return getMockData(type);
      }
      throw error;
    }
  },

  // Save custom report template
  saveReportTemplate: async (template) => {
    try {
      const response = await axios.post(`reports/templates`, {
        ...template,
        filters: {
          ...template.filters,
          startDate: template.filters.startDate?.format('YYYY-MM-DD'),
          endDate: template.filters.endDate?.format('YYYY-MM-DD')
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error saving report template:', error);
      // For development
      if (error.response && error.response.status === 404) {
        const mockTemplate = {
          id: Date.now().toString(),
          ...template,
          createdAt: new Date().toISOString()
        };
        alert('Mock template saved successfully');
        return mockTemplate;
      }
      throw error;
    }
  },

  // Get saved report templates
  getReportTemplates: async () => {
    try {
      const response = await axios.get('/reports/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching report templates:', error);
      throw error;
    }
  },

  // Delete report template
  deleteReportTemplate: async (templateId) => {
    try {
      const response = await axios.delete(`/reports/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report template:', error);
      throw error;
    }

  },

  async generateReport(template) {
    try {
      console.log('Generating report with template:', template);

      // Validate template fields
      if (!template || !template.type) {
        throw new Error('Invalid template: Missing required fields');
      }

      // Ensure metrics are provided
      const metrics = template.metrics || [
        'Company Name',
        'Industry',
        'Visits',
        'Positions',
        'Students Hired',
        'Average Package',
        'Job Profiles'
      ];

      // Create request payload
      const payload = {
        ...template,
        metrics,
        filters: {
          startDate: template.filters?.startDate || new Date().toISOString(),
          endDate: template.filters?.endDate || new Date().toISOString(),
          industry: template.filters?.industry || 'all',
          year: template.filters?.year || new Date().getFullYear().toString()
        }
      };

      console.log('Sending request with payload:', payload);

      // Make API request
      const response = await axios.post('reports/generate', payload, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      // Handle the response
      if (response.data) {
        // Create Excel file download
        const url = window.URL.createObjectURL(
          new Blob([response.data], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
        );
        
        const link = document.createElement('a');
        link.href = url;
        const fileName = `${template.type}_report_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return null;
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate report');
    }
  },

  // Add this method to your reportService object
  downloadCharts: async (type, filters) => {
    try {
      const response = await axios.get(`reports/${type}/charts/download`, {
        params: filters,
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading charts:', error);
      throw error;
    }
      }
};

// Mock data functions for development
function getMockData(type) {
  switch (type) {
    case 'placement':
      return {
        summary: {
          totalStudents: 450,
          placedStudents: 380,
          placementPercentage: 84.4,
          averageCTC: 12.5,
          highestCTC: 45.0,
          companiesVisited: 65
        },
        monthlyData: [
          { month: 'Jan', placements: 45 },
          { month: 'Feb', placements: 52 },
          { month: 'Mar', placements: 38 },
          { month: 'Apr', placements: 30 },
          { month: 'May', placements: 25 },
          { month: 'Jun', placements: 40 },
          { month: 'Jul', placements: 55 },
          { month: 'Aug', placements: 60 },
          { month: 'Sep', placements: 35 },
          { month: 'Oct', placements: 30 },
          { month: 'Nov', placements: 45 },
          { month: 'Dec', placements: 25 }
        ],
        branchData: [
          { branch: 'Computer Science', placed: 95, total: 100 },
          { branch: 'Information Technology', placed: 88, total: 100 },
          { branch: 'Electronics', placed: 75, total: 90 },
          { branch: 'Electrical', placed: 70, total: 85 },
          { branch: 'Mechanical', placed: 52, total: 75 }
        ]
      };
    case 'company':
      return {
        summary: {
          totalCompanies: 65,
          newCompanies: 15,
          activeCompanies: 50,
          topIndustry: 'IT & Software',
          averagePackage: 12.5
        },
        industryData: [
          { industry: 'IT & Software', count: 25 },
          { industry: 'Finance', count: 12 },
          { industry: 'Manufacturing', count: 8 },
          { industry: 'Consulting', count: 10 },
          { industry: 'E-commerce', count: 5 },
          { industry: 'Others', count: 5 }
        ],
        companyList: [
          { name: 'Google', industry: 'IT & Software', offers: 12, avgCTC: 25.5 },
          { name: 'Microsoft', industry: 'IT & Software', offers: 15, avgCTC: 22.0 },
          { name: 'Amazon', industry: 'E-commerce', offers: 20, avgCTC: 18.5 },
          { name: 'Goldman Sachs', industry: 'Finance', offers: 8, avgCTC: 20.0 },
          { name: 'Deloitte', industry: 'Consulting', offers: 25, avgCTC: 12.0 }
        ]
      };
    case 'student':
      return {
        summary: {
          totalStudents: 450,
          placedStudents: 380,
          unplacedStudents: 70,
          highestCGPA: 9.8,
          averageCGPA: 8.2
        },
        departmentData: [
          { department: 'Computer Science', count: 100 },
          { department: 'Information Technology', count: 100 },
          { department: 'Electronics', count: 90 },
          { department: 'Electrical', count: 85 },
          { department: 'Mechanical', count: 75 }
        ],
        placementData: [
          { status: 'Placed', count: 380 },
          { status: 'Unplaced', count: 70 }
        ],
        studentList: [
          { name: 'John Doe', department: 'Computer Science', cgpa: 9.2, status: 'Placed', company: 'Google' },
          { name: 'Jane Smith', department: 'Information Technology', cgpa: 9.5, status: 'Placed', company: 'Microsoft' },
          { name: 'Bob Johnson', department: 'Electronics', cgpa: 8.8, status: 'Placed', company: 'Amazon' },
          { name: 'Alice Brown', department: 'Computer Science', cgpa: 9.0, status: 'Placed', company: 'Facebook' },
          { name: 'Charlie Wilson', department: 'Mechanical', cgpa: 8.5, status: 'Unplaced', company: null }
        ]
      };
    default:
      return {};
  }
}

function getMockTemplates() {
  return [
    {
      id: '1',
      name: 'Placement Summary 2024',
      type: 'placement',
      metrics: ['placementPercentage', 'averageCTC', 'highestCTC'],
      filters: {
        year: '2024',
        branch: 'all',
        startDate: '2023-06-01',
        endDate: '2024-05-31'
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'CS Department Report',
      type: 'student',
      metrics: ['placedCount', 'unplacedCount', 'averageCGPA'],
      filters: {
        department: 'Computer Science',
        batch: '2024',
        placementStatus: 'all'
      },
      createdAt: '2024-02-20T14:15:00Z'
    },
    {
      id: '3',
      name: 'Top Companies Analysis',
      type: 'company',
      metrics: ['companyCount', 'industryDistribution', 'averagePackage'],
      filters: {
        industry: 'all',
        year: '2024',
        status: 'active'
      },
      createdAt: '2024-03-10T09:45:00Z'
    }
  ];
}

export default reportService;