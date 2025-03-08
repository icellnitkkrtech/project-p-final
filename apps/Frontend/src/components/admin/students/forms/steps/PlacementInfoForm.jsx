import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Card,
  CardContent,
  Box
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const PlacementInfoForm = ({ formData, onChange }) => {
  const handleInternshipChange = (index, field, value) => {
    const updatedInternships = [...(formData.internships || [])];
    updatedInternships[index] = {
      ...updatedInternships[index],
      [field]: value
    };
    onChange('internships', updatedInternships);
  };

  const addInternship = () => {
    const updatedInternships = [...(formData.internships || []), {
      company: '',
      role: '',
      duration: '',
      year: ''
    }];
    onChange('internships', updatedInternships);
  };

  const removeInternship = (index) => {
    const updatedInternships = formData.internships.filter((_, i) => i !== index);
    onChange('internships', updatedInternships);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Placement Status</InputLabel>
          <Select
            value={formData.status || ''}
            onChange={(e) => onChange('status', e.target.value)}
          >
            <MenuItem value="Placed">Placed</MenuItem>
            <MenuItem value="Unplaced">Unplaced</MenuItem>
            <MenuItem value="Not Eligible">Not Eligible</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {formData.status === 'Placed' && (
        <>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company"
              value={formData.company || ''}
              onChange={(e) => onChange('company', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Package (LPA)"
              value={formData.package || ''}
              onChange={(e) => onChange('package', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job Role"
              value={formData.jobRole || ''}
              onChange={(e) => onChange('jobRole', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
            />
          </Grid>
        </>
      )}

      {/* Internships Section */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Internships</Typography>
          <IconButton color="primary" onClick={addInternship}>
            <Add />
          </IconButton>
        </Box>

        {formData.internships?.map((internship, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <IconButton color="error" onClick={() => removeInternship(index)}>
                    <Delete />
                  </IconButton>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={internship.company}
                    onChange={(e) => handleInternshipChange(index, 'company', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={internship.role}
                    onChange={(e) => handleInternshipChange(index, 'role', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Duration"
                    value={internship.duration}
                    onChange={(e) => handleInternshipChange(index, 'duration', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    value={internship.year}
                    onChange={(e) => handleInternshipChange(index, 'year', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default PlacementInfoForm; 