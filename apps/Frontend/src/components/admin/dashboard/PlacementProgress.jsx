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

        if (data && data.monthly && Array.isArray(data.monthly)) {
          setMonthlyData(data.monthly);
        }

        if (data && data.overall) {
          setOverallData({
            total: data.overall.total || 0,
            placed: data.overall.placed || 0,
            percentage: data.overall.percentage || 0
          });
        }
      } catch (error) {
        console.error("Error fetching placement progress:", error);
        setError("Failed to load placement progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlacementProgressData();
  }, [filters]);

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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Placement Progress
        </Typography>

        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="textSecondary">
              Overall Progress ({overallData.percentage.toFixed(1)}%)
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              {overallData.placed} of {overallData.total} Students
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={overallData.percentage} 
            sx={{ height: 10, borderRadius: 5 }} 
          />
        </Box>

        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `${value} Students`,
                name === "placed" ? "Placed" : "Target"
              ]}/>
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