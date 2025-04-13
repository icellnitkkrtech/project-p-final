import { useEffect, useState } from 'react'; 
import axios from '../../../config/axios';
import { Grid, Card, CardContent, Typography, Box, Avatar, CircularProgress, Alert } from '@mui/material';
import {
  People,
  Business,
  TrendingUp,
  School
} from '@mui/icons-material';

const AnalyticsCards = ({ filters }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Convert filters object to query string
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== 'all') {
            queryParams.append(key, value);
          }
        });
        
        const queryString = queryParams.toString();
        const endpoint = `/dashboard/analytics${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(endpoint);
        setAnalyticsData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [filters]); // Re-fetch when filters change

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Box>
    );
  }

  // Default data in case API returns incomplete data
  const data = analyticsData || {
    totalStudents: 0,
    companiesVisited: 0,
    placementRate: 0,
    avgPackage: 0,
    studentGrowth: 0,
    companyGrowth: 0,
    placementRateChange: 0,
    packageGrowth: 0
  };

  const cardData = [
    {
      title: "Total Students",
      count: data.totalStudents,
      percentage: data.studentGrowth || 0,
      icon: <People />,
      color: "#1976d2",
      trend: data.studentGrowth >= 0 ? "up" : "down"
    },
    {
      title: "Companies Visited",
      count: data.companiesVisited,
      percentage: data.companyGrowth || 0,
      icon: <Business />,
      color: "#2e7d32",
      trend: data.companyGrowth >= 0 ? "up" : "down"
    },
    {
      title: "Placement Rate",
      count: `${data.placementRate}%`,
      percentage: data.placementRateChange || 0,
      icon: <TrendingUp />,
      color: "#ed6c02",
      trend: data.placementRateChange >= 0 ? "up" : "down"
    },
    {
      title: "Avg. Package",
      count: `${data.avgPackage} LPA`,
      percentage: data.packageGrowth || 0,
      icon: <School />,
      color: "#9c27b0",
      trend: data.packageGrowth >= 0 ? "up" : "down"
    }
  ];

  return (
    <Grid container spacing={3}>
      {cardData.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    {item.title}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {item.count}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Typography
                      variant="body2"
                      color={item.trend === "up" ? "success.main" : "error.main"}
                      sx={{ mr: 1 }}
                    >
                      {item.percentage}%
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Since last period
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    backgroundColor: item.color,
                    height: 56,
                    width: 56
                  }}
                >
                  {item.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsCards; 