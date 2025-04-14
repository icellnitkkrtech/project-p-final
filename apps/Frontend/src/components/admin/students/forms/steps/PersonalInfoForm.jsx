import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Button,
  Box
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const departments = [
  { value: 'CSE', label: 'Computer Science Engineering' },
  { value: 'ECE', label: 'Electronics & Communication Engineering' },
  { value: 'ME', label: 'Mechanical Engineering' },
  { value: 'CE', label: 'Civil Engineering' },
  { value: 'EE', label: 'Electrical Engineering' }
];

const PersonalInfoForm = ({ formData, onChange }) => {
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle photo upload
      onChange('photo', URL.createObjectURL(file));
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} display="flex" justifyContent="center">
        <Box position="relative">
          <Avatar
            src={formData.photo}
            sx={{ width: 100, height: 100 }}
          />
          <input
            accept="image/*"
            type="file"
            hidden
            id="photo-upload"
            onChange={handlePhotoUpload}
          />
          <label htmlFor="photo-upload">
            <Button
              component="span"
              variant="contained"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                minWidth: 'auto',
                p: 1
              }}
            >
              <PhotoCamera />
            </Button>
          </label>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Roll Number"
          value={formData.rollNumber || ''}
          disabled
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Department</InputLabel>
          <Select
            value={formData.department || ''}
            onChange={(e) => onChange('department', e.target.value)}
            label="Department"
          >
            {departments.map((dept) => (
              <MenuItem key={dept.value} value={dept.value}>
                {dept.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          select
          fullWidth
          label="gender"
          value={formData.gender || ''} // Note: Capital G
          onChange={(e) => onChange('gender', e.target.value)}
          required
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category || 'GENERAL'}
            onChange={(e) => onChange('category', e.target.value)}
            label="Category"
          >
            <MenuItem value="GENERAL">General</MenuItem>
            <MenuItem value="OBC">OBC</MenuItem>
            <MenuItem value="SC">SC</MenuItem>
            <MenuItem value="ST">ST</MenuItem>
            <MenuItem value="EWS">EWS</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Batch Year"
          type="number"
          value={formData.batch || ''}
          onChange={(e) => onChange('batch', e.target.value)}
          required
          helperText="Enter admission year (e.g., 2020)"
          inputProps={{
            min: 2000,
            max: 2099
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          multiline
          rows={3}
          value={formData.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export default PersonalInfoForm;