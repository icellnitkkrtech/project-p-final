import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Stack,
  useTheme,
  ListItemText,
  Chip
} from '@mui/material';
import {
  KeyboardArrowDown as ArrowDownIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const JobProfilesStep = ({ formData, handleJobProfileChange }) => {
  const theme = useTheme();
  const courses = formData.jobProfiles.map(profile => profile.course);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleCourseSelection = (event) => {
    const { value } = event.target;
    setSelectedCourses(value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        minWidth: 180, // Minimum width
        maxWidth: 400, // Maximum width
      },
      elevation: 3
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
  };

  const displayedCourses = courses.filter(course => selectedCourses.includes(course));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
        Job Details
      </Typography>

      <Stack spacing={3}>
        {/* Course Selection */}
        <FormControl 
          sx={{
            width: selectedCourses.length > 0 ? 'fit-content' : 200,
            minWidth: 200,
            transition: 'width 0.3s ease',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                '& > fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '2px'
                }
              }
            }
          }}
        >
          <InputLabel id="course-select-label">Select Courses</InputLabel>
          <Select
            labelId="course-select-label"
            multiple
            value={selectedCourses}
            onChange={handleCourseSelection}
            label="Select Courses"
            MenuProps={MenuProps}
            IconComponent={ArrowDownIcon}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    sx={{
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            )}
          >
            {courses.map((course) => (
              <MenuItem 
                key={course} 
                value={course}
                sx={{
                  mx: 0.5,
                  my: 0.25,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'primary.main',
                    }
                  }
                }}
              >
                <ListItemText 
                  primary={course}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: selectedCourses.includes(course) ? 600 : 400
                    }
                  }}
                />
                {selectedCourses.includes(course) && (
                  <CheckIcon 
                    fontSize="small" 
                    sx={{ 
                      ml: 1,
                      color: selectedCourses.includes(course) ? 'white' : 'primary.main'
                    }} 
                  />
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Job Profiles */}
        {displayedCourses.map((course) => {
          const currentProfile = formData.jobProfiles.find(p => p.course === course) || {};
          const courseIndex = formData.jobProfiles.findIndex(p => p.course === course);

          return (
            <Paper
              key={course}
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" gutterBottom color="primary" sx={{ textTransform: 'capitalize' }}>
                {course}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Designation"
                    value={currentProfile.designation || ''}
                    onChange={(e) => handleJobProfileChange(courseIndex, 'designation', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Job Description Attached</InputLabel>
                    <Select
                      value={currentProfile.description || 'false'}
                      onChange={(e) => handleJobProfileChange(courseIndex, 'description', e.target.value)}
                      label="Job Description Attached"
                    >
                      <MenuItem value="false">No</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CTC"
                    value={currentProfile.ctc || ''}
                    onChange={(e) => handleJobProfileChange(courseIndex, 'ctc', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Take Home Salary"
                    value={currentProfile.takeHome || ''}
                    onChange={(e) => handleJobProfileChange(courseIndex, 'takeHome', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Perks"
                    value={currentProfile.perks || ''}
                    onChange={(e) => handleJobProfileChange(courseIndex, 'perks', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Training Period"
                    value={currentProfile.trainingPeriod || ''}
                    onChange={(e) => handleJobProfileChange(courseIndex, 'trainingPeriod', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Place of Posting"
                    value={currentProfile.placeOfPosting || ''}
                    onChange={(e) => handleJobProfileChange(courseIndex, 'placeOfPosting', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </Stack>
    </motion.div>
  );
};

export default JobProfilesStep;