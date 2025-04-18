import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../../../config/axios';

const BranchWiseChart = ({ filters = {} }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branchData, setBranchData] = useState([]);

  useEffect(() => {
    const fetchBranchData = async () => {
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
        const endpoint = `/dashboard/branch-stats${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data && data.branches && Array.isArray(data.branches)) {
          setBranchData(data.branches);
        } else {
          setBranchData([]);
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching branch-wise data:", error);
        setError("Failed to load branch-wise placement data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [filters]); // Re-fetch when filters change

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  // Use default data if no data is available
  const displayData = branchData.length > 0 ? branchData : [
    { branch: 'No Data Available', total: 0, placed: 0 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Branch-wise Placement Status
        </Typography>
        <Box height={350}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name === 'total' ? 'Total Students' : 'Placed Students']} />
              <Legend />
              {/* <Bar dataKey="total" name="Total Students" fill="#1976d2" /> */}
              <Bar dataKey="total" fill="#1976d2" />
              <Bar dataKey="placed" fill="#2e7d32" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BranchWiseChart; 