import React from 'react';
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
  useTheme
} from '@mui/material';

const EligibleBranchesStep = ({ formData, handleEligibleBranchChange, handleEligibilityCriteria }) => {
  const theme = useTheme();
  
  const handleCheckboxChange = (e, program, index) => {
    const { checked } = e.target;
    handleEligibleBranchChange(program, index, checked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
        Eligible Branches
      </Typography>

      <Stack spacing={4}>
        {/* B.Tech Section */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Under Graduate Programme (B. Tech.)
          </Typography>
          <Grid container spacing={2}>
            {formData.eligibleBranches.btech.map((branch, index) => (
              <Grid item xs={12} sm={6} key={branch.name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={branch.eligible}
                      onChange={(e) => handleCheckboxChange(e, 'btech', index)}
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
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Post Graduate Programme (M Tech./MCA/MBA)
          </Typography>
          <Grid container spacing={2}>
            {formData.eligibleBranches.mtech.map((branch, index) => (
              <Grid item xs={12} sm={6} key={`${branch.department}-${branch.specialization}`}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={branch.eligible}
                      onChange={(e) => handleCheckboxChange(e, 'mtech', index)}
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
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Doctorate Programme (PhD)
          </Typography>
          <Grid container spacing={2}>
            {formData.eligibleBranches.phd.map((branch, index) => (
              <Grid item xs={12} sm={6} key={`${branch.department}-${branch.specialization}`}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={branch.eligible}
                      onChange={(e) => handleCheckboxChange(e, 'phd', index)}
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

        {/* Eligibility Criteria */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Eligibility Criteria
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.eligibilityCriteria}
            onChange={(e) => handleEligibilityCriteria(e.target.value)}
            variant="outlined"
            placeholder="Enter eligibility criteria if any"
          />
        </Paper>
      </Stack>
    </motion.div>
  );
};

export default EligibleBranchesStep;