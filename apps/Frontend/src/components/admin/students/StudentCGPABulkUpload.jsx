import { useState, useEffect } from 'react';
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
import { useDropzone } from 'react-dropzone';
import studentService from '../../../services/admin/studentService';
import { API_BASE_URL } from '../../../config/constants';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import axios from 'axios';

const StudentCGPABulkUpload = () => {
  const [students, setStudents] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch students when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentService.getStudents();
      if (response.statusCode === 200) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvData = e.target.result;
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            console.log('Parsed CSV data:', results.data);

            const updates = results.data;
            const totalUpdates = updates.length;
            let successful = 0;
            let failed = 0;
            const errors = [];

            for (let i = 0; i < updates.length; i++) {
              try {
                const rollNumber = updates[i].Roll_Number;
                const cgpa = updates[i].CGPA;

                // Validate data
                if (!rollNumber || cgpa === undefined || cgpa === '') {
                  failed++;
                  errors.push({
                    row: i + 2,
                    rollNumber: rollNumber || 'N/A',
                    error: `Missing ${!rollNumber ? 'Roll Number' : 'CGPA'}`
                  });
                  continue;
                }

                // Validate CGPA format
                const cgpaNum = Number(cgpa);
                if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
                  failed++;
                  errors.push({
                    row: i + 2,
                    rollNumber: rollNumber,
                    error: 'CGPA must be a number between 0 and 10'
                  });
                  continue;
                }

                try {
                  const response = await axios.put(
                    `${API_BASE_URL}/student/update-cgpa/${rollNumber}`,
                    { cgpa: cgpaNum },
                    {
                      headers: { 'Content-Type': 'application/json' }
                    }
                  );

                  if (response.data.statusCode === 200) {
                    successful++;
                  } else {
                    failed++;
                    errors.push({
                      row: i + 2,
                      rollNumber: rollNumber,
                      error: response.data.message
                    });
                  }
                } catch (updateError) {
                  failed++;
                  errors.push({
                    row: i + 2,
                    rollNumber: rollNumber,
                    error: updateError.response?.data?.message || 'Update failed'
                  });
                }

                setUploadProgress(((i + 1) / totalUpdates) * 100);
              } catch (error) {
                failed++;
                errors.push({
                  row: i + 2,
                  rollNumber: updates[i].Roll_Number || 'N/A',
                  error: error.message
                });
              }
            }

            setUploadResults({
              total: totalUpdates,
              successful,
              failed,
              errors
            });

            if (successful > 0) {
              setSuccessMessage(`Successfully updated ${successful} student CGPAs`);
              fetchStudents();
            }
          }
        });
      } catch (error) {
        setErrorMessage('Error processing file: ' + error.message);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleDownloadTemplate = () => {
    try {
      // Create CSV content with proper headers
      const csvContent = [
        ['Roll_Number', 'CGPA'], // Changed header to match exactly what upload expects
        ...students.map(student => [
          student.personalInfo?.rollNumber || '',
          student.academics?.cgpa || '0' // Default to '0' if no CGPA
        ])
      ].map(row => row.join(',')).join('\n');

      console.log('CSV Content:', csvContent); // Debug log

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_cgpa_template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      setErrorMessage('Error downloading template');
    }
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
                Download current CGPA data, update the values, and upload it back.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadTemplate}
                sx={{ mr: 2 }}
              >
                Download Current CGPA Data
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