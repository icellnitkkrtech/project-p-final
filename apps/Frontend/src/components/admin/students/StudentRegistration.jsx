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
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  Alert
} from '@mui/material';
import { Save, ArrowBack, ArrowForward } from '@mui/icons-material';
import { useState } from 'react';
import studentService from '../../../services/admin/studentService';
import { Navigate } from 'react-router-dom';

const StudentRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [studentData, setStudentData] = useState({
    personalInfo: {
      name: '',
      rollNumber: '',
      department: '',
      batch: '',
    },
    academics: {
      cgpa: '',
      tenthMarks: '',
      twelfthMarks: '',
    },
    secondaryEmail: '',
    skills: [],
    education: [],
    experience: [],
    projects: [],
    socialLinks: {
      github: '',
      linkedIn: '',
    },
  });

  const [errorMessage, setErrorMessage] = useState('');

  const steps = [
    'Personal Information',
    'Academic Details'
  ];

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleChange = (section, field, value) => {
    setStudentData((prev) => {
      if (field) {
        // Handle nested object updates
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      } else {
        // Handle direct field updates
        return {
          ...prev,
          [section]: value,
        };
      }
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await studentService.registerStudentByAdmin(studentData);
      if (response.statusCode !== 201) {
        setErrorMessage(response.message);
      } else {
        console.log('Student registered successfully:', response.data);
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration.');
      console.error('Registration error:', error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" value={studentData.personalInfo.name} onChange={(e) => handleChange('personalInfo', 'name', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Roll Number" value={studentData.personalInfo.rollNumber} onChange={(e) => handleChange('personalInfo', 'rollNumber', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Department" value={studentData.personalInfo.department} onChange={(e) => handleChange('personalInfo', 'department', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Batch" value={studentData.personalInfo.batch} onChange={(e) => handleChange('personalInfo', 'batch', e.target.value)} required />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="CGPA" value={studentData.academics.cgpa} onChange={(e) => handleChange('academics', 'cgpa', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="10th Marks" value={studentData.academics.tenthMarks} onChange={(e) => handleChange('academics', 'tenthMarks', e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="12th Marks" value={studentData.academics.twelfthMarks} onChange={(e) => handleChange('academics', 'twelfthMarks', e.target.value)} required />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              {activeStep > 0 && (
                <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBack />}>Back</Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext} endIcon={<ArrowForward />}>Next</Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<Save />} type="submit">Submit</Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentRegistration;
