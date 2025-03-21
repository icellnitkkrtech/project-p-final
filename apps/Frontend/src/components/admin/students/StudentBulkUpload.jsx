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
  IconButton,
  Alert,
  Link,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Download,
  CheckCircle,
  Error,
  Delete,
  Refresh
} from '@mui/icons-material';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import studentService from '../../../services/admin/studentService';
import { API_BASE_URL } from '../../../config/constants';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const StudentBulkUpload = () => {
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      let students = [];

      const fileType = selectedFile.type;
      if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel') {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        students = XLSX.utils.sheet_to_json(sheet);
      } else if (fileType === 'text/csv') {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            students = results.data.map(row => ({
              personalInfo: {
                name: row.name,
                rollNumber: row.rollNumber,
                department: row.department,
                batch: row.batch,
              },
              academics: {
                cgpa: row.cgpa,
                tenthMarks: row.tenthMarks,
                twelfthMarks: row.twelfthMarks,
              },
            }));
            postStudents(students);
          },
          error: (error) => {
            setErrorMessage('Error parsing CSV file.');
            setUploading(false);
            console.error('CSV parsing error:', error);
          }
        });
        return;
      } else {
        setErrorMessage('Unsupported file type.');
        setUploading(false);
        return;
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  const postStudents = async (students) => {
    try {
      for (const student of students) {
        const response = await studentService.registerStudentByAdmin(student);
        console.log(response)
        if (response.statusCode !== 201) {
          setErrorMessage(`Failed to register student: ${response.message}`);
          break;
        }
      }
      setSuccessMessage('Students uploaded successfully!');
    } catch (error) {
      setErrorMessage('An error occurred during upload.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    console.log('Downloading');
    link.href = `${API_BASE_URL}/student/template`;
    link.setAttribute('download', 'student_template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls'], 'text/csv': ['.csv'] },
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bulk Student Upload
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Download the template file, fill in the student details, and upload it back.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{ mr: 2 }}
                onClick={handleDownloadTemplate}
              >
                Download Template
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Download Sample File
              </Button>
            </Box>

            <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', borderRadius: '4px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <input {...getInputProps()} />
              <Typography variant="body2">Drag & drop a file here, or click to select a file</Typography>
              <Typography variant="body2">Accepted formats: .xlsx, .xls, .csv</Typography>
            </div>

            {selectedFile && (
              <Box>
                <Typography variant="body2">
                  Selected file: {selectedFile.name}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={uploading}
                  sx={{ mt: 2 }}
                >
                  Upload
                </Button>
              </Box>
            )}

            {uploading && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Uploading and processing...
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

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
                          <TableCell>Error</TableCell>
                          <TableCell>Data</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadResults.errors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{error.error}</TableCell>
                            <TableCell>{error.data}</TableCell>
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

export default StudentBulkUpload;
