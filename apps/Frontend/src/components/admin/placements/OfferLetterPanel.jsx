import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Tooltip, useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import placementService from '../../../services/admin/placementService';
import studentService from '../../../services/admin/studentService';

const OfferLetterPanel = ({ placementId, companyName, jobProfile }) => {
  const theme = useTheme();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offerLetters, setOfferLetters] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [offerLetterTemplate, setOfferLetterTemplate] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [previewStudent, setPreviewStudent] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch selected students
        const response = await placementService.getSelectedStudents(placementId);
        
        if (response && response.selectedStudents && Array.isArray(response.selectedStudents)) {
          // The API already returns full student objects, so we can use them directly
          setSelectedStudents(response.selectedStudents);
        } else {
          setSelectedStudents([]);
        }
        
        // Fetch existing offer letters
        await fetchOfferLetters();
        
        // Set default template
        setOfferLetterTemplate(`
          <h2>Offer Letter</h2>
          <p>Dear [STUDENT_NAME],</p>
          <p>We are pleased to offer you a position at <strong>${companyName || '[COMPANY_NAME]'}</strong> as <strong>${jobProfile?.designation || '[JOB_TITLE]'}</strong>.</p>
          <p>Details:</p>
          <ul>
            <li>Position: ${jobProfile?.designation || '[JOB_TITLE]'}</li>
            <li>CTC: ${jobProfile?.ctc ? `₹${jobProfile.ctc/100000} LPA` : '[SALARY]'}</li>
            <li>Location: ${jobProfile?.placeOfPosting || '[LOCATION]'}</li>
            <li>Start Date: [START_DATE]</li>
          </ul>
          <p>Please accept or reject this offer within 7 days.</p>
          <p>Congratulations!</p>
          <p>HR Department<br>${companyName || '[COMPANY_NAME]'}</p>
        `);
      } catch (err) {
        setError("Failed to load selected students");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [placementId, companyName, jobProfile]);
  
  const fetchOfferLetters = async () => {
    try {
      setLoadingOffers(true);
      const response = await placementService.getOfferLetters(placementId);
      
      // Check if response is an array directly or has a data property
      if (Array.isArray(response)) {
        setOfferLetters(response);
      } else if (response && response.data) {
        setOfferLetters(response.data);
      } else {
        setOfferLetters([]);
      }
    } catch (err) {
      setOfferLetters([]);
    } finally {
      setLoadingOffers(false);
    }
  };
  
  const handlePreview = (student) => {
    // Replace placeholders with student data
    let content = offerLetterTemplate;
    if (student) {
      content = content.replace(/\[STUDENT_NAME\]/g, student.personalInfo?.name || '');
      content = content.replace(/\[ROLL_NUMBER\]/g, student.personalInfo?.rollNumber || '');
      content = content.replace(/\[DEPARTMENT\]/g, student.personalInfo?.department || '');
      content = content.replace(/\[START_DATE\]/g, new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString());
    }
    
    setPreviewContent(content);
    setPreviewStudent(student);
    setOpenPreviewDialog(true);
  };
  
  const handleSendOffers = async () => {
    try {
      setSending(true);
      
      // Make sure we have students and can extract their IDs
      if (!selectedStudents || selectedStudents.length === 0) {
        throw new Error("No students selected");
      }
      
      // Extract IDs, ensuring we handle different possible structures
      const studentIds = selectedStudents.map(student => {
        // Handle different possible structures
        if (typeof student === 'string') {
          return student; // Already an ID
        } else if (student._id) {
          return student._id; // Object with _id property
        } else if (student.id) {
          return student.id; // Object with id property
        } else {
          return null;
        }
      }).filter(id => id !== null); // Remove any null values
      
      // Verify we have IDs to send
      if (studentIds.length === 0) {
        throw new Error("Could not extract valid student IDs");
      }
      
      // Send the request with the extracted IDs
      const response = await placementService.sendOfferLetters(placementId, {
        studentIds,
        content: offerLetterTemplate,
        expiryDate: new Date(Date.now() + 7*24*60*60*1000) // 7 days from now
      });
      
      await fetchOfferLetters();
      setOpenDialog(false);
      
      // Show success message
      setError({ severity: 'success', message: 'Offer letters sent successfully!' });
    } catch (err) {
      setError({ severity: 'error', message: err.message || 'Failed to send offer letters' });
    } finally {
      setSending(false);
    }
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'accepted':
        return <Chip icon={<CheckCircleIcon />} label="Accepted" color="success" size="small" />;
      case 'rejected':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
      case 'expired':
        return <Chip label="Expired" color="default" size="small" />;
      default:
        return <Chip label="Pending" color="primary" size="small" />;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      {error && (
        <Alert 
          severity={typeof error === 'object' ? error.severity : 'error'} 
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {typeof error === 'object' ? error.message : error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' } }}>
          Selected Students ({selectedStudents.length})
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchOfferLetters}
            disabled={loadingOffers}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EmailIcon />}
            onClick={() => setOpenDialog(true)}
            disabled={selectedStudents.length === 0}
          >
            Create Offer Letters
          </Button>
        </Box>
      </Box>
      
      {selectedStudents.length === 0 ? (
        <Alert severity="info">No students selected in the final round yet.</Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Offer Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedStudents.map((student) => {
                // Try different ways to match the student with an offer letter
                const studentIdStr = student._id?.toString();
                
                const offerLetter = offerLetters.find(offer => {
                  const offerStudentIdStr = offer.studentId?.toString();
                  return studentIdStr && offerStudentIdStr && studentIdStr === offerStudentIdStr;
                });
                
                return (
                  <TableRow key={student._id}>
                    <TableCell>{student.personalInfo?.name || 'N/A'}</TableCell>
                    <TableCell>{student.personalInfo?.rollNumber || 'N/A'}</TableCell>
                    <TableCell>{student.personalInfo?.department || 'N/A'}</TableCell>
                    <TableCell>
                      {offerLetter ? getStatusChip(offerLetter.status) : 'Not sent'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Preview Offer Letter">
                        <IconButton 
                          size="small" 
                          onClick={() => handlePreview(student)}
                        >
                          <PreviewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Create Offer Letter Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Offer Letters</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Create an offer letter template. Use [STUDENT_NAME], [ROLL_NUMBER], etc. as placeholders.
          </Typography>
          
          <TextField
            label="Offer Letter Template"
            multiline
            rows={12}
            fullWidth
            value={offerLetterTemplate}
            onChange={(e) => setOfferLetterTemplate(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={() => handlePreview(selectedStudents[0])}
              startIcon={<PreviewIcon />}
            >
              Preview
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSendOffers}
            startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send to All Selected Students"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Offer Letter Preview for {previewStudent?.personalInfo?.name}
        </DialogTitle>
        <DialogContent>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 2,
              maxHeight: '60vh',
              overflow: 'auto'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfferLetterPanel; 