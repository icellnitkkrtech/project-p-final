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

const StudentRegistration = ({ onRegistrationSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [studentData, setStudentData] = useState({
    personalInfo: {
      name: '',
      rollNumber: '',
      department: '',
      gender: '', // Capital G to match schema
      category: '',
      batch: ''
    },
    academics: {
      cgpa: '',
      tenthMarks: '',
      twelfthMarks: ''
    }
  });

  // Predefined options for dropdowns
  const departments = [
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'ECE', label: 'Electronics & Communication Engineering' },
    { value: 'ME', label: 'Mechanical Engineering' },
    { value: 'CE', label: 'Civil Engineering' },
    { value: 'EE', label: 'Electrical Engineering' },
    { value: 'PIE', label: 'Production & Industrial Engineering' },
    { value: 'IT', label: 'Information Technology' }
  ];

  // Predefined options for gender and category
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const categoryOptions = [
    { value: 'GENERAL', label: 'General' },
    { value: 'OBC', label: 'OBC' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' },
    { value: 'EWS', label: 'EWS' },
    { value: 'PWD', label: 'PWD' }
  ];

  // Generate year options (last 10 years to next 4 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -10; i <= 4; i++) {
      years.push(currentYear + i);
    }
    return years.sort((a, b) => b - a); // Sort in descending order
  };

  const years = generateYearOptions();

  // Handle batch year change
  const handleBatchYearChange = (type, value) => {
    setStudentData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [type]: value,
        // Automatically set end year when start year is selected
        ...(type === 'batchStartYear' && {
          batchEndYear: (parseInt(value) + 4).toString()
        })
      }
    }));
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const steps = [
    'Personal Information',
    'Academic Details'
  ];

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleChange = (section, field, value) => {
    setStudentData((prev) => {
      if (field) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      } else {
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
    setSuccessMessage('');
    
    try {
      const payload = {
        personalInfo: {
          name: studentData.personalInfo.name,
          rollNumber: Number(studentData.personalInfo.rollNumber),
          department: studentData.personalInfo.department,
          gender: studentData.personalInfo.gender,
          category: studentData.personalInfo.category,
          batch: Number(studentData.personalInfo.batch)
        },
        academics: {
          cgpa: Number(studentData.academics.cgpa),
          tenthMarks: Number(studentData.academics.tenthMarks),
          twelfthMarks: Number(studentData.academics.twelfthMarks)
        }
      };

      // Add detailed logging
      console.log('Form Data:', studentData);
      console.log('Payload being sent:', JSON.stringify(payload, null, 2));

      // Validate payload before sending
      const missingFields = [];
      
      // Check personalInfo fields
      Object.entries(payload.personalInfo).forEach(([key, value]) => {
        if (!value && value !== 0) {
          missingFields.push(`personalInfo.${key}`);
        }
      });

      // Check academics fields
      Object.entries(payload.academics).forEach(([key, value]) => {
        if (!value && value !== 0) {
          missingFields.push(`academics.${key}`);
        }
      });

      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        setErrorMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      const response = await studentService.registerStudentByAdmin(payload);
      console.log('Server Response:', response);

      if (response.statusCode === 201) {
        setSuccessMessage('Student registered successfully!');
        setStudentData({
          personalInfo: {
            name: '',
            rollNumber: '',
            department: '',
            gender: '',
            category: '',
            batch: ''
          },
          academics: {
            cgpa: '',
            tenthMarks: '',
            twelfthMarks: ''
          }
        });
        onRegistrationSuccess?.();
      }
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        data: error.response?.data?.data,
        status: error.response?.status
      });
      setErrorMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Name" 
                value={studentData.personalInfo.name} 
                onChange={(e) => handleChange('personalInfo', 'name', e.target.value)} 
                required 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Roll Number" 
                value={studentData.personalInfo.rollNumber} 
                onChange={(e) => handleChange('personalInfo', 'rollNumber', e.target.value)} 
                required 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={studentData.personalInfo.department}
                  onChange={(e) => handleChange('personalInfo', 'department', e.target.value)}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>gender</InputLabel>
                <Select
                  value={studentData.personalInfo.gender}
                  onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)}
                  label="gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={studentData.personalInfo.category}
                  onChange={(e) => handleChange('personalInfo', 'category', e.target.value)}
                  label="Category"
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Batch Year"
                type="number"
                value={studentData.personalInfo.batch}
                onChange={(e) => handleChange('personalInfo', 'batch', e.target.value)}
                required
                helperText="Enter admission year (e.g., 2020)"
                inputProps={{
                  min: 2000,
                  max: 2099
                }}
              />
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
          <Typography variant="h6" gutterBottom>
            Register New Student
          </Typography>
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
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
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

