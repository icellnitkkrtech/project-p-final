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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!jnfPreview) return <Typography>No data found</Typography>;

  const SectionTitle = ({ icon: Icon, title }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
      <Icon color="primary" />
      <Typography variant="h6" color="primary" fontWeight={600}>
        {title}
      </Typography>
    </Stack>
  );

  const selectionProcessLabels = {
    resumeShortlisting: 'Resume Shortlisting',
    prePlacementTalk: 'Pre-Placement Talk',
    groupDiscussion: 'Group Discussion',
    onlineTest: 'Online Test',
    aptitudeTest: 'Aptitude Test',
    technicalTest: 'Technical Test',
    technicalInterview: 'Technical Interview',
    hrInterview: 'HR Interview',
    accommodationRequired: 'Accommodation Required',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Stack spacing={4}>

        {/* Company Details */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={BusinessIcon} title="Company Details" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
                  <Typography>{jnfPreview.companyDetails?.name || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography>{jnfPreview.companyDetails?.email || 'N/A'}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                  <Typography>{jnfPreview.companyDetails?.website || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Company Type</Typography>
                  <Typography>{jnfPreview.companyDetails?.companyType || 'N/A'}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
              <Typography>{jnfPreview.companyDetails?.description || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Job Profiles */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={WorkIcon} title="Job Profiles" />
          <Grid container spacing={3}>
            {jnfPreview.jobProfiles?.map((profile, index) => (
              <Grid item xs={12} key={index}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                        <Typography>{profile.designation || 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                        <Typography>{profile.placeOfPosting || 'N/A'}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">CTC</Typography>
                        <Typography>{profile.ctc ? `${profile.ctc / 100000} LPA` : 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Take Home</Typography>
                        <Typography>{profile.takeHome ? `${profile.takeHome / 100000} LPA` : 'N/A'}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Job Description</Typography>
                    <Typography>{profile.jobDescription?.description || 'N/A'}</Typography>
                  </Grid>
                </Grid>
                {index < jnfPreview.jobProfiles.length - 1 && <Divider sx={{ my: 2 }} />}
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Eligibility Criteria */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={SchoolIcon} title="Eligibility Criteria" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Minimum CGPA</Typography>
                <Typography>{jnfPreview.eligibilityCriteria?.minCgpa || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">No Active Backlogs</Typography>
                <Typography>{jnfPreview.eligibilityCriteria?.backlogAllowed === false ? 'Not Allowed' : 'Allowed'}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Eligible Branches */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={SchoolIcon} title="Eligible Courses & Branches" />
          {jnfPreview.eligibleBranchesForProfiles?.map((item, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              {Object.entries(item.branches).map(([course, branches]) => (
                branches?.length > 0 && (
                  <Box key={course} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">{course.toUpperCase()}</Typography>
                    <Typography>{branches.map(b => b.name).join(', ') || 'N/A'}</Typography>
                  </Box>
                )
              ))}
            </Box>
          ))}
        </Paper>

        {/* Selection Process */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={AssignmentIcon} title="Selection Process" />
          <List>
            {jnfPreview.selectionProcessForProfiles?.map((process, i) => (
              <Box key={i}>
                {process.rounds.map((round, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={selectionProcessLabels[round.type] || round.type}
                      secondary={round.details}
                    />
                  </ListItem>
                ))}
                <Box sx={{ mt: 2, ml: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Expected Recruits</Typography>
                  <Typography>{process.expectedRecruits || 'N/A'}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Tentative Date</Typography>
                  <Typography>{process.tentativeDate ? new Date(process.tentativeDate).toLocaleDateString() : 'N/A'}</Typography>
                </Box>
              </Box>
            ))}
          </List>
        </Paper>

        {/* Bond Details */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={InfoIcon} title="Bond Details" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Bond Duration</Typography>
                <Typography>{jnfPreview.bondDetails?.bondDuration || 'N/A'}</Typography>
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

        {/* Point of Contact */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={InfoIcon} title="Point of Contact" />
          {jnfPreview.pointOfContact?.map((contact, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Typography>{contact.name || 'N/A'}</Typography>
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
          ))}
        </Paper>

      </Stack>
    </motion.div>
  );
};

export default JNFFormPreview;