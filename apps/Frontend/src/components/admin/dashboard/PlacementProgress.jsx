// components/admin/dashboard/PlacementProgress.jsx
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../../../config/axios';

const PlacementProgress = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [placedStudents, setPlacedStudents] = useState(0);

  useEffect(() => {
    const fetchPlacementProgressData = async () => {
      try {
        const response = await axios.get('/dashboard/placement-progress');
        const data = response.data;

        setMonthlyData(data.monthlyData);
        setTotalStudents(data.overall.total);
        setPlacedStudents(data.overall.placed);
      } catch (error) {
        console.error("Error fetching placement progress data:", error);
      }
    };

    fetchPlacementProgressData();
  }, []);

  const placementPercentage = (placedStudents / totalStudents) * 100 || 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Placement Progress
        </Typography>

        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">Overall Progress</Typography>
            <Typography variant="body2" color="textSecondary">
              {placedStudents} / {totalStudents} students
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={placementPercentage}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" color="textSecondary" mt={0.5}>
            {Math.round(placementPercentage)}% placed
          </Typography>
        </Box>

        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
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