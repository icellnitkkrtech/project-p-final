import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useState, useEffect } from 'react';

const JNFForm = ({ open, onClose, jnf, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    website: '',
    industry: '',
    aboutCompany: '',

    // Job Details
    jobTitle: '',
    jobDescription: '',
    jobType: '',
    workLocation: '',
    positions: '',
    ctc: '',
    bondDetails: '',

    // Eligibility Criteria
    eligibleBranches: [],
    minimumCGPA: '',
    backlogPolicy: '',
    selectionProcess: [],

    // Additional Details
    skillsRequired: [],
    documents: [],
    additionalNotes: ''
  });

  useEffect(() => {
    if (jnf) {
      setFormData(jnf);
    } else {
      setFormData({
        // Company Details
        companyName: '',
        website: '',
        industry: '',
        aboutCompany: '',

        // Job Details
        jobTitle: '',
        jobDescription: '',
        jobType: '',
        workLocation: '',
        positions: '',
        ctc: '',
        bondDetails: '',

        // Eligibility Criteria
        eligibleBranches: [],
        minimumCGPA: '',
        backlogPolicy: '',
        selectionProcess: [],

        // Additional Details
        skillsRequired: [],
        documents: [],
        additionalNotes: ''
      });
    }
  }, [jnf]);

  const steps = [
    'Company Details',
    'Job Details',
    'Eligibility Criteria',
    'Additional Details'
  ];

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil'
  ];

  const selectionProcessSteps = [
    'Online Test',
    'Technical Interview',
    'HR Interview',
    'Group Discussion',
    'Coding Test'
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    onSubmit(formData);
  };

  const CompanyDetailsForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Company Name"
          value={formData.companyName}
          onChange={handleChange('companyName')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Website"
          value={formData.website}
          onChange={handleChange('website')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Industry"
          value={formData.industry}
          onChange={handleChange('industry')}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="About Company"
          value={formData.aboutCompany}
          onChange={handleChange('aboutCompany')}
        />
      </Grid>
    </Grid>
  );

  const JobDetailsForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Job Title"
          value={formData.jobTitle}
          onChange={handleChange('jobTitle')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required>
          <InputLabel>Job Type</InputLabel>
          <Select
            value={formData.jobType}
            label="Job Type"
            onChange={handleChange('jobType')}
          >
            <MenuItem value="full-time">Full Time</MenuItem>
            <MenuItem value="internship">Internship</MenuItem>
            <MenuItem value="contract">Contract</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Job Description"
          value={formData.jobDescription}
          onChange={handleChange('jobDescription')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Work Location"
          value={formData.workLocation}
          onChange={handleChange('workLocation')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Number of Positions"
          type="number"
          value={formData.positions}
          onChange={handleChange('positions')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="CTC (per annum in LPA)"
          value={formData.ctc}
          onChange={handleChange('ctc')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Bond Details (if any)"
          value={formData.bondDetails}
          onChange={handleChange('bondDetails')}
        />
      </Grid>
    </Grid>
  );

  const EligibilityCriteriaForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={branches}
          value={formData.eligibleBranches}
          onChange={(event, newValue) => {
            setFormData({ ...formData, eligibleBranches: newValue });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Eligible Branches" required />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} />
            ))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Minimum CGPA"
          type="number"
          inputProps={{ step: 0.01, min: 0, max: 10 }}
          value={formData.minimumCGPA}
          onChange={handleChange('minimumCGPA')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Backlog Policy"
          value={formData.backlogPolicy}
          onChange={handleChange('backlogPolicy')}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={selectionProcessSteps}
          value={formData.selectionProcess}
          onChange={(event, newValue) => {
            setFormData({ ...formData, selectionProcess: newValue });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Selection Process" required />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} />
            ))
          }
        />
      </Grid>
    </Grid>
  );

  const AdditionalDetailsForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Skills Required"
          value={formData.skillsRequired.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            skillsRequired: e.target.value.split(',').map(skill => skill.trim())
          })}
          helperText="Enter skills separated by commas"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Required Documents"
          value={formData.documents.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            documents: e.target.value.split(',').map(doc => doc.trim())
          })}
          helperText="Enter document names separated by commas"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Additional Notes"
          value={formData.additionalNotes}
          onChange={handleChange('additionalNotes')}
        />
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <CompanyDetailsForm />;
      case 1:
        return <JobDetailsForm />;
      case 2:
        return <EligibilityCriteriaForm />;
      case 3:
        return <AdditionalDetailsForm />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{jnf ? 'Edit JNF' : 'Create JNF'}</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Create Job Notification Form
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {jnf ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JNFForm;