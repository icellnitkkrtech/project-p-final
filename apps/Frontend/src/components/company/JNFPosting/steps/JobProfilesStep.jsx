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
    // Create new profile with unique ID
    const newProfileId = `profile-${formData.jobProfiles.length}`;
    const newJobProfile = {
      profileId: newProfileId,
      course: 'btech',
      designation: '',
      jobDescription: {
        description: '',
        attachFile: false,
        file: ''
      },
      ctc: '',
      takeHome: '',
      perks: '',
      trainingPeriod: '',
      placeOfPosting: '',
      jobType: 'fte'
    };
    
    // Update formData in parent component
    // This will now handle creating corresponding entries for eligibleBranchesForProfiles and selectionProcessForProfiles
    handleJobProfileChange([...formData.jobProfiles, newJobProfile]);
  };

  const handleRemoveJobProfile = (profileIndex) => {
    const updatedProfiles = [...formData.jobProfiles];
    updatedProfiles.splice(profileIndex, 1);
    handleJobProfileChange(updatedProfiles);
  };

  const handleProfileChange = (profileIndex, field, value) => {
    const updatedProfiles = [...formData.jobProfiles];
    
    if (field === 'jobDescription') {
      // Handle jobDescription object structure
      updatedProfiles[profileIndex].jobDescription = {
        ...updatedProfiles[profileIndex].jobDescription,
        description: value
      };
    } else if (field === 'attachFile') {
      // Handle attachment boolean
      updatedProfiles[profileIndex].jobDescription = {
        ...updatedProfiles[profileIndex].jobDescription,
        attachFile: value
      };
    } else if (field === 'file') {
      // Handle file upload
      updatedProfiles[profileIndex].jobDescription = {
        ...updatedProfiles[profileIndex].jobDescription,
        file: value
      };
    } else {
      // Handle regular fields
      updatedProfiles[profileIndex][field] = value;
    }
    
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
        {formData.jobProfiles.map((profile, profileIndex) => (
          <Paper
            key={profile.profileId}
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
                <WorkIcon /> Job Profile {profileIndex+1}
              </Typography>
              <Box>
                {formData.jobProfiles.length > 1 && (
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

            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15
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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={profile.course}
                      onChange={(e) => handleProfileChange(profileIndex, 'course', e.target.value)}
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
                    onChange={(e) => handleProfileChange(profileIndex, 'designation', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Job Description Attached</InputLabel>
                    <Select
                      value={profile.jobDescription.attachFile ? "true" : "false"}
                      onChange={(e) => handleProfileChange(profileIndex, 'attachFile', e.target.value === "true")}
                      label="Job Description Attached"
                    >
                      <MenuItem value="false">No</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {profile.jobDescription.attachFile && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" color="text.secondary">
                        Upload Job Description
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          sx={{ 
                            borderRadius: 1,
                            textTransform: 'none'
                          }}
                        >
                          Choose File
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                // Convert to base64 or handle file upload as needed
                                handleProfileChange(profileIndex, 'file', e.target.files[0].name);
                              }
                            }}
                          />
                        </Button>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {profile.jobDescription.file ? profile.jobDescription.file : 'No file chosen'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      value={profile.jobType || 'fte'}
                      onChange={(e) => handleProfileChange(profileIndex, 'jobType', e.target.value)}
                      label="Job Type"
                    >
                      <MenuItem value="fte">FTE</MenuItem>
                      <MenuItem value="fteIntern">FTE+Intern</MenuItem>
                      <MenuItem value="internPpo">Intern+PPO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {(profile.jobType === 'fteIntern' || profile.jobType === 'internPpo') && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Intern Stipend"
                        type="number"
                        inputProps={{
                          min: 0,
                        }}
                        value={profile.stipend || ''}
                        onChange={(e) => handleProfileChange(profileIndex, 'stipend', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Internship Duration (months)"
                        type="number"
                        inputProps={{
                          min: 1,
                          max: 12,
                          step: 1
                        }}
                        value={profile.INTERNDuration || ''}
                        onChange={(e) => handleProfileChange(profileIndex, 'INTERNDuration', e.target.value)}
                        required
                      />
                    </Grid>
                  </>
                )}
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
                    onChange={(e) => handleProfileChange(profileIndex, 'ctc', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Take Home Salary"
                    type="number"
                    value={profile.takeHome || ''}
                    onChange={(e) => handleProfileChange(profileIndex, 'takeHome', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Perks"
                    value={profile.perks || ''}
                    onChange={(e) => handleProfileChange(profileIndex, 'perks', e.target.value)}
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Training Period"
                    value={profile.trainingPeriod || ''}
                    onChange={(e) => handleProfileChange(profileIndex, 'trainingPeriod', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Place of Posting"
                    value={profile.placeOfPosting || ''}
                    onChange={(e) => handleProfileChange(profileIndex, 'placeOfPosting', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            </Card>
          </Paper>
        ))}
      </Stack>
    </motion.div>
  );
};

export default JobProfilesStep;