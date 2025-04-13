import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from '../../../config/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CTCAnalysis = ({ filters = {} }) => {
  const [view, setView] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ctcDistribution, setCtcDistribution] = useState([]);
  const [branchCtcData, setBranchCtcData] = useState([]);

  useEffect(() => {
    const fetchCTCData = async () => {
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
        const endpoint = `/dashboard/ctc-analysis${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data) {
          // Set CTC distribution data
          if (data.distribution && Array.isArray(data.distribution)) {
            setCtcDistribution(data.distribution);
          }
          
          // Set branch-wise CTC data
          if (data.branchWise && Array.isArray(data.branchWise)) {
            setBranchCtcData(data.branchWise);
          }
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching CTC analysis data:", error);
        setError("Failed to load CTC analysis data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCTCData();
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
  const displayCtcDistribution = ctcDistribution.length > 0 ? ctcDistribution : [
    { range: '0-5 LPA', count: 0 },
    { range: '5-10 LPA', count: 0 },
    { range: '10-15 LPA', count: 0 },
    { range: '15-20 LPA', count: 0 },
    { range: '20+ LPA', count: 0 }
  ];

  const displayBranchCtcData = branchCtcData.length > 0 ? branchCtcData : [
    { branch: 'No Data Available', avgCTC: 0 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          CTC Analysis
        </Typography>
        <Tabs value={view} onChange={(e, newValue) => setView(newValue)} sx={{ mb: 2 }}>
          <Tab label="CTC Distribution" />
          <Tab label="Branch-wise CTC" />
        </Tabs>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            {view === 0 ? (
              <PieChart>
                <Pie
                  data={displayCtcDistribution}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => 
                    percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
                  }
                >
                  {displayCtcDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} placements`, 'Count']} />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={displayBranchCtcData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} LPA`, 'Average CTC']} />
                <Legend />
                <Bar 
                  dataKey="avgCTC" 
                  fill="#8884d8" 
                  name="Average CTC (LPA)" 
                  radius={[8, 8, 0, 0]} 
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CTCAnalysis; 