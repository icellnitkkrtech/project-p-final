import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const PlacementFilters = ({ 
  filters, 
  onFilterChange,
  companies = ['All'],
  statuses = ['All'],
  years = ['All']
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        sx={{ minWidth: 200 }}
      />

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Company</InputLabel>
        <Select
          value={filters.company}
          label="Company"
          onChange={(e) => onFilterChange('company', e.target.value)}
        >
          {companies.map(company => (
            <MenuItem key={company} value={company}>
              {company}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          {statuses.map(status => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={filters.year}
          label="Year"
          onChange={(e) => onFilterChange('year', e.target.value)}
        >
          {years.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default PlacementFilters; 