import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  Link,
} from '@mui/material';
import {
  CloudUpload,
  Download,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import studentService from '../../../services/admin/studentService';
import { API_BASE_URL } from '../../../config/constants';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const StudentCGPABulkUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setUploadResults(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      let cgpaUpdates = [];

      try {
        const fileType = selectedFile.type;
        if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel') {
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          cgpaUpdates = XLSX.utils.sheet_to_json(sheet);
        } else if (fileType === 'text/csv') {
          Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              cgpaUpdates = results.data;
              processCGPAUpdates(cgpaUpdates);
            },
            error: (error) => {
              setErrorMessage('Error parsing CSV file.');
              setUploading(false);
            }
          });
          return;
        } else {
          throw new Error('Unsupported file type');
        }

        await processCGPAUpdates(cgpaUpdates);
      } catch (error) {
        setErrorMessage(error.message || 'Error processing file');
        setUploading(false);
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  const processCGPAUpdates = async (updates) => {
    const results = {
      total: updates.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    try {
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        setUploadProgress(Math.round(((i + 1) / updates.length) * 100));

        try {
          const response = await studentService.updateStudentCGPA(update.rollNumber, update.cgpa);
          
          if (response.statusCode === 200) {
            results.successful++;
          } else {
            results.failed++;
            results.errors.push({
              row: i + 2, // +2 because Excel rows start at 1 and we have a header
              rollNumber: update.rollNumber,
              error: response.message
            });
          }
        } catch (error) {
          results.failed++;
          results.errors.push({
            row: i + 2,
            rollNumber: update.rollNumber,
            error: error.message
          });
        }
      }

      setUploadResults(results);
      setSuccessMessage(`Successfully updated ${results.successful} out of ${results.total} CGPA records`);
    } catch (error) {
      setErrorMessage('Error processing updates');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}/student/cgpa-template`;
    link.setAttribute('download', 'cgpa_update_template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls'],
      'text/csv': ['.csv']
    },
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bulk CGPA Update
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Download the template file, fill in the student roll numbers and CGPAs, and upload it back.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadTemplate}
                sx={{ mr: 2 }}
              >
                Download Template
              </Button>
            </Box>

            <div {...getRootProps()} style={{
              border: '2px dashed #ccc',
              borderRadius: '4px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <input {...getInputProps()} />
              <Typography variant="body2">
                Drag & drop a file here, or click to select a file
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Accepted formats: .xlsx, .xls, .csv
              </Typography>
            </div>

            {selectedFile && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Selected file: {selectedFile.name}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={uploading}
                  startIcon={<CloudUpload />}
                  sx={{ mt: 1 }}
                >
                  Upload and Process
                </Button>
              </Box>
            )}

            {uploading && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Processing... {uploadProgress}%
                </Typography>
              </Box>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {uploadResults && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Total Records
                        </Typography>
                        <Typography variant="h4">
                          {uploadResults.total}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="success.main" gutterBottom>
                          Successful
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          {uploadResults.successful}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="error.main" gutterBottom>
                          Failed
                        </Typography>
                        <Typography variant="h4" color="error.main">
                          {uploadResults.failed}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {uploadResults.errors.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Error Details
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Row</TableCell>
                          <TableCell>Roll Number</TableCell>
                          <TableCell>Error</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadResults.errors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{error.rollNumber}</TableCell>
                            <TableCell>{error.error}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StudentCGPABulkUpload; 