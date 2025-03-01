import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControl, InputLabel, Select, InputAdornment, Chip, Autocomplete } from '@mui/material';
import { useState } from 'react';

const AddPlacementDialog = ({ open, handleClose, handleChange, handleAddPlacement, newPlacement, handleJNFSelect, selectedJNF, acceptedJNFs, locationOptions, branchOptions }) => {
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};

    // Required Fields
    if (!newPlacement.companyName) tempErrors.companyName = "Company Name is required";
    if (!newPlacement.role) tempErrors.role = "Role is required";
    if (!newPlacement.expectedJoiningDate) tempErrors.expectedJoiningDate = "Joining Date is required";
    if (!newPlacement.aboutRole) tempErrors.aboutRole = "Role description is required";
    if (!newPlacement.aboutCompany) tempErrors.aboutCompany = "Company description is required";
    if (!newPlacement.eligibility) tempErrors.eligibility = "Eligibility criteria is required";

    // Numeric Validations
    if (!newPlacement.cgpa || isNaN(newPlacement.cgpa) || newPlacement.cgpa < 0 || newPlacement.cgpa > 10) {
      tempErrors.cgpa = "Enter a valid CGPA (0-10)";
    }
    if (!newPlacement.backlogs || isNaN(newPlacement.backlogs) || newPlacement.backlogs < 0) {
      tempErrors.backlogs = "Enter a valid number of backlogs (min 0)";
    }

    // Set errors and return validation status
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle Submit with Validation
  const handleSubmit = () => {
    if (validateForm()) {
      handleAddPlacement(); // Only call this if form is valid
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Placement Drive</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Select JNF</InputLabel>
          <Select value={selectedJNF} onChange={handleJNFSelect} label="Select JNF">
            <MenuItem value=""><em>None</em></MenuItem>
            {acceptedJNFs.map((jnf) => (
              <MenuItem key={jnf.id} value={jnf.id}>{jnf.name} - {jnf.jobProfiles[0]?.designation}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          autoFocus
          margin="dense"
          name="companyName"
          label="Company Name"
          fullWidth
          required
          value={newPlacement.companyName}
          onChange={handleChange}
          error={!!errors.companyName}
          helperText={errors.companyName}
        />
        <TextField
          margin="dense"
          name="role"
          label="Role"
          fullWidth
          required
          value={newPlacement.role}
          onChange={handleChange}
          error={!!errors.role}
          helperText={errors.role}
        />
        
        <TextField
          margin="dense"
          name="expectedJoiningDate"
          label="Expected Date of Joining"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={newPlacement.expectedJoiningDate}
          onChange={handleChange}
          error={!!errors.expectedJoiningDate}
          helperText={errors.expectedJoiningDate}
        />
        
        <TextField
          margin="dense"
          name="aboutRole"
          label="About the Role"
          multiline
          rows={4}
          fullWidth
          required
          value={newPlacement.aboutRole}
          onChange={handleChange}
          error={!!errors.aboutRole}
          helperText={errors.aboutRole}
        />
        
        <TextField
          margin="dense"
          name="aboutCompany"
          label="About the Company"
          multiline
          rows={4}
          fullWidth
          required
          value={newPlacement.aboutCompany}
          onChange={handleChange}
          error={!!errors.aboutCompany}
          helperText={errors.aboutCompany}
        />
        
        <TextField
          margin="dense"
          name="eligibility"
          label="Eligibility Criteria"
          multiline
          rows={3}
          fullWidth
          required
          value={newPlacement.eligibility}
          onChange={handleChange}
          error={!!errors.eligibility}
          helperText={errors.eligibility}
        />
        
        <TextField
          margin="dense"
          name="cgpa"
          label="Minimum CGPA Required"
          type="number"
          fullWidth
          required
          InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
          value={newPlacement.cgpa}
          onChange={handleChange}
          error={!!errors.cgpa}
          helperText={errors.cgpa}
        />
        
        <TextField
          margin="dense"
          name="backlogs"
          label="Maximum Backlogs Allowed"
          type="number"
          fullWidth
          required
          InputProps={{ inputProps: { min: 0 } }}
          value={newPlacement.backlogs}
          onChange={handleChange}
          error={!!errors.backlogs}
          helperText={errors.backlogs}
        />
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPlacementDialog;
