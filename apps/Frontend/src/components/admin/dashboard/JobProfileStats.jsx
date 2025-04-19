import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from '../../../config/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const JobProfileStats = ({ filters = {} }) => {
  const [view, setView] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectorData, setSectorData] = useState([]);
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    const fetchJobProfileData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== 'all') {
            queryParams.append(key, value);
          }
        });
        
        const queryString = queryParams.toString();
        const endpoint = `/dashboard/job-profiles${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data) {
          // Set sector distribution data
          if (data.sectors && Array.isArray(data.sectors)) {
            setSectorData(data.sectors);
          }
          
          // Transform profile data to use designation instead of profileId
          if (data.profiles && Array.isArray(data.profiles)) {
            const transformedProfiles = data.profiles.map(profile => ({
              profile: profile.jobProfile?.designation || 'Unknown Role', // Use designation from jobProfile
              count: profile.count,
              avgCTC: profile.avgCTC
            }));
            setProfileData(transformedProfiles);
          }
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching job profile data:", error);
        setError("Failed to load job profile analysis data");
      } finally {
        setLoading(false);
      }
    };

    fetchJobProfileData();
  }, [filters]);

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
  const displaySectorData = sectorData.length > 0 ? sectorData : [
    { name: 'No Data Available', value: 100 }
  ];

  const displayProfileData = profileData.length > 0 ? profileData : [
    { profile: 'No Data Available', count: 0, avgCTC: 0 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Job Profile Analysis
        </Typography>
        <Tabs value={view} onChange={(e, newValue) => setView(newValue)} sx={{ mb: 2 }}>
          <Tab label="Sector Distribution" />
          <Tab label="Profile Analysis" />
        </Tabs>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            {view === 0 ? (
              <PieChart>
                <Pie
                  data={displaySectorData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}%`}
                  dataKey="value"
                >
                  {displaySectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={displayProfileData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="profile" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                  tickFormatter={(value) => 
                    value.length > 20 ? `${value.substring(0, 20)}...` : value
                  }
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "Number of Students" ? value : `${value} LPA`,
                    name
                  ]}
                  labelFormatter={(label) => `Role: ${label}`}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="count" 
                  fill="#8884d8" 
                  name="Number of Students"
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="avgCTC" 
                  fill="#82ca9d" 
                  name="Average CTC (LPA)"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobProfileStats;