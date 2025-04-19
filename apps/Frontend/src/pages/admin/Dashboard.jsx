import { Grid, Box, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import AnalyticsCards from '../../components/admin/dashboard/AnalyticsCards';
import BranchWiseChart from '../../components/admin/dashboard/BranchWiseChart';
import CompanyStats from '../../components/admin/dashboard/CompanyStats';
import PlacementProgress from '../../components/admin/dashboard/PlacementProgress';
import RecentActivities from '../../components/admin/dashboard/RecentActivities';
import UpcomingEvents from '../../components/admin/dashboard/UpcomingEvents';
import CTCAnalysis from '../../components/admin/dashboard/CTCAnalysis';
import CareerPreferences from '../../components/admin/dashboard/CareerPreferences';
import JobProfileStats from '../../components/admin/dashboard/JobProfileStats';
import TopCompanies from '../../components/admin/dashboard/TopCompanies';
import axios from '../../config/axios';
import placementSessionService from '../../services/admin/placementSessionService';

const Dashboard = () => {
  // Filter states
  const [filters, setFilters] = useState({
    session: 'all',
    educationLevel: 'all',
    driveType: 'all',
    offerType: 'all'
  });
  
  // State for placement sessions
  const [placementSessions, setPlacementSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Available filter options
  const educationLevels = ['all', 'UG', 'PG'];
  const driveTypes = ['all', 'placement', 'intern'];
  const offerTypes = ['all', 'intern+fte', 'intern+ppo', 'fte'];
  
  // Fetch placement sessions on component mount
  useEffect(() => {
    const fetchPlacementSessions = async () => {
      setLoading(true);
      try {
        const response = await placementSessionService.getAll();
        if (response.data && Array.isArray(response.data)) {
          // Sort sessions by name in descending order (newest first)
          const sortedSessions = response.data.sort((a, b) => {
            return b.name.localeCompare(a.name);
          });
          setPlacementSessions(sortedSessions);
        }
      } catch (error) {
        console.error("Error fetching placement sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlacementSessions();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Grid container spacing={3}>
      {/* Filters Section */}
      <Grid item xs={12}>
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="session-label">Placement Session</InputLabel>
              <Select
                labelId="session-label"
                id="session"
                name="session"
                value={filters.session}
                label="Placement Session"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Sessions</MenuItem>
                {placementSessions.map(session => (
                  <MenuItem key={session._id} value={session._id}>
                    {session.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="education-level-label">Education Level</InputLabel>
              <Select
                labelId="education-level-label"
                id="educationLevel"
                name="educationLevel"
                value={filters.educationLevel}
                label="Education Level"
                onChange={handleFilterChange}
              >
                {educationLevels.map(level => (
                  <MenuItem key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="drive-type-label">Drive Type</InputLabel>
              <Select
                labelId="drive-type-label"
                id="driveType"
                name="driveType"
                value={filters.driveType}
                label="Drive Type"
                onChange={handleFilterChange}
              >
                {driveTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type === 'all' ? 'All Drives' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="offer-type-label">Offer Type</InputLabel>
              <Select
                labelId="offer-type-label"
                id="offerType"
                name="offerType"
                value={filters.offerType}
                label="Offer Type"
                onChange={handleFilterChange}
              >
                {offerTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type === 'all' ? 'All Offers' : type.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>
      </Grid>

      {/* Analytics Cards */}
      <Grid item xs={12}>
        <AnalyticsCards filters={filters} />
      </Grid>

      {/* PlacementProgress - Full Width */}
      <Grid item xs={12}>
        <PlacementProgress filters={filters} />
      </Grid>

      {/* CompanyStats - Full Width */}
      <Grid item xs={12}>
        <CompanyStats filters={filters} />
      </Grid>

      {/* BranchWiseChart - Full Width */}
      <Grid item xs={12}>
        <BranchWiseChart filters={filters} />
      </Grid>

      {/* CTCAnalysis - Full Width */}
      <Grid item xs={12}>
        <CTCAnalysis filters={filters} />
      </Grid>

      {/* JobProfileStats - Full Width */}
      <Grid item xs={12}>
        <JobProfileStats filters={filters} />
      </Grid>

      {/* CareerPreferences - Full Width */}
      <Grid item xs={12}>
        <CareerPreferences filters={filters} />
      </Grid>

      {/* TopCompanies - Full Width */}
      <Grid item xs={12}>
        <TopCompanies filters={filters} />
      </Grid>

      {/* Recent Activities - Full Width */}
      <Grid item xs={12}>
        <RecentActivities />
      </Grid>
    </Grid>
  );
};

export default Dashboard;