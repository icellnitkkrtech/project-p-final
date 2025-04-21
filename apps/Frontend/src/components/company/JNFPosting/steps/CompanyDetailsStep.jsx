import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  useTheme,
  InputLabel,
  FormControl,
  Paper
} from '@mui/material';

const predefinedDomains = [
  "Analytics",
  "Consulting",
  "Core(Technical)",
  "Finance",
  "Management",
  "IT"
];

const CompanyDetailsStep = ({ formData, handleCompanyInputChange }) => {
  const theme = useTheme();
  const [isOtherDomain, setIsOtherDomain] = useState(false);

  // Access data through companyDetails property
  const companyDetails = formData.companyDetails || {};

  useEffect(() => {
    // Check if the current domain is not in predefined list
    if (!predefinedDomains.includes(companyDetails.domain) && companyDetails.domain !== '') {
      setIsOtherDomain(true);
    } else {
      setIsOtherDomain(false);
    }
  }, [companyDetails.domain]);

  const handleDomainChange = (e) => {
    const selectedDomain = e.target.value;
    if (selectedDomain === 'Other') {
      setIsOtherDomain(true);
      // Clear the domain when selecting "Other"
      handleCompanyInputChange({
        target: { name: 'domain', value: '' }
      });
    } else {
      setIsOtherDomain(false);
      handleCompanyInputChange(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
        Company Details
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          {/* Company Name */}
          <TextField
            fullWidth
            label="Company Name"
            name="name"
            value={companyDetails.name || ''}
            onChange={handleCompanyInputChange}
            variant="outlined"
            required
            disabled
          />

          {/* Email Address */}
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={companyDetails.email || ''}
            onChange={handleCompanyInputChange}
            variant="outlined"
            required
            disabled
          />

          {/* Website */}
          <TextField
            fullWidth
            label="Website"
            name="website"
            type="url"
            value={companyDetails.website || ''}
            onChange={handleCompanyInputChange}
            variant="outlined"
            disabled
          />

          {/* Company Type */}
          <FormControl fullWidth required>
            <InputLabel>Company Type</InputLabel>
            <Select
              name="companyType"
              value={companyDetails.companyType || ''}
              onChange={handleCompanyInputChange}
              label="Company Type"
            >
              <MenuItem value="">Select Company Type</MenuItem>
              <MenuItem value="MNC">MNC</MenuItem>
              <MenuItem value="Start-up">Start-up</MenuItem>
              <MenuItem value="PSU">PSU</MenuItem>
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="NGO">NGO</MenuItem>
              <MenuItem value="Other">Other (Please mention)</MenuItem>
            </Select>
          </FormControl>

          {/* Other Company Type */}
          {companyDetails.companyType === 'Other' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <TextField
                fullWidth
                label="Specify Company Type"
                name="companyType"
                value={companyDetails.companyType || ''}
                onChange={handleCompanyInputChange}
                variant="outlined"
              />
            </motion.div>
          )}

          {/* Domain */}
          <FormControl fullWidth required>
            <InputLabel>Domain</InputLabel>
            <Select
              name="domain"
              value={isOtherDomain ? 'Other' : (companyDetails.domain || '')}
              onChange={handleDomainChange}
              label="Domain"
            >
              <MenuItem value="">Select Domain</MenuItem>
              {predefinedDomains.map(domain => (
                <MenuItem key={domain} value={domain}>{domain}</MenuItem>
              ))}
              <MenuItem value="Other">Other (Please specify)</MenuItem>
            </Select>
          </FormControl>

          {/* Other Domain */}
          {isOtherDomain && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <TextField
                fullWidth
                label="Specify Domain"
                name="domain"
                value={companyDetails.domain || ''}
                onChange={handleCompanyInputChange}
                variant="outlined"
              />
            </motion.div>
          )}

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={companyDetails.description || ''}
            onChange={handleCompanyInputChange}
            multiline
            rows={4}
            variant="outlined"
          />
        </Stack>
      </Paper>
    </motion.div>
  );
};

export default CompanyDetailsStep;