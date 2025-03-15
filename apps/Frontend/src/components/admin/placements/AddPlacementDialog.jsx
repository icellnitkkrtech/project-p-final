import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useState } from 'react';
import { AssignPlacementDialog } from "./AssignedPlacement.jsx";
import PlacementData from "./PlacementData";

const steps = ["Placement Type","Company Details", "Job Details", "Eligibility Criteria", "Rounds & Application Details"];

const AddPlacementDialog = ({ open, handleClose, courses, selectionRounds, handleChange, handleAddPlacement, newPlacement, handleJNFSelect, selectedJNF, acceptedJNFs, locationOptions, branchOptions}) => {
  
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const assignedDrives = PlacementData[0];

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
      setConfirmDialogOpen(true);}
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      if (validateForm()) handleAddPlacement();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleConfirm = () => {
    setConfirmDialogOpen(false);
    handleAddPlacement();
  };

  const handleAssign = () => {
    setAssignDialogOpen(true);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Placement Drive</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box>
        <FormControl fullWidth margin="dense" size='small'>
          <InputLabel>Select JNF</InputLabel>
          <Select value={selectedJNF} onChange={handleJNFSelect} label="Select JNF">
            {acceptedJNFs.map((jnf) => (
              <MenuItem key={jnf.id} value={jnf.id}>{jnf.name} - {jnf.jobProfiles[0]?.designation}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          name="title"
          label="Title"
          fullWidth
          required
          value={newPlacement.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
        />

        <FormControl fullWidth margin="dense" size='small'>
          <InputLabel>Placement Type</InputLabel>
          <Select value={newPlacement.type} onChange={handleChange} label="Placement Type">
            <MenuItem value="FullTime">Full Time</MenuItem>
            <MenuItem value="FullTime + Internship">Full Time + Internship</MenuItem>
            <MenuItem value="Internship + PPO">Internship + PPO</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" size='small'>
          <InputLabel>Program</InputLabel>
          <Select value={newPlacement.program} onChange={handleChange} label="Program">
            <MenuItem value="B.Tech">UG</MenuItem>
            <MenuItem value="M.Tech">PG</MenuItem>
            <MenuItem value="MCA">PHD</MenuItem>
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          options={courses}
          value={newPlacement.courses}
          onChange={(e, newValue) => handleChange({ target: { name: 'courses', value: newValue } })}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              margin="dense"
              label="Courses"
              placeholder="Select Courses"
            />
          )}
        />
  
        <FormControl fullWidth margin="dense" size='small'>
          <InputLabel>Year</InputLabel>
          <Select value={newPlacement.year} onChange={handleChange} label="Year">
            <MenuItem value="3">3rd Year</MenuItem>
            <MenuItem value="4">4th Year</MenuItem>
          </Select>
        </FormControl>
        </Box>
        )}

        {activeStep === 1 && (
        <>
        <Typography variant="h5" sx={{ mt: 2 , mb: 1}}>
          Company Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2,}}>
        <TextField
          width= '50%'
          autoFocus
          margin="dense"
          name="companyName"
          label="Company Name"
          required
          value={newPlacement.companyName}
          onChange={handleChange}
          error={!!errors.companyName}
          helperText={errors.companyName}
        />
        <TextField
          autoFocus
          width= '50%'
          margin="dense"
          name="companyType"
          label="Company Type"
          required
          value={newPlacement.companyType}
          onChange={handleChange}
          error={!!errors.companyType}
          helperText={errors.companyType}
        />

        </Box>

        <TextField
          margin="dense"
          name="companyDescription"
          label="Company Description"
          multiline
          rows={4}
          fullWidth
          required
          value={newPlacement.companyDescription}
          onChange={handleChange}
          error={!!errors.companyDescription}
          helperText={errors.companyDescription}
        />
        </>
        )}
        {activeStep === 2 && (
        <>
        <Typography variant="h5" sx={{ mt: 2 , mb: 1}}>
          Job Details
        </Typography>

        <FormControl fullWidth margin="dense" size='small'>
          <InputLabel>Job Role</InputLabel>
          <Select value={newPlacement.jobRole} onChange={handleChange} label="Job Role">
            <MenuItem value="Software Developer">Software Developer</MenuItem>
            <MenuItem value="Data Analyst">Data Analyst</MenuItem>
          </Select>
        </FormControl>

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

        <FormControl
           fullWidth margin="dense" size='small'
        >
          <InputLabel>Job Location</InputLabel>
          <Select
            value={newPlacement.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            label="Job Location"
          >
            {locationOptions.map((location) => (
              <MenuItem key={location} value={location}>{location}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField margin="dense" name="ctc" label="CTC (LPA)" type="number" fullWidth required value={newPlacement.ctc} onChange={handleChange} error={!!errors.ctc} helperText={errors.ctc} />
        <TextField margin="dense" name="baseSalary" label="Base Salary (LPA)" type="number" fullWidth required value={newPlacement.baseSalary} onChange={handleChange} error={!!errors.baseSalary} helperText={errors.baseSalary} />
        <TextField margin="dense" name="stipend" label="Stiped (per month)" type="number" fullWidth required value={newPlacement.stipend} onChange={handleChange} error={!!errors.bonus} helperText={errors.bonus} />
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
        </>
        )}

        {activeStep === 3 && (
        <>
        <Typography variant="h5" sx={{ mt: 2 , mb: 1}}>
          Eligibility Criteria
        </Typography>
        <Autocomplete
          multiple
          options={branchOptions}
          value={newPlacement.eligibleBranches}
          onChange={(e, newValue) => handleChange({ target: { name: 'eligibleBranches', value: newValue } })}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              margin="dense"
              label="Eligible Branches"
              placeholder="Select Branches"
            />
          )}
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

        <TextField
        margin='dense'
        name='otherEligibility'
        label='Other Eligibility Criteria'
        fullWidth
        value={newPlacement.otherEligibility}
        onChange={handleChange}
        error={!!errors.otherEligibility}
        helperText={errors.otherEligibility}
      />
        </>
        )}

        {activeStep === 4 && (
        <>
        <Typography variant="h5" sx={{ mt: 2 , mb: 1}}>
          Selection Rounds
        </Typography>
        <Autocomplete
          multiple
          options={selectionRounds}
          value={newPlacement.selectionRounds}
          onChange={(e, newValue) => handleChange({ target: { name: 'selectionRounds', value: newValue } })}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              margin="dense"
              label="Selection Rounds"
              placeholder="Selection Rounds"
            />
          )}
        />
        <Typography variant="h5" sx={{ mt: 2 , mb: 1}}>
          Application Details
        </Typography>
        <TextField
          margin="dense"
          name="applicationDeadline"
          label="Application Deadline"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={newPlacement.applicationDeadline}
          onChange={handleChange}
          error={!!errors.applicationDeadline}
          helperText={errors.applicationDeadline}
        />
        <TextField
          margin="dense"
          name="applicationLink"
          label="Application Link"
          fullWidth
          required
          value={newPlacement.applicationLink}
          onChange={handleChange}
          error={!!errors.applicationLink}
          helperText={errors.applicationLink}
        />
        </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}
        {activeStep === steps.length - 1 ? (
          <>
          <Button onClick={handleSubmit} color="primary">Add</Button>
          <Button onClick={handleAssign} color="primary">Assign</Button>
          </>
        ) : (
          <Button onClick={handleNext} color="primary">Next</Button>
        )}
      </DialogActions>
      
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Placement Addition</DialogTitle>
        <DialogContent>
          Are you sure you want to add this placement drive?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Placement Addition</DialogTitle>
        <DialogContent>Are you sure you want to add this placement drive?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <AssignPlacementDialog
        open={assignDialogOpen}
        handleClose={() => setAssignDialogOpen(false)}
        users={[
          { id: 1, name: 'User 1', email: 'user1@example.com' },
          { id: 2, name: 'User 2', email: 'user2@example.com' },
          { id: 3, name: 'User 3', email: 'user3@example.com' },
        ]}
        handleAssign={handleAssign}
      />

      {assignedDrives.length > 0 && (
        <Box sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6">Assigned Placement Drives</Typography>
          <List>
            {assignedDrives.map((drive, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${drive.companyName} - ${drive.role}`} secondary={`Assigned to: ${drive.assignedUser}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Dialog>
  );
};

export default AddPlacementDialog;
