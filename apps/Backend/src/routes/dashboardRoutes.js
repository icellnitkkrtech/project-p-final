import { Router } from 'express';
import StudentModel from '../models/studentModel.js'; // Import the StudentModel
import CompanyModel from '../models/companyModel.js';

const dashboardRouter = Router();
const studentModel = new StudentModel(); // Initialize the StudentModel
const companyModel = new CompanyModel();

dashboardRouter.get('/analytics', async (req, res) => {
    try {
        const companiesVisitedResponse = await companyModel.getTotalCompanies();
        // Fetch the total number of students from the database
        const totalStudentsResponse = await studentModel.getTotalStudents();
        
        // Check if the response is successful
        if (totalStudentsResponse.statusCode !== 200||companiesVisitedResponse.statusCode !== 200) {
            return res.status(totalStudentsResponse.statusCode).json(totalStudentsResponse);
        }

        // Sample data to return; replace with actual data retrieval logic
        const analyticsData = {
            totalStudents: totalStudentsResponse.data, // Use the actual count from the database
            placedStudents: 80, // You can also fetch this from the database if needed
            companiesVisited: companiesVisitedResponse.data, // Sample data; replace with actual logic
            averagePackage: 50000 // Sample data; replace with actual logic
        };
        
        res.json(analyticsData);
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New route for placement progress
dashboardRouter.get('/placement-progress', (req, res) => {
    // Sample data for placement progress; replace with actual data retrieval logic
    const placementProgressData = {
        monthlyData: [
            { month: "January", placed: 20, target: 30 },
            { month: "February", placed: 25, target: 30 },
            { month: "March", placed: 30, target: 40 },
            // Add more months as needed
        ],
        overall: {
            total: 100,
            placed: 80,
            percentage: 80 // Calculate percentage based on total and placed
        }
    };
    res.json(placementProgressData);
});

// New route for company stats
dashboardRouter.get('/company-stats', (req, res) => {
    const companyStatsData = {
        distribution: [
            { name: "Company A", value: 50 },
            { name: "Company B", value: 30 },
            { name: "Company C", value: 20 }
        ],
        packages: [
            { range: "0-5 LPA", count: 10 },
            { range: "5-10 LPA", count: 25 },
            { range: "10-15 LPA", count: 15 }
        ]
    };
    res.json(companyStatsData);
});

// New route for branch stats
dashboardRouter.get('/branch-stats', (req, res) => {
    const branchStatsData = {
        branches: [
            { name: "Computer Science", total: 100, placed: 80 },
            { name: "Electronics", total: 80, placed: 60 },
            { name: "Mechanical", total: 70, placed: 50 }
        ]
    };
    res.json(branchStatsData);
});

// New route for CTC analysis
dashboardRouter.get('/ctc-analysis', (req, res) => {
    const ctcAnalysisData = {
        distribution: [
            { range: "0-5 LPA", count: 10 },
            { range: "5-10 LPA", count: 25 },
            { range: "10-15 LPA", count: 15 }
        ],
        branchWise: [
            { branch: "Computer Science", avgCTC: 8.5 },
            { branch: "Electronics", avgCTC: 7.0 },
            { branch: "Mechanical", avgCTC: 6.5 }
        ]
    };
    res.json(ctcAnalysisData);
});

// New route for career preferences
dashboardRouter.get('/career-preferences', (req, res) => {
    const careerPreferencesData = {
        preferences: [
            { name: "Higher Studies", value: 40, details: { "M.Tech": 20, "MBA": 15, "PhD": 5 } },
            { name: "Startup", value: 30, details: { "Tech": 15, "Non-Tech": 15 } },
            { name: "Research", value: 20, details: { "R&D": 10, "Academia": 10 } }
        ],
        branchWise: [
            { branch: "Computer Science", higherStudies: 20, startup: 10, research: 5, civilServices: 2 },
            { branch: "Electronics", higherStudies: 15, startup: 5, research: 3, civilServices: 1 }
        ]
    };
    res.json(careerPreferencesData);
});

// New route for job profiles
dashboardRouter.get('/job-profiles', (req, res) => {
    const jobProfilesData = {
        sectors: [
            { name: "IT", value: 60 },
            { name: "Core Engineering", value: 30 },
            { name: "Consulting", value: 10 }
        ],
        profiles: [
            { profile: "Software Engineer", count: 50, avgCTC: 8.0 },
            { profile: "Data Scientist", count: 20, avgCTC: 10.0 },
            { profile: "Mechanical Engineer", count: 15, avgCTC: 6.5 }
        ]
    };
    res.json(jobProfilesData);
});

// New route for top companies
dashboardRouter.get('/top-companies', (req, res) => {
    const topCompaniesData = {
        topPaying: [{ name: "Company A", avgCTC: 12.0 }, { name: "Company B", avgCTC: 11.5 }],
        topHiring: [{ name: "Company C", count: 30 }, { name: "Company D", count: 25 }],
        lowPaying: [{ name: "Company E", avgCTC: 4.0 }, { name: "Company F", avgCTC: 3.5 }]
    };
    res.json(topCompaniesData);
});

// New route for upcoming events
dashboardRouter.get('/upcoming-events', (req, res) => {
    const upcomingEventsData = {
        events: [
            { title: "Job Fair", date: "2023-10-15", location: "Campus" },
            { title: "Alumni Meet", date: "2023-11-01", location: "Auditorium" }
        ]
    };
    res.json(upcomingEventsData);
});

// New route for recent activities
dashboardRouter.get('/recent-activities', (req, res) => {
    const recentActivitiesData = {
        activities: [
            { activity: "Placement Drive", date: "2023-09-20" },
            { activity: "Workshop on Resume Building", date: "2023-09-25" }
        ]
    };
    res.json(recentActivitiesData);
});

// New route for total students
dashboardRouter.get('/total-students', async (req, res) => {
    try {
        const totalStudents = await getTotalStudents();
        res.json({ totalStudents });
    } catch (error) {
        console.error("Error fetching total students:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default dashboardRouter; 