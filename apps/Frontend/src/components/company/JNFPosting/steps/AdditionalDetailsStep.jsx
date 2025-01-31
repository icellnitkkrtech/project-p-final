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
  useTheme,
  Button,
  IconButton,
  Tooltip,
  Card,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const AdditionalDetailsStep = ({
  formData,
  handleBondDetailsChange,
  handlePointOfContactChange,
  handleAdditionalInfoChange
}) => {
  const theme = useTheme();
  const handleAddContact = () => {
    const newContact = {
      name: '',
      designation: '',
      mobile: '',
      email: ''
    };
    handlePointOfContactChange([...formData.pointOfContact, newContact]);
  };

  const handleRemoveContact = (index) => {
    if (formData.pointOfContact.length > 1) {
      const updatedContacts = formData.pointOfContact.filter((_, i) => i !== index);
      handlePointOfContactChange(updatedContacts);
    }
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.pointOfContact];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    handlePointOfContactChange(updatedContacts);
  };

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

        {/* Point of Contact Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
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
            mb: 4 
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
              <PersonIcon /> Point of Contact Details
            </Typography>
            <Tooltip title="Add another contact person">
              <Button
                startIcon={<PersonAddIcon />}
                variant="contained"
                size="small"
                onClick={handleAddContact}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 1 }
                }}
              >
                Add Contact
              </Button>
            </Tooltip>
          </Box>

          <Stack spacing={3}>
            {formData.pointOfContact.map((contact, index) => (
              <Card
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.1 
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
                    Contact Person {index + 1}
                  </Typography>
                  {index > 0 && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveContact(index)}
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
                    <TextField
                      fullWidth
                      label="Name"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      variant="outlined"
                      size="medium"
                      required
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={contact.designation}
                      onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                      variant="outlined"
                      size="medium"
                      required
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile"
                      value={contact.mobile}
                      onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                      variant="outlined"
                      size="medium"
                      required
                      inputProps={{
                        pattern: '[0-9]*',
                        maxLength: 10
                      }}
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                      variant="outlined"
                      size="medium"
                      required
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Stack>
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