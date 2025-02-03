import { useEffect, useState } from 'react'; 
import axios from '../../../config/axios'; // Correct relative path
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import {
  People,
  Business,
  TrendingUp,
  School,
  CheckCircle,
  Timeline
} from '@mui/icons-material';

const AnalyticsCards = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const response = await axios.get('/dashboard/analytics'); 
      const data = await response.data;
      setAnalyticsData([
        {
          title: "Total Students",
          count: data.totalStudents,
          percentage: 8,
          icon: <People />,
          color: "#1976d2",
          trend: "up"
        },
        {
          title: "Placed Students",
          count: data.placedStudents,
          percentage: 12,
          icon: <CheckCircle />,
          color: "#2e7d32",
          trend: "up"
        },
        {
          title: "Companies Visited",
          count: data.companiesVisited,
          percentage: 15,
          icon: <Business />,
          color: "#ed6c02",
          trend: "up"
        },
        {
          title: "Average Package",
          count: `${data.averagePackage} LPA`, // Assuming averagePackage is a number
          percentage: 10,
          icon: <TrendingUp />,
          color: "#9c27b0",
          trend: "up"
        }
      ]);
    };

    fetchAnalyticsData(); // Call the fetch function
  }, []);

  return (
    <Grid container spacing={3}>
      {analyticsData.map((item, index) => (
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
                  <Typography
                    variant="body2"
                    color={item.trend === 'up' ? 'success.main' : 'error.main'}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}
                  >
                    <TrendingUp fontSize="small" />
                    {item.percentage}% increase
                  </Typography>
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