import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import useJNFData from '../../../hooks/admin/useJNFData';

const JNFFormPreview = ({ selectedJNF }) => {
  const theme = useTheme();
  const { getJNFById } = useJNFData();
  const [jnfPreview, setjnfPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJNFs = async () => {
      try {
        setLoading(true);
        const jnf = await getJNFById(selectedJNF._id);
        setjnfPreview(jnf);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedJNF?._id) {
      fetchJNFs();
    }
  }, [selectedJNF]);

  // Helper function for section titles
  const SectionTitle = ({ icon: Icon, title }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
      <Icon color="primary" />
      <Typography variant="h6" fontWeight={600} color="primary">
        {title}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!jnfPreview) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No JNF data available</Typography>
      </Box>
    );
  }

  const selectionProcessLabels = {
    technicalTest: 'Technical Test',
    technicalInterview: 'Technical Interview',
    hrInterview: 'HR Interview',
    accommodationRequired: 'Accommodation Required',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary" sx={{ mb: 3 }}>
        JNF Preview
      </Typography>
      
      <Stack spacing={4}>
        {/* Company Details */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <SectionTitle icon={BusinessIcon} title="Company Details" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
                  <Typography fontWeight={500}>{jnfPreview.companyDetails?.name || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography>{jnfPreview.companyDetails?.email || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                  <Typography>{jnfPreview.companyDetails?.website || 'N/A'}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Company Type</Typography>
                  <Typography>{jnfPreview.companyDetails?.companyType || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Domain</Typography>
                  <Typography>{jnfPreview.companyDetails?.domain || 'N/A'}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
              <Typography sx={{ mt: 0.5 }}>{jnfPreview.companyDetails?.description || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Job Profiles */}
        {jnfPreview.jobProfiles?.map((profile, index) => (
          <Paper 
            key={index} 
            elevation={1} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              position: 'relative'
            }}
          >
            <SectionTitle icon={WorkIcon} title={`Job Profile ${index + 1}`} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                    <Typography fontWeight={500}>{profile.designation || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                    <Typography>{profile.placeOfPosting || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Job Type</Typography>
                    <Typography>
                      {profile.jobType === 'fte' ? 'Full Time Employment' : 
                       profile.jobType === 'fteIntern' ? 'Full Time + Internship' : 
                       profile.jobType === 'internPpo' ? 'Internship with PPO' : 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">CTC</Typography>
                    <Typography fontWeight={500}>{profile.ctc ? `${profile.ctc / 100000} LPA` : 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Take Home</Typography>
                    <Typography>{profile.takeHome || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Training Period</Typography>
                    <Typography>{profile.trainingPeriod || 'N/A'}</Typography>
                  </Box>
                </Stack>
              </Grid>
              
              {/* Conditional internship details */}
              {(profile.jobType === 'fteIntern' || profile.jobType === 'internPpo') && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                      Internship Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Stipend</Typography>
                      <Typography>{profile.stipend ? `₹${profile.stipend}/month` : 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                      <Typography>{profile.INTERNDuration ? `${profile.INTERNDuration} months` : 'N/A'}</Typography>
                    </Box>
                  </Grid>
                </>
              )}
              
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Job Description</Typography>
                <Typography sx={{ mt: 0.5 }}>{profile.jobDescription?.description || 'N/A'}</Typography>
              </Grid>
            </Grid>
            
            {/* Eligible Branches for this profile */}
            {jnfPreview.eligibleBranchesForProfiles?.find(item => item.profileId === profile.profileId) && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" color="primary" fontWeight={500} gutterBottom>
                  Eligible Branches
                </Typography>
                {Object.entries(jnfPreview.eligibleBranchesForProfiles.find(item => item.profileId === profile.profileId).branches || {}).map(
                  ([course, branches]) => branches.some(b => b.eligible) && (
                    <Box key={course} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                        {course === 'btech' ? 'B.Tech' : 
                         course === 'mtech' ? 'M.Tech/MCA/MBA' : 
                         course === 'phd' ? 'PhD' : course}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                        {branches.filter(b => b.eligible).map((branch, i) => (
                          <Chip 
                            key={i}
                            label={branch.name || (branch.department + (branch.specialization ? ` - ${branch.specialization}` : ''))} 
                            size="small" 
                            icon={<CheckIcon fontSize="small" />}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )
                )}
              </>
            )}
            
            {/* Selection Process for this profile */}
            {jnfPreview.selectionProcessForProfiles?.find(item => item.profileId === profile.profileId) && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" color="primary" fontWeight={500} gutterBottom>
                  Selection Process
                </Typography>
                <List>
                  {jnfPreview.selectionProcessForProfiles.find(item => item.profileId === profile.profileId).rounds.map((round, idx) => (
                    <ListItem key={idx} sx={{ px: 1 }}>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Round ${idx + 1}: ${selectionProcessLabels[round.type] || round.type}`}
                        secondary={round.details}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2, ml: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Expected Recruits</Typography>
                      <Typography>
                        {jnfPreview.selectionProcessForProfiles.find(item => item.profileId === profile.profileId).expectedRecruits || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Tentative Date</Typography>
                      <Typography>
                        {jnfPreview.selectionProcessForProfiles.find(item => item.profileId === profile.profileId).tentativeDate 
                          ? new Date(jnfPreview.selectionProcessForProfiles.find(item => item.profileId === profile.profileId).tentativeDate).toLocaleDateString() 
                          : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Paper>
        ))}

        {/* Eligibility Criteria */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <SectionTitle icon={SchoolIcon} title="Eligibility Criteria" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Minimum CGPA</Typography>
                <Typography fontWeight={500}>{jnfPreview.eligibilityCriteria?.minCgpa || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">No Active Backlogs</Typography>
                <Typography>
                  {jnfPreview.eligibilityCriteria?.backlogAllowed === false 
                    ? 'Not Allowed' 
                    : jnfPreview.eligibilityCriteria?.backlogAllowed > 0 
                      ? `Up to ${jnfPreview.eligibilityCriteria.backlogAllowed} backlog(s) allowed`
                      : 'Allowed'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Bond Details */}
        {jnfPreview.bondDetails && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <SectionTitle icon={InfoIcon} title="Bond Details" />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Bond Duration</Typography>
                  <Typography>{jnfPreview.bondDetails?.duration || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Penalty</Typography>
                  <Typography>{jnfPreview.bondDetails?.penaltyAmount || 'N/A'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Point of Contact */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <SectionTitle icon={InfoIcon} title="Point of Contact" />
          {jnfPreview.pointOfContact?.map((contact, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider sx={{ my: 3 }} />}
              <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                Contact Person {index + 1}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                      <Typography fontWeight={500}>{contact.name || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                      <Typography>{contact.designation || 'N/A'}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                      <Typography>{contact.email || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                      <Typography>{contact.mobile || 'N/A'}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
        </Paper>
        
        {/* Additional Information */}
        {jnfPreview.additionalInfo && Object.values(jnfPreview.additionalInfo).some(value => value) && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <SectionTitle icon={InfoIcon} title="Additional Information" />
            <Grid container spacing={3}>
              {jnfPreview.additionalInfo.sponsorEvents && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Sponsor Events</Typography>
                    <Typography>{jnfPreview.additionalInfo.sponsorEvents}</Typography>
                  </Box>
                </Grid>
              )}
              {jnfPreview.additionalInfo.accommodationRequired && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Accommodation Required</Typography>
                    <Typography>{jnfPreview.additionalInfo.accommodationRequired}</Typography>
                  </Box>
                </Grid>
              )}
              {jnfPreview.additionalInfo.internshipDuration && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Internship Duration</Typography>
                    <Typography>{jnfPreview.additionalInfo.internshipDuration}</Typography>
                  </Box>
                </Grid>
              )}
              {jnfPreview.additionalInfo.contests && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Contests</Typography>
                    <Typography>{jnfPreview.additionalInfo.contests}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}
      </Stack>
    </motion.div>
  );
};

export default JNFFormPreview;