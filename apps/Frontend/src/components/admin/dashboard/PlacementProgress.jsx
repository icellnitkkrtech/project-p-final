// components/admin/dashboard/PlacementProgress.jsx
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../../../config/axios';

const PlacementProgress = ({ filters }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [overallData, setOverallData] = useState({
    total: 0,
    placed: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlacementProgressData = async () => {
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
        const endpoint = `/dashboard/placement-progress${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(endpoint);
        const data = response.data;

        // Check if data has the expected structure
        if (data && data.monthly) {
          setMonthlyData(data.monthly);
        } else {
          setMonthlyData([]);
        }

        if (data && data.overall) {
          setOverallData({
            total: data.overall.total || 0,
            placed: data.overall.placed || 0,
            percentage: data.overall.percentage || 0
          });
        } else {
          setOverallData({
            total: 0,
            placed: 0,
            percentage: 0
          });
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching placement progress data:", error);
        setError("Failed to load placement progress data. Please try again later.");
        // Set default data on error
        setMonthlyData([]);
        setOverallData({
          total: 0,
          placed: 0,
          percentage: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlacementProgressData();
  }, [filters]);

  // Use the data from state
  const { total, placed, percentage } = overallData;

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Generate default monthly data if none is available
  const defaultMonthlyData = monthlyData.length > 0 ? monthlyData : [
    { month: 'July', placed: 0, target: 10 },
    { month: 'August', placed: 0, target: 20 },
    { month: 'September', placed: 0, target: 30 },
    { month: 'October', placed: 0, target: 40 },
    { month: 'November', placed: 0, target: 50 },
    { month: 'December', placed: 0, target: 60 },
    { month: 'January', placed: 0, target: 70 },
    { month: 'February', placed: 0, target: 80 },
    { month: 'March', placed: 0, target: 90 },
    { month: 'April', placed: 0, target: 95 },
    { month: 'May', placed: 0, target: 100 },
    { month: 'June', placed: 0, target: 100 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Placement Progress
        </Typography>

        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="textSecondary">
              Overall Progress
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              {percentage.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ height: 10, borderRadius: 5 }} 
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="caption" color="textSecondary">
              {placed} Placed
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {total} Total
            </Typography>
          </Box>
        </Box>

        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={defaultMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="placed" 
                name="Placed Students" 
                stroke="#2e7d32" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                name="Target" 
                stroke="#1976d2" 
                strokeWidth={2} 
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlacementProgress;