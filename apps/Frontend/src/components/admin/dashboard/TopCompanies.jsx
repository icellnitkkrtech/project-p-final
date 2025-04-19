import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import axios from '../../../config/axios';

const COLORS = {
  topPaying: ['#00C49F', '#00A087', '#008975', '#006B66', '#004D4D'],
  topHiring: ['#0088FE', '#0070D1', '#0059A3', '#004175', '#002947'],
  lowPaying: ['#FF8042', '#FF6B3F', '#FF533C', '#FF3939', '#FF2020']
};

const TopCompanies = ({ filters = {} }) => {
  const [view, setView] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topPayingCompanies, setTopPayingCompanies] = useState([]);
  const [topHiringCompanies, setTopHiringCompanies] = useState([]);
  const [leastPayingCompanies, setLeastPayingCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
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
        const endpoint = `/dashboard/top-companies${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data) {
          // Set top paying companies data
          if (data.topPaying && Array.isArray(data.topPaying)) {
            setTopPayingCompanies(data.topPaying);
          }
          
          // Set top hiring companies data
          if (data.topHiring && Array.isArray(data.topHiring)) {
            setTopHiringCompanies(data.topHiring);
          }
          
          // Set least paying companies data
          if (data.leastPaying && Array.isArray(data.leastPaying)) {
            setLeastPayingCompanies(data.leastPaying);
          }
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching company analysis data:", error);
        setError("Failed to load company analysis data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
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
  const displayTopPaying = topPayingCompanies.length > 0 ? topPayingCompanies : [
    { name: 'No Data Available', ctc: 0, hired: 0 }
  ];

  const displayTopHiring = topHiringCompanies.length > 0 ? topHiringCompanies : [
    { name: 'No Data Available', ctc: 0, hired: 0 }
  ];

  const displayLeastPaying = leastPayingCompanies.length > 0 ? leastPayingCompanies : [
    { name: 'No Data Available', ctc: 0, hired: 0 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Company Analysis
        </Typography>
        <Tabs 
          value={view} 
          onChange={(e, newValue) => setView(newValue)} 
          sx={{ mb: 2 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Top Paying" />
          <Tab label="Top Hiring" />
          <Tab label="Least Paying" />
        </Tabs>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            {view === 0 ? (
              <BarChart data={displayTopPaying}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke={COLORS.topPaying[0]} />
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.topPaying[1]} />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="hired" 
                  fill={COLORS.topPaying[0]} 
                  name="Students Hired"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList dataKey="hired" position="top" />
                </Bar>
                <Bar 
                  yAxisId="right" 
                  dataKey="ctc" 
                  fill={COLORS.topPaying[1]} 
                  name="CTC (LPA)"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList dataKey="ctc" position="top" />
                </Bar>
              </BarChart>
            ) : view === 1 ? (
              <BarChart data={displayTopHiring}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke={COLORS.topHiring[0]} />
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.topHiring[1]} />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="hired" 
                  fill={COLORS.topHiring[0]} 
                  name="Students Hired"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList dataKey="hired" position="top" />
                </Bar>
                <Bar 
                  yAxisId="right" 
                  dataKey="ctc" 
                  fill={COLORS.topHiring[1]} 
                  name="CTC (LPA)"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList dataKey="ctc" position="top" />
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={displayLeastPaying}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke={COLORS.lowPaying[0]} />
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.lowPaying[1]} />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="hired" 
                  fill={COLORS.lowPaying[0]} 
                  name="Students Hired"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList dataKey="hired" position="top" />
                </Bar>
                <Bar 
                  yAxisId="right" 
                  dataKey="ctc" 
                  fill={COLORS.lowPaying[1]} 
                  name="CTC (LPA)"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList dataKey="ctc" position="top" />
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopCompanies;