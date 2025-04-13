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

const Dashboard = () => {
  // Filter states
  const [filters, setFilters] = useState({
    session: 'all',
    educationLevel: 'all',
    driveType: 'all',
    offerType: 'all'
  });
  
  // Available filter options (these could be fetched from API)
  const sessions = ['all', '2022-23', '2023-24', '2024-25'];
  const educationLevels = ['all', 'UG', 'PG'];
  const driveTypes = ['all', 'placement', 'intern'];
  const offerTypes = ['all', 'intern+fte', 'intern+ppo', 'fte'];
  
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
                {sessions.map(session => (
                  <MenuItem key={session} value={session}>
                    {session === 'all' ? 'All Sessions' : session}
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

      {/* Charts Row 1 */}
      <Grid item xs={12} md={8}>
        <PlacementProgress filters={filters} />
      </Grid>
      <Grid item xs={12} md={4}>
        <CompanyStats filters={filters} />
      </Grid>

      {/* Charts Row 2 */}
      <Grid item xs={12} md={6}>
        <BranchWiseChart filters={filters} />
      </Grid>
      <Grid item xs={12} md={6}>
        <CTCAnalysis filters={filters} />
      </Grid>

      {/* Charts Row 3 */}
      <Grid item xs={12} md={6}>
        <JobProfileStats filters={filters} />
      </Grid>
      <Grid item xs={12} md={6}>
        <CareerPreferences filters={filters} />
      </Grid>

      {/* Charts Row 4 */}
      <Grid item xs={12}>
        <TopCompanies filters={filters} />
      </Grid>

      {/* Recent Activities */}
      <Grid item xs={12}>
        <RecentActivities />
      </Grid>
    </Grid>
  );
};

export default Dashboard; 