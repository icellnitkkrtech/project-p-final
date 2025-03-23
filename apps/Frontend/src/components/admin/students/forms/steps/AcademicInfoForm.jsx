import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const AcademicInfoForm = ({ formData, onChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select
            value={formData.department || ''}
            onChange={(e) => onChange('department', e.target.value)}
          >
            <MenuItem value="CSE">Computer Science</MenuItem>
            <MenuItem value="ECE">Electronics</MenuItem>
            <MenuItem value="ME">Mechanical</MenuItem>
            <MenuItem value="CE">Civil</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Current Semester"
          type="number"
          value={formData.semester || ''}
          onChange={(e) => onChange('semester', e.target.value)}
          inputProps={{ min: 1, max: 8 }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="number"
          label="CGPA"
          value={formData.cgpa || ''}
          onChange={(e) => onChange('cgpa', e.target.value)}
          required
          inputProps={{ step: 0.01, min: 0, max: 10 }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Active Backlogs"
          type="number"
          value={formData.backlogs || ''}
          onChange={(e) => onChange('backlogs', e.target.value)}
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="number"
          label="10th Marks"
          value={formData.tenthMarks || ''}
          onChange={(e) => onChange('tenthMarks', e.target.value)}
          required
          inputProps={{ step: 0.01, min: 0, max: 100 }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="number"
          label="12th Marks"
          value={formData.twelfthMarks || ''}
          onChange={(e) => onChange('twelfthMarks', e.target.value)}
          required
          inputProps={{ step: 0.01, min: 0, max: 100 }}
        />
      </Grid>
    </Grid>
  );
};

export default AcademicInfoForm;