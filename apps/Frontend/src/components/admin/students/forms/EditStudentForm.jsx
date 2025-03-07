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
import SkillsForm from './steps/SkillsForm';
import DocumentsForm from './steps/DocumentsForm';
import studentService from '../../../../services/admin/studentService';

const steps = [
  'Personal Information',
  'Academic Details',
  'Placement Information',
  'Skills & Certifications',
  'Documents'
];

const EditStudentForm = ({ open, onClose, studentId, onUpdate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {},
    academics: {},
    placement: {},
    skills: {},
    documents: {}
  });

  // Fetch student data when dialog opens
  useEffect(() => {
    const fetchStudentData = async () => {
      if (open && studentId) {
        setLoading(true);
        try {
          const response = await studentService.getStudentById(studentId);
          if (response.success) {
            setFormData({
              personalInfo: response.data.personalInfo || {},
              academics: response.data.academics || {},
              placement: response.data.placement || {},
              skills: response.data.skills || {},
              documents: response.data.documents || {}
            });
            setError(null);
          }
        } catch (error) {
          console.error('Error fetching student details:', error);
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

  const handleSubmit = async () => {
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Failed to update student');
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
          <SkillsForm
            formData={formData.skills}
            onChange={(field, value) => handleInputChange('skills', field, value)}
          />
        );
      case 4:
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