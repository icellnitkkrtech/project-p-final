// components/jnf/JNFCreationForm.jsx
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Button,
    MenuItem,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    Divider,
    Alert,
    Chip,
    IconButton,
    Tooltip
  } from '@mui/material';
  import {
    Add,
    Remove,
    Help,
    AttachFile,
    Save,
    Preview,
    Send
  } from '@mui/icons-material';
  import { useState } from 'react';
  
  export const JNFCreationForm = ({ initialData, onSubmit }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialData || {
      companyDetails: {
        jobTitle: '',
        jobType: '',
        positions: 0,
        workLocation: '',
        jobDescription: '',
        requiredSkills: []
      },
      eligibility: {
        courses: [],
        branches: [],
        minCGPA: '',
        maxBacklogs: '',
        otherCriteria: ''
      },
      selectionProcess: {
        rounds: [],
        hasAptitudeTest: false,
        hasTechnicalTest: false,
        hasGD: false,
        hasInterview: false,
        additionalRounds: ''
      },
      compensation: {
        ctc: '',
        basePay: '',
        variables: '',
        bonuses: '',
        otherBenefits: ''
      }
    });
  
    const steps = [
      'Job Details',
      'Eligibility Criteria',
      'Selection Process',
      'Compensation',
      'Review'
    ];
  
    const handleNext = () => {
      setActiveStep((prev) => prev + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prev) => prev - 1);
    };
  
    const handleFormChange = (section, field, value) => {
      setFormData(prevData => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value
        }
      }));
    };
  
    const handleAddSkill = (event) => {
      if (event.key === 'Enter' && event.target.value.trim()) {
        setFormData(prevData => ({
          ...prevData,
          companyDetails: {
            ...prevData.companyDetails,
            requiredSkills: [...prevData.companyDetails.requiredSkills, event.target.value.trim()]
          }
        }));
        event.target.value = '';
      }
    };
  
    const handleAddSkillButton = () => {
      const input = document.querySelector('input[placeholder="Add a skill"]');
      if (input && input.value.trim()) {
        setFormData(prevData => ({
          ...prevData,
          companyDetails: {
            ...prevData.companyDetails,
            requiredSkills: [...prevData.companyDetails.requiredSkills, input.value.trim()]
          }
        }));
        input.value = '';
      }
    };
  
    const handleRemoveSkill = (indexToRemove) => {
      setFormData(prevData => ({
        ...prevData,
        companyDetails: {
          ...prevData.companyDetails,
          requiredSkills: prevData.companyDetails.requiredSkills.filter((_, index) => index !== indexToRemove)
        }
      }));
    };
  
    const handleCourseChange = (course, checked) => {
      setFormData(prevData => ({
        ...prevData,
        eligibility: {
          ...prevData.eligibility,
          courses: checked 
            ? [...prevData.eligibility.courses, course]
            : prevData.eligibility.courses.filter(c => c !== course)
        }
      }));
    };
  
    const handleBranchChange = (branch, checked) => {
      setFormData(prevData => ({
        ...prevData,
        eligibility: {
          ...prevData.eligibility,
          branches: checked 
            ? [...prevData.eligibility.branches, branch]
            : prevData.eligibility.branches.filter(b => b !== branch)
        }
      }));
    };
  
    const JobDetailsForm = () => (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Job Title"
            name="jobTitle"
            value={formData.companyDetails.jobTitle}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                companyDetails: {
                  ...prev.companyDetails,
                  jobTitle: value
                }
              }));
            }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Job Type"
            name="jobType"
            value={formData.companyDetails.jobType}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                companyDetails: {
                  ...prev.companyDetails,
                  jobType: value
                }
              }));
            }}
            required
          >
            <MenuItem value="fullTime">Full Time</MenuItem>
            <MenuItem value="intern">Internship</MenuItem>
            <MenuItem value="internPPO">Internship + PPO</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Number of Positions"
            name="positions"
            value={formData.companyDetails.positions}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                companyDetails: {
                  ...prev.companyDetails,
                  positions: value
                }
              }));
            }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Work Location"
            name="workLocation"
            value={formData.companyDetails.workLocation}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                companyDetails: {
                  ...prev.companyDetails,
                  workLocation: value
                }
              }));
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Job Description"
            name="jobDescription"
            value={formData.companyDetails.jobDescription}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                companyDetails: {
                  ...prev.companyDetails,
                  jobDescription: value
                }
              }));
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Required Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.companyDetails.requiredSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(index)}
                />
              ))}
            </Box>
            <Box display="flex" gap={1} mt={1}>
              <TextField
                size="small"
                placeholder="Add a skill"
                onKeyPress={handleAddSkill}
              />
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddSkillButton}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  
    const EligibilityForm = () => (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel>Eligible Courses</FormLabel>
            <FormGroup>
              {['B.Tech', 'M.Tech', 'MCA', 'MBA'].map((course) => (
                <FormControlLabel
                  key={course}
                  control={
                    <Checkbox
                      checked={formData.eligibility.courses.includes(course)}
                      onChange={(e) => handleCourseChange(course, e.target.checked)}
                    />
                  }
                  label={course}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel>Eligible Branches</FormLabel>
            <FormGroup>
              {['CSE', 'ECE', 'ME', 'CE', 'IT', 'PIE', 'EE'].map((branch) => (
                <FormControlLabel
                  key={branch}
                  control={
                    <Checkbox
                      checked={formData.eligibility.branches.includes(branch)}
                      onChange={(e) => handleBranchChange(branch, e.target.checked)}
                    />
                  }
                  label={branch}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Minimum CGPA"
            name="minCGPA"
            value={formData.eligibility.minCGPA}
            onChange={(e) => handleFormChange('eligibility', 'minCGPA', e.target.value)}
            inputProps={{ step: 0.1, min: 0, max: 10 }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Maximum Backlogs"
            name="maxBacklogs"
            value={formData.eligibility.maxBacklogs}
            onChange={(e) => handleFormChange('eligibility', 'maxBacklogs', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Other Eligibility Criteria"
            name="otherCriteria"
            value={formData.eligibility.otherCriteria}
            onChange={(e) => handleFormChange('eligibility', 'otherCriteria', e.target.value)}
          />
        </Grid>
      </Grid>
    );
  
    const SelectionProcessForm = () => (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Selection Rounds</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.selectionProcess.hasAptitudeTest}
                    onChange={(e) => handleFormChange('selectionProcess', 'hasAptitudeTest', e.target.checked)}
                  />
                }
                label="Aptitude Test"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.selectionProcess.hasTechnicalTest}
                    onChange={(e) => handleFormChange('selectionProcess', 'hasTechnicalTest', e.target.checked)}
                  />
                }
                label="Technical Test"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.selectionProcess.hasGD}
                    onChange={(e) => handleFormChange('selectionProcess', 'hasGD', e.target.checked)}
                  />
                }
                label="Group Discussion"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.selectionProcess.hasInterview}
                    onChange={(e) => handleFormChange('selectionProcess', 'hasInterview', e.target.checked)}
                  />
                }
                label="Interview"
              />
            </FormGroup>
          </FormControl>
        </Grid>
        {/* Add more selection process fields */}
      </Grid>
    );
  
    const CompensationForm = () => (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="CTC (LPA)"
            name="ctc(LPA)"
            value={formData.compensation.ctc}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                compensation: {
                  ...prev.compensation,
                  ctc: value
                }
              }));
            }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Base Pay"
            name="basePay"
            value={formData.compensation.basePay}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                compensation: {
                  ...prev.compensation,
                  basePay: value
                }
              }));
            }}
            required
          />
        </Grid>
        {/* Add more compensation fields */}
      </Grid>
    );
  
    const ReviewForm = () => (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please review all details before submitting
        </Alert>
        {/* Add review content */}
      </Box>
    );
  
    const getStepContent = (step) => {
      switch (step) {
        case 0:
          return <JobDetailsForm />;
        case 1:
          return <EligibilityForm />;
        case 2:
          return <SelectionProcessForm />;
        case 3:
          return <CompensationForm />;
        case 4:
          return <ReviewForm />;
        default:
          return 'Unknown step';
      }
    };
  
    return (
      <Box>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Card>
          <CardContent>
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
                  onClick={() => onSubmit(formData)}
                  startIcon={<Send />}
                >
                  Submit JNF
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
          </CardContent>
        </Card>
      </Box>
    );
  };