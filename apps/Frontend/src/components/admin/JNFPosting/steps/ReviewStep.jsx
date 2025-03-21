import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Chip,
  Avatar
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const ReviewStep = ({ formData }) => {
  const theme = useTheme();
  
  // Helper function to get eligible branches for a profile
  const getEligibleBranches = (profileId) => {
    const profileBranches = formData.eligibleBranchesForProfiles.find(
      p => p.profileId === profileId
    );
    
    if (!profileBranches) return {};
    
    const result = {};
    
    // Process B.Tech branches
    const btechBranches = profileBranches.branches.btech
      .filter(b => b.eligible)
      .map(b => b.name);
    
    if (btechBranches.length > 0) {
      result.btech = btechBranches;
    }
    
    // Process M.Tech branches
    const mtechBranches = profileBranches.branches.mtech
      .filter(b => b.eligible)
      .map(b => b.specialization 
        ? `${b.department} - ${b.specialization}` 
        : b.department
      );
    
    if (mtechBranches.length > 0) {
      result.mtech = mtechBranches;
    }
    
    // Process PhD branches
    const phdBranches = profileBranches.branches.phd
      .filter(b => b.eligible)
      .map(b => `${b.department} - ${b.specialization}`);
    
    if (phdBranches.length > 0) {
      result.phd = phdBranches;
    }
    
    return result;
  };
  
  // Get selection process rounds for a profile
  const getSelectionProcess = (profileId) => {
    const profileProcess = formData.selectionProcessForProfiles.find(
      p => p.profileId === profileId
    );
    
    if (!profileProcess) return { rounds: [], info: {} };
    
    // Mapping of selection process keys to user-friendly labels
    const roundLabels = {
      resumeShortlisting: 'Resume Shortlisting',
      prePlacementTalk: 'Pre-Placement Talk',
      groupDiscussion: 'Group Discussion',
      onlineTest: 'Online Test',
      aptitudeTest: 'Aptitude Test',
      technicalTest: 'Technical Test',
      technicalInterview: 'Technical Interview',
      hrInterview: 'HR Interview',
      otherRounds: 'Other Rounds'
    };
    
    // Transform rounds to user-friendly format, excluding otherRounds
    const regularRounds = profileProcess.rounds
      .filter(round => round.type !== 'otherRounds')
      .map(round => ({
        label: roundLabels[round.type] || round.type,
        type: round.type
      }));
    
    // Get otherRounds entry separately if it exists
    const otherRoundsEntry = profileProcess.rounds.find(round => round.type === 'otherRounds');
    
    return {
      regularRounds,
      otherRoundsEntry,
      info: {
        expectedRecruits: profileProcess.expectedRecruits,
        tentativeDate: profileProcess.tentativeDate
      }
    };
  };

  const SectionTitle = ({ icon: Icon, title }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
      <Icon color="primary" />
      <Typography variant="h6" color="primary" fontWeight={600}>
        {title}
      </Typography>
    </Stack>
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
        Review Your Submission
      </Typography>

      <Stack spacing={4}>
        {/* Company Details */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={BusinessIcon} title="Company Details" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
                  <Typography>{formData.companyDetails?.name || 'Not specified'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography>{formData.companyDetails?.email || 'Not specified'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                  <Typography>{formData.companyDetails?.website || 'Not specified'}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Company Type</Typography>
                  <Typography>{formData.companyDetails?.companyType || 'Not specified'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Domain</Typography>
                  <Typography>{formData.companyDetails?.domain || 'Not specified'}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
              <Typography>{formData.companyDetails?.description || 'Not specified'}</Typography>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Job Profiles Section */}
        {formData.jobProfiles?.length > 0 && formData.jobProfiles.map((profile, index) => (
          <Paper 
            elevation={1} 
            sx={{ p: 3, borderRadius: 2 }} 
            key={profile.profileId}
          >
            <SectionTitle icon={WorkIcon} title={`Job Profile ${index + 1}: ${profile.designation || 'New Position'}`} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Course</Typography>
                    <Typography sx={{ textTransform: 'uppercase' }}>{profile.course || 'Not specified'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                    <Typography>{profile.designation || 'Not specified'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Job Type</Typography>
                    <Chip 
                      label={profile.jobType === 'fte' ? 'Full Time Employment' : 
                             profile.jobType === 'fteIntern' ? 'Full Time + Internship' : 
                             profile.jobType === 'internPpo' ? 'Internship with PPO' : 'Not specified'}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">CTC</Typography>
                    <Typography>{profile.ctc ? `${profile.ctc} LPA` : 'Not specified'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Take Home</Typography>
                    <Typography>{profile.takeHome ? `${profile.takeHome} LPA` : 'Not specified'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Place of Posting</Typography>
                    <Typography>{profile.placeOfPosting || 'Not specified'}</Typography>
                  </Box>
                </Stack>
              </Grid>
              
              {/* Conditional fields based on job type */}
              {(profile.jobType === 'fteIntern' || profile.jobType === 'internPpo') && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
                      Internship Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Stipend</Typography>
                      <Typography>{profile.stipend ? `₹${profile.stipend}/month` : 'Not specified'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                      <Typography>{profile.INTERNDuration ? `${profile.INTERNDuration} months` : 'Not specified'}</Typography>
                    </Box>
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
                  Additional Job Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Perks</Typography>
                  <Typography>{profile.perks || 'Not specified'}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Training Period</Typography>
                  <Typography>{profile.trainingPeriod || 'Not specified'}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Job Description</Typography>
                <Typography>
                  {profile.jobDescription?.description || profile.jobDescription?.file || 'Not specified'}
                </Typography>
              </Grid>
              
              {/* Eligible Branches Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <SectionTitle icon={SchoolIcon} title="Eligible Branches" />
                
                {Object.entries(getEligibleBranches(profile.profileId)).map(([program, branches]) => (
                  <Box key={program} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, textTransform: 'uppercase' }}>
                      {program === 'btech' ? 'B.Tech' : 
                       program === 'mtech' ? 'M.Tech/MCA/MBA' : 
                       program === 'phd' ? 'PhD' : program}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {branches.map((branch, i) => (
                        <Chip 
                          key={i}
                          label={branch} 
                          size="small" 
                          icon={<CheckIcon fontSize="small" />}
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
                
                {Object.keys(getEligibleBranches(profile.profileId)).length === 0 && (
                  <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No branches selected for this profile
                  </Typography>
                )}
              </Grid>
              
              {/* Selection Process Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <SectionTitle icon={AssignmentIcon} title="Selection Process" />
                
                {(() => {
                  const selectionProcess = getSelectionProcess(profile.profileId);
                  
                  if (selectionProcess.regularRounds.length === 0 && !selectionProcess.otherRoundsEntry) {
                    return (
                      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No selection process specified for this profile
                      </Typography>
                    );
                  }
                  
                  return (
                    <>
                      {/* Simple numbered list of rounds */}
                      {selectionProcess.regularRounds.length > 0 && (
                        <List>
                          {selectionProcess.regularRounds.map((round, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Typography
                                  variant="body2"
                                  fontWeight="500"
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'primary.main',
                                    color: 'white'
                                  }}
                                >
                                  {index + 1}
                                </Typography>
                              </ListItemIcon>
                              <ListItemText primary={round.label} />
                            </ListItem>
                          ))}
                        </List>
                      )}
                      
                      {/* Other rounds details if any */}
                      {selectionProcess.otherRoundsEntry && (
                        <Box sx={{ mt: 1, mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Other Rounds:
                          </Typography>
                          <Typography variant="body2" sx={{ pl: 2 }}>
                            {selectionProcess.otherRoundsEntry.details || 'No details provided'}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Recruitment details */}
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Expected Number of Recruits
                            </Typography>
                            <Typography>
                              {selectionProcess.info.expectedRecruits || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Tentative Date
                            </Typography>
                            <Typography>
                              {formatDate(selectionProcess.info.tentativeDate)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  );
                })()}
              </Grid>
            </Grid>
          </Paper>
        ))}

        {/* Eligibility Criteria */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={SchoolIcon} title="Eligibility Criteria" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Minimum CGPA</Typography>
              <Typography>
                {formData.eligibilityCriteria?.minCgpa ? `${formData.eligibilityCriteria.minCgpa}/10` : 'Not specified'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Backlogs Allowed</Typography>
              <Typography>
                {formData.eligibilityCriteria?.backlogAllowed !== undefined ? 
                 Number(formData.eligibilityCriteria.backlogAllowed) === 0 ? 
                 'No backlogs allowed' : `Up to ${formData.eligibilityCriteria.backlogAllowed} backlog(s) allowed` 
                 : 'Not specified'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Additional Details */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={InfoIcon} title="Additional Details" />
          
          <Grid container spacing={3}>
            {/* Bond Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Bond Details</Typography>
              {formData.bondDetails?.hasBond ? (
                <Typography>{formData.bondDetails.details}</Typography>
              ) : (
                <Typography>No bond</Typography>
              )}
            </Grid>
            
            {/* Additional Info */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Additional Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Sponsor Events</Typography>
                  <Typography>{formData.additionalInfo?.sponsorEvents || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Internship Offered</Typography>
                  <Typography>{formData.additionalInfo?.internshipOffered || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Internship Duration</Typography>
                  <Typography>{formData.additionalInfo?.internshipDuration || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Contests</Typography>
                  <Typography>{formData.additionalInfo?.contests || 'Not specified'}</Typography>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Point of Contact */}
            {formData.pointOfContact?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Point of Contact</Typography>
                <Stack spacing={2}>
                  {formData.pointOfContact.map((contact, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                          <Typography>{contact.name || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                          <Typography>{contact.designation || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                          <Typography>{contact.mobile || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                          <Typography>{contact.email || 'Not specified'}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Stack>
    </motion.div>
  );
};

export default ReviewStep;