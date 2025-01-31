import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Grid,
  Paper,
  Stack,
  useTheme
} from '@mui/material';

const SelectionProcessSteps = ({ formData, handleSelectionProcess }) => {
  const theme = useTheme();
  
  const checkboxes = Object.keys(formData.selectionProcess)
    .filter(key => key !== 'otherRounds')
    .map(key => ({
      key,
      label: key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
        Selection Process
      </Typography>

      <Stack spacing={4}>
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Grid container spacing={2}>
            {checkboxes.map(({ key, label }) => (
              <Grid item xs={12} sm={6} key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.selectionProcess[key]}
                      onChange={(e) => handleSelectionProcess(key, e.target.checked)}
                      color="primary"
                    />
                  }
                  label={label}
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

        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Details of other rounds (if any)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.selectionProcess.otherRounds}
            onChange={(e) => handleSelectionProcess('otherRounds', e.target.value)}
            variant="outlined"
            placeholder="Enter details of additional selection rounds if any"
          />
        </Paper>
      </Stack>
    </motion.div>
  );
};

export default SelectionProcessSteps;