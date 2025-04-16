// apps/Frontend/src/components/student/sections/Applications/OfferLetterView.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  IconButton,
  Chip
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "../../axios";
import { 
  Description, 
  BusinessCenter, 
  LocationOn, 
  AttachMoney, 
  CalendarToday,
  Check,
  Close,
  EventNote,
  CloseRounded
} from "@mui/icons-material";

const OfferLetterView = ({ application, open, onClose, onResponseSubmitted, placementId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [placementData, setPlacementData] = useState(null);
  const [offerLetter, setOfferLetter] = useState(null);
  const [studentData, setStudentData] = useState(null);

  // Fetch the placement data and student data
  useEffect(() => {
    const fetchData = async () => {
      if (!application) return;
      
      try {
        // Get the placement ID from the application or use the provided one
        const driveId = placementId || application.placementDrive?._id || application.placementDrive;
        
        if (driveId) {
          const placementResponse = await axios.get(`/placement/${driveId}/getone`);
          
          if (placementResponse.data) {
            setPlacementData(placementResponse.data);
            
            // Find the offer letter for this student
            if (placementResponse.data.offerLetters && placementResponse.data.offerLetters.length > 0) {
              const studentId = application.student?._id || application.student;
              const studentOffer = placementResponse.data.offerLetters.find(
                offer => offer.studentId === studentId
              );
              
              if (studentOffer) {
                setOfferLetter(studentOffer);
                
                // Fetch student data to get the name
                try {
                  const studentResponse = await axios.get(`/student/profile/${studentId}`);
                  if (studentResponse.data && studentResponse.data.data) {
                    setStudentData(studentResponse.data.data);
                  }
                } catch (studentErr) {
                  console.error("Error fetching student data:", studentErr);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load offer letter data");
      }
    };
    
    fetchData();
  }, [application, placementId]);

  if (!application) return null;

  // Get company and job details from the placement data
  const companyName = placementData?.companyDetails?.name || "Company";
  const jobTitle = placementData?.jobProfile?.designation || "Position";
  const location = placementData?.jobProfile?.placeOfPosting || "Not specified";
  const salary = placementData?.jobProfile?.ctc;
  
  // Get offer letter details
  const content = offerLetter?.content || "";
  const sentDate = offerLetter?.sentDate;
  const expiryDate = offerLetter?.expiryDate;
  const status = offerLetter?.status || "pending";
  
  // Replace placeholders in content with actual data
  let processedContent = content;
  if (content && studentData) {
    processedContent = content
      .replace('[STUDENT_NAME]', studentData.personalInfo?.name || 'Student')
      .replace('[START_DATE]', placementData?.jobProfile?.joiningDate ? 
        formatDate(placementData.jobProfile.joiningDate) : 'To be determined');
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    
    // If salary is in lakhs (less than 1 crore)
    if (salary < 10000000) {
      return `₹${(salary/100000).toFixed(1)} LPA`;
    }
    
    // If salary is in full amount
    return `₹${salary.toLocaleString()} per annum`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted':
      case 'accept':
        return 'success';
      case 'rejected':
      case 'reject':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'accepted':
      case 'accept':
        return 'Accepted';
      case 'rejected':
      case 'reject':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const handleResponse = async (responseType) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log("Responding to offer:", {
        placementId: placementData?._id,
        offerId: offerLetter?._id,
        status: responseType
      });
      
      // Use the correct API endpoint based on your backend structure
      const result = await axios.patch(
        `/placement/${placementData?._id}/offer-letters/${offerLetter?._id}`, 
        { status: responseType }
      );
      
      console.log("Response result:", result.data);
      
      if (result.data.success) {
        setSuccess(`Offer ${responseType === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
        
        // Update the local state
        setOfferLetter({
          ...offerLetter,
          status: responseType,
          responseDate: new Date()
        });
        
        // Notify parent component
        if (onResponseSubmitted) {
          onResponseSubmitted({
            ...application,
            offerDetails: {
              ...application.offerDetails,
              status: responseType,
              responseDate: new Date()
            }
          });
        }
      } else {
        setError(result.data.message || "Failed to update offer status");
      }
    } catch (err) {
      console.error("Error responding to offer:", err);
      setError(err.response?.data?.message || "An error occurred while responding to the offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: theme.palette.primary.main,
        color: 'white',
        py: 2
      }}>
        <Box display="flex" alignItems="center">
          <Description sx={{ mr: 1 }} />
          <Typography variant="h6">Offer Letter from {companyName}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box mb={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <BusinessCenter color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary.main">
                {companyName}
              </Typography>
              
              <Box ml="auto">
                <Chip 
                  label={getStatusLabel(status)}
                  color={getStatusColor(status)}
                  size="small"
                />
              </Box>
            </Box>
            
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Box display="flex" alignItems="center">
                <Description sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body1">
                  <strong>Position:</strong> {jobTitle}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <LocationOn sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body1">
                  <strong>Location:</strong> {location}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <AttachMoney sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body1">
                  <strong>Salary:</strong> {formatSalary(salary)}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <CalendarToday sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body1">
                  <strong>Joining Date:</strong> {formatDate(placementData?.jobProfile?.joiningDate)}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <EventNote sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body1">
                  <strong>Offer Expires:</strong> {formatDate(expiryDate)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        <Typography 
          variant="h6" 
          fontWeight="medium" 
          gutterBottom
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.primary.main,
            mb: 2
          }}
        >
          <Description sx={{ mr: 1 }} />
          Offer Letter Content
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            mb: 3,
            maxHeight: "300px",
            overflow: "auto",
            bgcolor: theme.palette.background.paper
          }}
        >
          {processedContent ? (
            <div dangerouslySetInnerHTML={{ __html: processedContent }} />
          ) : (
            <Typography variant="body1" color="text.secondary">
              No offer letter content available.
            </Typography>
          )}
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end' }}>
        {(!status || status === 'pending') && offerLetter?._id && (
          <>
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<Close />}
              onClick={() => handleResponse('rejected')}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Reject Offer
            </Button>
            <Button 
              variant="contained" 
              color="success"
              startIcon={<Check />}
              onClick={() => handleResponse('accepted')}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Accept Offer"}
            </Button>
          </>
        )}
        {(status && status !== 'pending') && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={onClose}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OfferLetterView;