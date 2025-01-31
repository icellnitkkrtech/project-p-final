import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Stack,
  Divider,
  useTheme
} from '@mui/material';

const AdditionalDetailsStep = ({
  formData,
  handleBondDetailsChange,
  handlePointOfContactChange,
  handleAdditionalInfoChange
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
        Additional Details
      </Typography>

      <Stack spacing={4}>
        {/* Bond Details */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            Bond Details (if any)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.bondDetails}
            onChange={(e) => handleBondDetailsChange(e.target.value)}
            variant="outlined"
          />
        </Box>

        {/* Point of Contact */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Point of Contact
          </Typography>
          
          {formData.pointOfContact.map((contact, index) => (
            <Box 
              key={index}
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={contact.name}
                    onChange={(e) => handlePointOfContactChange(index, 'name', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Designation"
                    value={contact.designation}
                    onChange={(e) => handlePointOfContactChange(index, 'designation', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    value={contact.mobile}
                    onChange={(e) => handlePointOfContactChange(index, 'mobile', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => handlePointOfContactChange(index, 'email', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {index < formData.pointOfContact.length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          ))}
        </Paper>

        {/* Additional Info */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Additional Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sponsor Events"
                value={formData.additionalInfo.sponsorEvents}
                onChange={(e) => handleAdditionalInfoChange('sponsorEvents', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Internship Offered"
                value={formData.additionalInfo.internshipOffered}
                onChange={(e) => handleAdditionalInfoChange('internshipOffered', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Internship Duration"
                value={formData.additionalInfo.internshipDuration}
                onChange={(e) => handleAdditionalInfoChange('internshipDuration', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contests"
                value={formData.additionalInfo.contests}
                onChange={(e) => handleAdditionalInfoChange('contests', e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </motion.div>
  );
};

export default AdditionalDetailsStep;