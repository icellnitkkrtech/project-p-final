import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, LinearProgress, CircularProgress, Alert, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import axios from '../../../config/axios';

const CompanyStats = ({ filters = {} }) => {
  const [companyData, setCompanyData] = useState([
    { name: 'Product', value: 45 },
    { name: 'Service', value: 30 },
    { name: 'Startup', value: 15 },
    { name: 'Others', value: 10 }
  ]);

  const [packageStats, setPackageStats] = useState([
    { range: '> 20 LPA', count: 5, color: '#2e7d32' },
    { range: '15-20 LPA', count: 12, color: '#1976d2' },
    { range: '10-15 LPA', count: 25, color: '#ed6c02' },
    { range: '5-10 LPA', count: 45, color: '#9c27b0' }
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [statusData, setStatusData] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9c27b0', '#2e7d32'];

  useEffect(() => {
    const fetchCompanyStats = async () => {
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
        const endpoint = `/dashboard/company-stats${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data) {
          // Set total companies
          setTotalCompanies(data.total || 0);
          
          // Set status data
          if (data.byStatus && Array.isArray(data.byStatus)) {
            setStatusData(data.byStatus);
          }
          
          // Set company type data if available
          if (data.byType && Array.isArray(data.byType)) {
            setCompanyData(data.byType.map(item => ({
              name: item.type,
              value: item.count
            })));
          }
          
          // Set package stats if available
          if (data.byPackage && Array.isArray(data.byPackage)) {
            const colors = ['#2e7d32', '#1976d2', '#ed6c02', '#9c27b0', '#d32f2f'];
            setPackageStats(data.byPackage.map((item, index) => ({
              range: item.range,
              count: item.count,
              color: colors[index % colors.length]
            })));
          }
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching company stats:", error);
        setError("Failed to load company statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyStats();
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

  // Calculate total for package stats
  const totalPackageCompanies = packageStats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Company Statistics
        </Typography>
        
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body2" color="textSecondary">
            Total Companies: <strong>{totalCompanies}</strong>
          </Typography>
          
          <Box display="flex" gap={2}>
            {statusData.map((status, index) => (
              <Typography key={index} variant="body2" color="textSecondary">
                {status.status}: <strong>{status.count}</strong>
              </Typography>
            ))}
          </Box>
        </Box>

        {/* New layout with Grid */}
        <Grid container spacing={2}>
          {/* Left side - Pie Chart */}
          <Grid item xs={12} md={6}>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {companyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} companies`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Right side - Package Distribution */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Package Distribution
            </Typography>
            
            {packageStats.map((stat, index) => (
              <Box key={index} mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">{stat.range}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stat.count} companies
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalPackageCompanies > 0 ? (stat.count / totalPackageCompanies) * 100 : 0}
                  sx={{ 
                    height: 8, 
                    borderRadius: 5,
                    backgroundColor: `${stat.color}22`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stat.color
                    }
                  }}
                />
              </Box>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyStats;
