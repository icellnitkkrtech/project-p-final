import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import PersonalInfoForm from './steps/PersonalInfoForm';
import AcademicInfoForm from './steps/AcademicInfoForm';
import PlacementInfoForm from './steps/PlacementInfoForm';
import DocumentsForm from './steps/DocumentsForm';
import studentService from '../../../../services/admin/studentService';

const steps = [
  'Personal Information',
  'Academic Details',
  'Placement Information',
  'Documents'
];

const EditStudentForm = ({ open, onClose, studentId, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  // Update the initial state
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      rollNumber: '',
      department: '',
      gender: '',  // Note capital G
      category: 'GENERAL', // Add default value
      batch: '',
      isLocked: false
    },
    academics: {
      cgpa: '',
      tenthMarks: '',
      twelfthMarks: '',
      isLocked: false
    },
    placement: {
      status: 'not_placed',
      offersReceived: 0,
      company: '',
      role: '',
      highestPackage: ''
    },
    documents: {
      resume: null,
      tenthCertificate: null,
      twelfthCertificate: null,
      graduationCertificate: null
    }
  });

  // Update the useEffect for data fetching
  useEffect(() => {
    const fetchStudentData = async () => {
      if (open && studentId) {
        setLoading(true);
        try {
          const response = await studentService.getStudentById(studentId);
          console.log('Raw student data:', response.data);

          if (response.statusCode === 200 && response.data) {
            setFormData({
              personalInfo: {
                name: response.data.personalInfo?.name || '',
                rollNumber: response.data.personalInfo?.rollNumber || '',
                department: response.data.personalInfo?.department || '',
                gender: response.data.personalInfo?.gender || '',
                category: response.data.personalInfo?.category || 'GENERAL', // Add default
                batch: response.data.personalInfo?.batch || '', // Single year number
                isLocked: response.data.personalInfo?.isLocked || false
              },
              academics: {
                cgpa: response.data.academics?.cgpa?.toString() || '',
                tenthMarks: response.data.academics?.tenthMarks?.toString() || '',
                twelfthMarks: response.data.academics?.twelfthMarks?.toString() || '',
                isLocked: response.data.academics?.isLocked || false
              },
              placement: {
                status: response.data.placement?.status || 'not_placed',
                offersReceived: response.data.placement?.offersReceived || 0,
                company: response.data.placement?.company || '',
                role: response.data.placement?.role || '',
                highestPackage: response.data.placement?.highestPackage || ''
              },
              documents: {
                resume: response.data.documents?.resume || null,
                tenthCertificate: response.data.documents?.tenthCertificate || null,
                twelfthCertificate: response.data.documents?.twelfthCertificate || null,
                graduationCertificate: response.data.documents?.graduationCertificate || null
              }
            });
          }
        } catch (error) {
          console.error('Error fetching student:', error);
          setError('Failed to load student data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudentData();
  }, [open, studentId]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Update handleSubmit
  const handleSubmit = async () => {
    try {
      const formattedData = {
        personalInfo: {
          ...formData.personalInfo,
          rollNumber: Number(formData.personalInfo.rollNumber),
          batch: Number(formData.personalInfo.batch), // Convert to number
          gender: formData.personalInfo.gender,
          category: formData.personalInfo.category || 'GENERAL', // Ensure category is present
        },
        academics: {
          cgpa: Number(formData.academics.cgpa),
          tenthMarks: Number(formData.academics.tenthMarks),
          twelfthMarks: Number(formData.academics.twelfthMarks)
        },
        placement: formData.placement,
        documents: formData.documents
      };

      console.log('Submitting formatted data:', formattedData);
      const response = await studentService.updateStudent(studentId, formattedData);
      
      if (response.success) {
        onUpdate?.();
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm
            formData={formData.personalInfo}
            onChange={(field, value) => handleInputChange('personalInfo', field, value)}
          />
        );
      case 1:
        return (
          <AcademicInfoForm
            formData={formData.academics}
            onChange={(field, value) => handleInputChange('academics', field, value)}
          />
        );
      case 2:
        return (
          <PlacementInfoForm
            formData={formData.placement}
            onChange={(field, value) => handleInputChange('placement', field, value)}
          />
        );
      case 3:
        return (
          <DocumentsForm
            formData={formData.documents}
            onChange={(field, value) => handleInputChange('documents', field, value)}
            studentId={studentId}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Edit />
          <Typography>Edit Student Details</Typography>
        </Box>
        <IconButton color="inherit" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, minHeight: '60vh' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {getStepContent(activeStep)}
          </>
        )}
      </DialogContent>

      {submitError && (
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography color="error">{submitError}</Typography>
        </Box>
      )}

      {!loading && !error && (
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={onClose}
            color="inherit"
          >
            Cancel
          </Button>
          <Box flex={1} />
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default EditStudentForm;