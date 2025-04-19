import { Box, Card, CardContent, Grid } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';

const DashboardFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    placement_season: '',
    education_level: 'all',
    drive_type: 'all',
    offer_type: 'all'
  });

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Placement Season</InputLabel>
              <Select
                value={filters.placement_season}
                label="Placement Season"
                onChange={(e) => handleFilterChange('placement_season', e.target.value)}
              >
                <MenuItem value="">All Seasons</MenuItem>
                <MenuItem value="2023-24">2023-24</MenuItem>
                <MenuItem value="2024-25">2024-25</MenuItem>
                <MenuItem value="2025-26">2025-26</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Education Level</InputLabel>
              <Select
                value={filters.education_level}
                label="Education Level"
                onChange={(e) => handleFilterChange('education_level', e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="ug">UG</MenuItem>
                <MenuItem value="pg">PG</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Drive Type</InputLabel>
              <Select
                value={filters.drive_type}
                label="Drive Type"
                onChange={(e) => handleFilterChange('drive_type', e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="placement">Placement</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Offer Type</InputLabel>
              <Select
                value={filters.offer_type}
                label="Offer Type"
                onChange={(e) => handleFilterChange('offer_type', e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="intern_fte">Internship + FTE</MenuItem>
                <MenuItem value="fte">FTE Only</MenuItem>
                <MenuItem value="intern_ppo">Internship + PPO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;