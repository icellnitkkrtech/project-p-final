import dashboardService from '../services/dashboardService.js';

const dashboardController = {
  // Get analytics data
  getAnalytics: async (req, res) => {
    try {
      const { session, educationLevel, driveType, offerType } = req.query;
      const filters = { session, educationLevel, driveType, offerType };
      
      const data = await dashboardService.getAnalytics(filters);
      res.json(data);
    } catch (error) {
      console.error("Error in analytics endpoint:", error);
      res.status(500).json({ 
        error: "Failed to fetch analytics data",
        message: error.message 
      });
    }
  },
  
  // Get placement progress data
  getPlacementProgress: async (req, res) => {
    try {
      const { session, educationLevel, driveType, offerType } = req.query;
      const filters = { session, educationLevel, driveType, offerType };
      
      const data = await dashboardService.getPlacementProgress(filters);
      res.json(data);
    } catch (error) {
      console.error("Error in placement-progress endpoint:", error);
      res.status(500).json({ 
        error: "Failed to fetch placement progress data",
        message: error.message 
      });
    }
  },
  
  // Get branch-wise stats
  getBranchStats: async (req, res) => {
    try {
      const { session, educationLevel, driveType, offerType } = req.query;
      const filters = { session, educationLevel, driveType, offerType };
      
      const data = await dashboardService.getBranchStats(filters);
      res.json(data);
    } catch (error) {
      console.error("Error in branch-stats endpoint:", error);
      res.status(500).json({ 
        error: "Failed to fetch branch-wise data",
        message: error.message 
      });
    }
  },
  
  // Get company stats
  getCompanyStats: async (req, res) => {
    try {
      const { session, educationLevel, driveType, offerType } = req.query;
      const filters = { session, educationLevel, driveType, offerType };
      
      const data = await dashboardService.getCompanyStats(filters);
      res.json(data);
    } catch (error) {
      console.error("Error in company-stats endpoint:", error);
      res.status(500).json({ 
        error: "Failed to fetch company stats data",
        message: error.message 
      });
    }
  },
  
  // Get CTC analysis
  getCTCAnalysis: async (req, res) => {
    try {
      const { session, educationLevel, driveType, offerType } = req.query;
      const filters = { session, educationLevel, driveType, offerType };
      
      const data = await dashboardService.getCTCAnalysis(filters);
      res.json(data);
    } catch (error) {
      console.error("Error in ctc-analysis endpoint:", error);
      res.status(500).json({ 
        error: "Failed to fetch CTC analysis data",
        message: error.message 
      });
    }
  },
  
  // Get top companies
  getTopCompanies: async (req, res) => {
    try {
      const { session, educationLevel, driveType, offerType } = req.query;
      const filters = { session, educationLevel, driveType, offerType };
      
      const data = await dashboardService.getTopCompanies(filters);
      res.json(data);
    } catch (error) {
      console.error("Error in top-companies endpoint:", error);
      res.status(500).json({ 
        error: "Failed to fetch top companies data",
        message: error.message 
      });
    }
  },
  
  // Get job profiles
  getJobProfiles: async (req, res) => {
    try {
      const { session, educationLevel, driveType, offerType } = req.query;
      const filters = { session, educationLevel, driveType, offerType };
      
      const data = await dashboardService.getJobProfiles(filters);
      res.json(data);
    } catch (error) {
      console.error("Error in job-profiles endpoint:", error);
      res.status(500).json({ 
        error: "Failed to fetch job profile data",
        message: error.message 
      });
    }
  },
  
  // Get career preferences
  getCareerPreferences: async (req, res) => {
    try {
      const { session, educationLevel } = req.query;
      const filters = { session, educationLevel };
      
      const data = await dashboardService.getCareerPreferences(filters);
      res.json(data);
    } catch (error) {
      console.error("Error in career-preferences endpoint:", error);
      res.status(500).json({ 
        error: "Failed to fetch career preference data",
        message: error.message 
      });
    }
  }
};

export default dashboardController; 