import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import useJNFData from '../../../hooks/admin/useJNFData';

const JNFFormPreview = ({ selectedJNF }) => {
  const theme = useTheme();
  const {getJNFById} = useJNFData();
    
  const [jnfPreview, setjnfPreview] = useState([]);
  
    // Add state for JNF selection  
    useEffect(() => {
      const fetchJNFs = async () => {
        const jnf = await getJNFById(selectedJNF.id);
        setjnfPreview(jnf);
      };
      fetchJNFs();
    }, [selectedJNF]);

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;
  if (!jnfPreview) return <Typography>No data found</Typography>;

    const SectionTitle = ({ icon: Icon, title }) => (
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Icon color="primary" />
        <Typography variant="h6" color="primary" fontWeight={600}>
          {title}
        </Typography>
      </Stack>
    );

     // Mapping of selection process keys to user-friendly labels
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
                              <Typography>{jnfPreview.name || 'N/A'}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                              <Typography>{jnfPreview.email || 'N/A'}</Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                              <Typography>{jnfPreview.website || 'N/A'}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Company Type</Typography>
                              <Typography>{jnfPreview.companyType || 'N/A'}</Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                          <Typography>{jnfPreview.description || 'N/A'}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Job Profiles */}
                      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                        <SectionTitle icon={WorkIcon} title="Job Profiles" />
                        <Grid>
                          {jnfPreview.jobProfiles?.map((profile) => (
                              <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Job Profile</Typography>
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
                                    <Typography>{profile.ctc} LPA</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Take Home Salary</Typography>
                                    <Typography>{profile.takeHome || 'N/A'}</Typography>
                                  </Box>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Training Period</Typography>
                                    <Typography>{profile.trainingPeriod || 'N/A'}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Perks</Typography>
                                    <Typography>{profile.perks || 'N/A'}</Typography>
                                  </Box>
                                </Stack>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                                <Typography>{profile.jobDescription || 'N/A'}</Typography>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>

                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <SectionTitle icon={SchoolIcon} title="Courses & Branches" />
                    <Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    B.Tech
                                </Typography>
                                <Typography>CS, IT, EC, EE</Typography>
                                </Box>
                                <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                       MBA
                                </Typography>
                                <Typography>All Branches</Typography>
                                </Box>
                                <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Eligibility Criteria
                                </Typography>
                                <Typography>CGPA greater than 7.5 with No Active BackLogs</Typography>
                                </Box>
                            </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    </Paper>
                    
                   {/* Selection Process */}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <SectionTitle icon={AssignmentIcon} title="Selection Process" />
                    <List>
                        {jnfPreview.selectionProcess &&
                        Object.entries(jnfPreview.selectionProcess) // Convert object to key-value pairs
                            .filter(([_, value]) => value === true) // Only keep true values
                            .map(([key], index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                <CheckIcon color="success" />
                                </ListItemIcon>
                                <ListItemText primary={selectionProcessLabels[key] || key} />
                            </ListItem>
                            ))}
                    </List>
                        <Grid item xs={12} md={6} ml={2}>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Expected Recruits</Typography>
                                    <Typography>{jnfPreview.selectionProcess?.expectedRecruits || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">TentativeDate</Typography>
                                    <Typography>{jnfPreview.selectionProcess?.tentativeDate || 'N/A'}</Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Paper>

                    {/*Bond Details & POC*/}
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <SectionTitle icon={InfoIcon} title="Bond Details & POC" />
                    <Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Bond Details
                                </Typography>
                                <Typography>{jnfPreview.bondDetails || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Name
                                </Typography>
                                <Typography>{jnfPreview.pointOfContact?.name || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Designation
                                </Typography>
                                <Typography>{jnfPreview.pointOfContact?.designation || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Mobile
                                </Typography>
                                <Typography>{jnfPreview.pointOfContact?.mobile || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Email
                                </Typography>
                                <Typography>{jnfPreview.pointOfContact?.email || 'N/A'}</Typography>
                                </Box>
                            </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    </Paper>
            </Stack>
    </motion.div>
  );
};

export default JNFFormPreview;
