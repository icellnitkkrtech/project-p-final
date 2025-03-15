import { Box, TextField, MenuItem } from '@mui/material';

const PlacementFilters = ({ filters, onSearchChange, onFilterChange }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, width: '100%' }}>
      <TextField 
        label="Search"
        value={filters.search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ width: '40%' }}
      />
      <Box sx={{ display: 'flex', gap: 2, width: '60%' }}>
        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          sx={{ flex: 1 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
        <TextField
          label="Year"
          select
          type="number"
          value={filters.year}
          onChange = {(e) => onFilterChange('year', e.target.value)}
          sx={{ flex: 1 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="2021">2021</MenuItem>
          <MenuItem value="2022">2022</MenuItem>
        </TextField>
        <TextField
          select
          label="Type"
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value || 'All')}
          sx={{ flex: 1 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Internship">Internship</MenuItem>
          <MenuItem value="FullTime">FullTime</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
};

export default PlacementFilters;
