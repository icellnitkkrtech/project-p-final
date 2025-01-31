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
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ReviewStep = ({ formData }) => {
  const theme = useTheme();
  // ...existing helper functions...
  const isJobProfileFilled = (profile) => {
    return (
      profile.designation.trim() !== '' ||
      profile.jobDescription.trim() !== '' ||
      profile.ctc.trim() !== ''
    );
  };

  // Helper function to get eligible branches for a course
  const getEligibleBranches = (course) => {
    if (!formData.eligibleBranches[course]) return [];
    return formData.eligibleBranches[course]
      .filter((branch) => branch.eligible)
      .map((branch) => {
        if (course === 'mtech') {
          return `${branch.department} - ${branch.specialization}`;
        }
        return branch.name;
      });
  };

  // Get selected job profiles
  const selectedJobProfiles = formData.jobProfiles.filter(isJobProfileFilled);

  // Get selected eligible branches
  const selectedEligibleBranches = Object.keys(formData.eligibleBranches).reduce(
    (acc, course) => {
      const branches = getEligibleBranches(course);
      if (branches.length > 0) {
        acc[course] = branches;
      }
      return acc;
    },
    {}
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

  // Get selected selection process steps
  const selectedSelectionSteps = Object.entries(formData.selectionProcess)
    .filter(
      ([key, value]) =>
        value === true && selectionProcessLabels.hasOwnProperty(key)
    )
    .map(([key]) => selectionProcessLabels[key]);

  const SectionTitle = ({ icon: Icon, title }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
      <Icon color="primary" />
      <Typography variant="h6" color="primary" fontWeight={600}>
        {title}
      </Typography>
    </Stack>
  );

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
                  <Typography>{formData.name || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography>{formData.email || 'N/A'}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                  <Typography>{formData.website || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Company Type</Typography>
                  <Typography>{formData.companyType || 'N/A'}</Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
              <Typography>{formData.description || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Job Profiles */}
        {selectedJobProfiles.length > 0 && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <SectionTitle icon={WorkIcon} title="Job Profiles" />
            <Stack spacing={3}>
              {selectedJobProfiles.map((profile, index) => (
                <Box key={index}>
                  <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                    {profile.course} Profile
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries({
                      Designation: profile.designation,
                      CTC: profile.ctc,
                      'Take Home': profile.takeHome,
                      Perks: profile.perks,
                      'Training Period': profile.trainingPeriod,
                      'Place of Posting': profile.placeOfPosting
                    }).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography variant="subtitle2" color="text.secondary">{key}</Typography>
                        <Typography>{value || 'N/A'}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                  {index < selectedJobProfiles.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Eligible Branches */}
        {Object.keys(selectedEligibleBranches).length > 0 && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <SectionTitle icon={SchoolIcon} title="Eligible Branches" />
            <Stack spacing={3}>
              {Object.entries(selectedEligibleBranches).map(([course, branches], index) => (
                <Box key={index}>
                  <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                    {course} Branches
                  </Typography>
                  <List>
                    {branches.map((branch, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={branch} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Selection Process */}
        {selectedSelectionSteps.length > 0 && (
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <SectionTitle icon={AssignmentIcon} title="Selection Process" />
            <List>
              {selectedSelectionSteps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Additional Details */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <SectionTitle icon={InfoIcon} title="Additional Details" />
          <Grid container spacing={3}>
            {/* ...existing additional details grid... */}
            {formData.pointOfContact?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Point of Contact</Typography>
                <Stack spacing={2}>
                  {formData.pointOfContact.map((contact, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        {Object.entries(contact).map(([key, value]) => (
                          <Grid item xs={12} sm={6} key={key}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography>{value || 'N/A'}</Typography>
                          </Grid>
                        ))}
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