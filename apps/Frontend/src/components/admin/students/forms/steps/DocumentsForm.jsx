import React from 'react';
import {
  Grid,
  Typography,
  Button,
  LinearProgress,
  Box,
  Card,
  CardContent,
  IconButton,
  Link
} from '@mui/material';
import { CloudUpload, Delete, Description } from '@mui/icons-material';

const DocumentsForm = ({ formData = {}, onChange }) => {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const {
    resume = null,
    tenthCertificate = null,
    twelfthCertificate = null,
    graduationCertificate = null
  } = formData;

  const handleFileUpload = async (event, documentType) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      // Simulated upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Replace with your actual upload API call
      // const response = await studentService.uploadDocument(studentId, formData);
      
      // Simulated response
      const response = {
        success: true,
        data: {
          url: URL.createObjectURL(file)
        }
      };

      if (response.success) {
        onChange(documentType, response.data.url);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDeleteDocument = async (documentType) => {
    try {
      // Replace with your actual delete API call
      // await studentService.deleteDocument(studentId, documentType);
      onChange(documentType, '');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const DocumentUploader = ({ label, type, value }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">{label}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2}>
              {value ? (
                <>
                  <Link
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Description />
                    View Document
                  </Link>
                  <IconButton color="error" onClick={() => handleDeleteDocument(type)}>
                    <Delete />
                  </IconButton>
                </>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  disabled={uploading}
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, type)}
                  />
                </Button>
              )}
            </Box>
            {uploading && type === 'resume' && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Required Documents</Typography>
        
        <DocumentUploader
          label="Resume"
          type="resume"
          value={resume}
        />
        
        <DocumentUploader
          label="10th Certificate"
          type="tenthCertificate"
          value={tenthCertificate}
        />
        
        <DocumentUploader
          label="12th Certificate"
          type="twelfthCertificate"
          value={twelfthCertificate}
        />
        
        <DocumentUploader
          label="Graduation Certificate"
          type="graduationCertificate"
          value={graduationCertificate}
        />
      </Grid>
    </Grid>
  );
};

export default DocumentsForm;