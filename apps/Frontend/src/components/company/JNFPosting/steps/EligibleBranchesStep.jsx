import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Paper,
  Grid,
  Stack,
  useTheme,
  Divider,
  Card,
  InputAdornment,
  IconButton,
  Collapse
} from '@mui/material';
import { 
  WorkOutlined as JobIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon 
} from '@mui/icons-material';

const EligibleBranchesStep = ({ formData, handleEligibleBranchChange, handleEligibilityCriteria }) => {
  const theme = useTheme();
  
  // State to track expanded profiles (all collapsed by default)
  const [expandedProfiles, setExpandedProfiles] = useState({});
  
  // Toggle expansion of a profile
  const toggleProfileExpansion = (profileId) => {
    setExpandedProfiles(prev => ({
      ...prev,
      [profileId]: !prev[profileId]
    }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
        Eligible Branches and Criteria
      </Typography>
      
      {/* Global Eligibility Criteria */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Typography variant="h6" gutterBottom color="primary">
          Eligibility Criteria
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Minimum CGPA"
              type="number"
              InputProps={{
                inputProps: { min: 0, max: 10, step: 0.1 },
                endAdornment: <InputAdornment position="end">/10</InputAdornment>,
              }}
              value={formData.eligibilityCriteria.minCgpa}
              onChange={(e) => handleEligibilityCriteria('minCgpa', e.target.value)}
              variant="outlined"
              placeholder="Enter minimum CGPA required"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Backlogs Allowed"
              type="number"
              InputProps={{ 
                inputProps: { min: 0 }
              }}
              value={formData.eligibilityCriteria.backlogAllowed}
              onChange={(e) => handleEligibilityCriteria('backlogAllowed', e.target.value)}
              variant="outlined"
              placeholder="Enter number of backlogs allowed"
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Per Profile Branch Selection */}
      <Stack spacing={2}>
        {formData.jobProfiles.map((jobProfile, profileIndex) => {
          // Find the corresponding eligibleBranchesForProfile entry
          const eligibleBranchesData = formData.eligibleBranchesForProfiles.find(
            item => item.profileId === jobProfile.profileId
          ) || { branches: { btech: [], mtech: [], phd: [] } };
          
          const isExpanded = expandedProfiles[jobProfile.profileId] || false;
          
          return (
            <Card
              key={jobProfile.profileId}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: profileIndex * 0.1 }}
              sx={{
                p: 0,
                overflow: 'hidden',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              {/* Header for job profile with toggle button */}
              <Box
                sx={{
                  p: 2,
                  // bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
                onClick={() => toggleProfileExpansion(jobProfile.profileId)}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <JobIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                    Job Profile {profileIndex + 1}: {jobProfile.designation || 'New Position'}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ transition: 'transform 0.3s' }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={isExpanded}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* B.Tech Section */}
                    <Paper elevation={0} sx={{ p: 2, border: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Under Graduate Programme (B. Tech.)
                      </Typography>
                      <Grid container spacing={2}>
                        {eligibleBranchesData.branches.btech.map((branch, index) => (
                          <Grid item xs={12} sm={6} key={`btech-${index}`}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={branch.eligible}
                                  onChange={(e) => handleEligibleBranchChange(
                                    jobProfile.profileId,
                                    'btech',
                                    index,
                                    e.target.checked
                                  )}
                                  color="primary"
                                />
                              }
                              label={branch.name}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '0.95rem'
                                }
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>

                    {/* M.Tech/MCA/MBA Section */}
                    <Paper elevation={0} sx={{ p: 2, border: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Post Graduate Programme (M Tech./MCA/MBA)
                      </Typography>
                      <Grid container spacing={2}>
                        {eligibleBranchesData.branches.mtech.map((branch, index) => (
                          <Grid item xs={12} sm={6} key={`mtech-${index}`}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={branch.eligible}
                                  onChange={(e) => handleEligibleBranchChange(
                                    jobProfile.profileId,
                                    'mtech',
                                    index,
                                    e.target.checked
                                  )}
                                  color="primary"
                                />
                              }
                              label={branch.specialization ? `${branch.department} - ${branch.specialization}` : branch.department}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '0.95rem'
                                }
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>

                    {/* PhD Section */}
                    <Paper elevation={0} sx={{ p: 2, border: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Doctorate Programme (PhD)
                      </Typography>
                      <Grid container spacing={2}>
                        {eligibleBranchesData.branches.phd.map((branch, index) => (
                          <Grid item xs={12} sm={6} key={`phd-${index}`}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={branch.eligible}
                                  onChange={(e) => handleEligibleBranchChange(
                                    jobProfile.profileId,
                                    'phd',
                                    index,
                                    e.target.checked
                                  )}
                                  color="primary"
                                />
                              }
                              label={`${branch.department} - ${branch.specialization}`}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '0.95rem'
                                }
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Stack>
                </Box>
              </Collapse>

              {/* Summary when collapsed */}
              {!isExpanded && (
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    {countSelectedBranches(eligibleBranchesData)} branches selected
                  </Typography>
                </Box>
              )}
            </Card>
          );
        })}
      </Stack>
    </motion.div>
  );
};

// Helper function to count selected branches
const countSelectedBranches = (profileBranches) => {
  if (!profileBranches || !profileBranches.branches) return 0;
  
  const { btech = [], mtech = [], phd = [] } = profileBranches.branches;
  
  const selectedCount = 
    btech.filter(b => b.eligible).length +
    mtech.filter(b => b.eligible).length +
    phd.filter(b => b.eligible).length;
  
  return selectedCount;
};

export default EligibleBranchesStep;