import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import axios from '../../../config/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CareerPreferences = ({ filters = {} }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [careerData, setCareerData] = useState([]);
  const [branchWisePreferences, setBranchWisePreferences] = useState([]);

  useEffect(() => {
    const fetchCareerData = async () => {
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
        const endpoint = `/dashboard/career-preferences${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data) {
          // Set career preference data
          if (data.careerPreferences && Array.isArray(data.careerPreferences)) {
            setCareerData(data.careerPreferences);
          }
          
          // Set branch-wise preference data
          if (data.branchWisePreferences && Array.isArray(data.branchWisePreferences)) {
            setBranchWisePreferences(data.branchWisePreferences);
          }
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching career preference data:", error);
        setError("Failed to load career preference data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCareerData();
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
  const displayCareerData = careerData.length > 0 ? careerData : [
    { name: 'No Data Available', value: 100 }
  ];

  const displayBranchData = branchWisePreferences.length > 0 ? branchWisePreferences : [
    { branch: 'No Data Available', higherStudies: 0, startup: 0, research: 0, civilServices: 0 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Career Preferences (Non-Enrolled Students)
        </Typography>
        <Box sx={{ display: 'flex', height: 300 }}>
          <Box sx={{ width: '50%', height: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={displayCareerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {displayCareerData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke={index === activeIndex ? '#fff' : 'none'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ width: '50%', height: '100%' }}>
            <ResponsiveContainer>
              <RadarChart data={displayBranchData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="branch" />
                <PolarRadiusAxis />
                <Radar
                  name="Higher Studies"
                  dataKey="higherStudies"
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                />
                <Radar
                  name="Startup"
                  dataKey="startup"
                  stroke={COLORS[1]}
                  fill={COLORS[1]}
                  fillOpacity={0.6}
                />
                <Radar
                  name="Research"
                  dataKey="research"
                  stroke={COLORS[2]}
                  fill={COLORS[2]}
                  fillOpacity={0.6}
                />
                <Radar
                  name="Civil Services"
                  dataKey="civilServices"
                  stroke={COLORS[3]}
                  fill={COLORS[3]}
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CareerPreferences; 