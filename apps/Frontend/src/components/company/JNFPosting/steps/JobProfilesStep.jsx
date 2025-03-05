import React from 'react';
import { motion } from 'framer-motion';
import {
  Box, Typography, TextField, Grid, Paper, Stack, Button, 
  IconButton, Tooltip, Card, FormControl, InputLabel, Select, MenuItem,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';

const JobProfilesStep = ({ formData, handleJobProfileChange }) => {
  const theme = useTheme();

  const handleAddNewJobProfile = () => {
    const nextIndex = Object.keys(formData.jobProfiles).length ;
    const newJobProfile = {
      [nextIndex]: [{
        course: 'btech',
        designation: '',
        jobDescription: '',
        ctc: '',
        takeHome: '',
        perks: '',
        trainingPeriod: '',
        placeOfPosting: ''
      }]
    };
    
    handleJobProfileChange({
      ...formData.jobProfiles,
      ...newJobProfile
    });
    
  };

  const handleAddCourseProfile = (profileIndex) => {
    const newProfile = {
      course: '',
      designation: '',
      jobDescription: '',
      ctc: '',
      takeHome: '',
      perks: '',
      trainingPeriod: '',
      placeOfPosting: ''
    };
    
    const updatedProfiles = {...formData.jobProfiles};
    updatedProfiles[profileIndex] = [...updatedProfiles[profileIndex], newProfile];
    handleJobProfileChange(updatedProfiles);
  };

  const handleRemoveJobProfile = (profileIndex) => {
    const updatedProfiles = {...formData.jobProfiles};
    delete updatedProfiles[profileIndex];
    handleJobProfileChange(updatedProfiles);
  };

  const handleRemoveCourseProfile = (profileIndex, courseIndex) => {
    if (formData.jobProfiles[profileIndex].length > 1) {
      const updatedProfiles = {...formData.jobProfiles};
      updatedProfiles[profileIndex] = updatedProfiles[profileIndex].filter((_, idx) => idx !== courseIndex);
      handleJobProfileChange(updatedProfiles);
    }
  };

  const handleProfileChange = (profileIndex, courseIndex, field, value) => {
    const updatedProfiles = {...formData.jobProfiles};
    updatedProfiles[profileIndex][courseIndex] = {
      ...updatedProfiles[profileIndex][courseIndex],
      [field]: value
    };
    handleJobProfileChange(updatedProfiles);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={600} color="primary">
          Job Profiles
        </Typography>
        <Button
          startIcon={<AddCircleIcon />}
          onClick={handleAddNewJobProfile}
          variant="contained"
          size="small"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { boxShadow: 1 }
          }}
        >
          Add New Job Profile
        </Button>
      </Box>

      <Stack spacing={4}>
        {Object.entries(formData.jobProfiles).map(([profileIndex, courseProfiles]) => (
          <Paper
            key={profileIndex}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography 
                variant="h6" 
                color="primary"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 600
                }}
              >
                <WorkIcon /> Job Profile {parseInt(profileIndex)+1}
              </Typography>
              <Box>
                <Tooltip title="Add course profile">
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddCourseProfile(profileIndex)}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      mr: 1,
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    Add Course
                  </Button>
                </Tooltip>
                {Object.keys(formData.jobProfiles).length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveJobProfile(profileIndex)}
                    sx={{
                      bgcolor: 'error.lighter',
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.light'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            <Stack spacing={3}>
              {courseProfiles.map((profile, courseIndex) => (
                <Card
                  key={courseIndex}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: courseIndex * 0.1 
                  }}
                  sx={{
                    position: 'relative',
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: theme => `0 0 0 1px ${theme.palette.primary.main}`,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      color="primary"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Course Profile {courseIndex + 1}
                    </Typography>
                    {courseIndex > 0 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveCourseProfile(profileIndex, courseIndex)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'error.lighter',
                          color: 'error.main',
                          border: '2px solid',
                          borderColor: 'background.paper',
                          '&:hover': {
                            bgcolor: 'error.light',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Course</InputLabel>
                        <Select
                          value={profile.course}
                          onChange={(e) => handleProfileChange(profileIndex, courseIndex, 'course', e.target.value)}
                          label="Course"
                        >
                          <MenuItem value="btech">B.Tech</MenuItem>
                          <MenuItem value="mtech">M.Tech</MenuItem>
                          <MenuItem value="mba">MBA</MenuItem>
                          <MenuItem value="mca">MCA</MenuItem>
                          <MenuItem value="msc">M.Sc</MenuItem>
                          <MenuItem value="phd">PhD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Designation"
                        value={profile.designation}
                        onChange={(e) => handleProfileChange(profileIndex, courseIndex, 'designation', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Job Description Attached</InputLabel>
                        <Select
                          value={profile.jobDescription}
                          onChange={(e) => handleProfileChange(profileIndex, courseIndex, 'jobDescription', e.target.value)}
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
                        type="number"
                        inputProps={{
                          step: "0.0001",
                          min: 0,
                          max: 10,
                        }}
                        value={profile.ctc || ''}
                        onChange={(e) => handleProfileChange(profileIndex, courseIndex, 'ctc', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Take Home Salary"
                        value={profile.takeHome}
                        onChange={(e) => handleProfileChange(profileIndex, courseIndex, 'takeHome', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Perks"
                        value={profile.perks}
                        onChange={(e) => handleProfileChange(profileIndex, courseIndex, 'perks', e.target.value)}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Training Period"
                        value={profile.trainingPeriod}
                        onChange={(e) => handleProfileChange(profileIndex, courseIndex, 'trainingPeriod', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Place of Posting"
                        value={profile.placeOfPosting}
                        onChange={(e) => handleProfileChange(profileIndex, courseIndex, 'placeOfPosting', e.target.value)}
                        required
                      />
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Stack>
          </Paper>
          
        ))}
      </Stack>
    </motion.div>
  );
};

export default JobProfilesStep;