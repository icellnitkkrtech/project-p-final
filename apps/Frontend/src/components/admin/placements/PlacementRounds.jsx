import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stepper, Step, StepLabel, FormControl, InputLabel, Select, MenuItem, Grid,
  IconButton, Snackbar, Alert, Chip, Paper, List, ListItem, ListItemText, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, useTheme, AppBar, Toolbar, useMediaQuery, Tooltip
} from "@mui/material";
import { AddCardRounded, Assignment, Category, Circle, Start, TrackChanges, Event, Close, HourglassEmpty, People, Edit, Assessment } from "@mui/icons-material";
import RoundStudents from "./RoundStudents";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { AccessTime, LocationOn, Schedule, Upcoming, Autorenew, CheckCircle } from "@mui/icons-material";
import placementService from "../../../services/admin/placementService";
import { motion, AnimatePresence } from "framer-motion";
import studentService from "../../../services/admin/studentService";

const RoundButton = styled(IconButton)(({ theme }) => ({
  width:35,
  height: 35,
  borderRadius: "50%",
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  transition: "all 0.3s ease",
  fontSize: "14px",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "gray",
  },
}));

const getStatusChipColor = (status) => {
  switch (status) {
    case "completed":
      return "info";
    case "ongoing":
      return "success";
    case "upcoming":
      return "default";
    default:
      return "default";
  }
};

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    marginTop: theme.spacing(1),
    fontWeight: 500,
    fontSize: '0.75rem',
    lineHeight: 1.2,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    '&.Mui-active': {
      fontWeight: 700,
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      fontWeight: 600,
      color: theme.palette.success.main,
    },
  },
}));

const ResponsiveStepper = styled(Stepper)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  rowGap: theme.spacing(2),
  width: "100%",
  my: theme.spacing(4),
  px: theme.spacing(2),
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiStep-root': {
      flex: '1 1 calc(25% - 10px)',
      maxWidth: '25%',
      minWidth: '80px',
    },
  },
  [theme.breakpoints.up('sm')]: {
    '& .MuiStep-root': {
      flex: '1 1 calc(12.5% - 10px)',
      maxWidth: '12.5%',
      minWidth: '100px',
    },
  },
}));

const MotionCard = motion(Card);

const ResponsiveRoundCard = styled(MotionCard)(({ theme, status }) => ({
  width: '100%',
  margin: theme.spacing(2, 'auto'),
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderLeft: `4px solid ${status === 'completed' 
    ? (theme.palette.mode === 'dark' ? '#1976D2' : '#1976D2')
    : status === 'ongoing'
      ? (theme.palette.mode === 'dark' ? '#81C784' : '#4CAF50')
      : status === 'upcoming'
        ? (theme.palette.mode === 'dark' ? '#616161' : '#424242')
        : (theme.palette.mode === 'dark' ? '#9E9E9E' : '#757575')}`,
  backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper}, ${
    status === 'completed' 
      ? (theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.05)' : 'rgba(25, 118, 210, 0.05)')
      : status === 'ongoing'
        ? (theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.05)' : 'rgba(76, 175, 80, 0.05)')
        : status === 'upcoming'
          ? (theme.palette.mode === 'dark' ? 'rgba(97, 97, 97, 0.05)' : 'rgba(66, 66, 66, 0.05)')
          : (theme.palette.mode === 'dark' ? 'rgba(158, 158, 158, 0.05)' : 'rgba(117, 117, 117, 0.05)')
  })`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: '600px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    margin: theme.spacing(1, 'auto'),
  },
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50],
  '& .MuiTypography-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
  },
}));

const ResponsiveToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '64px',
  padding: theme.spacing(1, 2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    minHeight: '56px',
    padding: theme.spacing(1),
    '& .MuiTypography-root': {
      fontSize: '1rem',
    },
    '& .MuiButton-root': {
      padding: theme.spacing(0.5, 1),
      fontSize: '0.75rem',
      '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.5),
      },
    },
  },
}));

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const PlacementRounds = ({ placementId, placementTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [roundDetails, setRoundDetails] = useState(null); // Stores details of all rounds
  const [loading, setLoading] = useState(true); // Loading state while fetching data
  const [error, setError] = useState(false); // Error state for API failures
  const [rounds, setRounds] = useState([]); // Array of all rounds
  const [selectedRound, setSelectedRound] = useState(null); // Currently selected round
  const [editRound, setEditRound] = useState(null); // Round being edited
  const [hover, setHover] = useState(false); // Hover state for UI elements
  const [openStudentDialog, setOpenStudentDialog] = useState(false); // Dialog for viewing students
  const [openEditDialog, setOpenEditDialog] = useState(false); // Dialog for editing round
  const [openNewRoundDialog, setOpenNewRoundDialog] = useState(false); // Dialog for adding new round
  const [openResultDialog, setOpenResultDialog] = useState(false); // Dialog for viewing/declaring results
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  }); // For showing notifications
  const [roundResult, setRoundResult] = useState({
    resultMessage: "",
    resultDescription: ""
  });
  const [resultData, setResultData] = useState({
    resultMessage: "",
    resultDescription: ""
  });
  const [showResult, setShowResult] = useState(false); // Toggle for showing results
  const [openDeclareResultDialog, setOpenDeclareResultDialog] = useState(false);
  const [appearedStudents, setAppearedStudents] = useState({});
  const [[page, direction], setPage] = useState([0, 0]);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState({});
  const [appearedStudentDetails, setAppearedStudentDetails] = useState({});
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  const [roundName, setRoundName] = useState('');
  const [roundNumber, setRoundNumber] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [venue, setVenue] = useState('');
  const [roundDurationHours, setRoundDurationHours] = useState(0);
  const [roundDurationMinutes, setRoundDurationMinutes] = useState(0);
  const [editingRound, setEditingRound] = useState(null);
  const [roundStatus, setRoundStatus] = useState('upcoming');

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return theme.palette.mode === 'dark' ? '#64B5F6' : '#2196F3';
      case "ongoing":
        return theme.palette.mode === 'dark' ? '#81C784' : '#4CAF50';
      case "upcoming":
        return theme.palette.mode === 'dark' ? '#616161' : '#424242';
      default:
        return theme.palette.mode === 'dark' ? '#9E9E9E' : '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ongoing":
        return <Autorenew fontSize="small" sx={{ color: getStatusColor("ongoing") }} />;
      case "upcoming":
        return <Upcoming fontSize="small" sx={{ color: getStatusColor("upcoming") }} />;
      case "completed":
        return <CheckCircle fontSize="small" sx={{ color: getStatusColor("completed") }} />;
      default:
        return <Circle fontSize="small" sx={{ color: getStatusColor("default") }} />;
    }
  };

  const fetchRoundDetails = async () => {
    try {
      setLoading(true);
      const response = await placementService.getRoundDetails(placementId);
      console.log("Rounds",response.rounds);
      console.log("Round Details",response);
      setRoundDetails(response);
      setRounds(response.rounds || []);
      if (response.rounds && response.rounds.length > 0) {
        setSelectedRound(response.rounds[0]);
      } else {
        setSelectedRound(null);
      }
      setAppearedStudents(response.appearedStudents || {});
    } catch (err) {
      console.log("Error",err);
      setError("Failed to load placement rounds.");
      setRounds([]);
      setSelectedRound(null);
    } finally {
      setLoading(false);
    }
  };

  const [newRound, setNewRound] = useState({
    roundNumber: "",
    roundName: "",
    details: "",
    roundType: "",
    roundDate: "",
    roundDurationHours: "",
    roundDurationMinutes: "",
    roundStatus: "",
    venue: "",
  });

  useEffect(() => {
    fetchRoundDetails();
  }, [placementId]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!roundResult) return;
      
      // Extract student IDs from the round result
      const selectedIds = roundResult.selectedStudents?.map(student => 
        typeof student === 'string' ? student : student._id
      ).filter(Boolean) || [];
      
      const appearedIds = roundResult.appearedStudents?.map(student => 
        typeof student === 'string' ? student : student._id
      ).filter(Boolean) || [];
      
      if (selectedIds.length === 0 && appearedIds.length === 0) return;
      
      setLoadingStudentDetails(true);
      
      try {
        // Create a Set to avoid duplicate fetches
        const uniqueIds = [...new Set([...selectedIds, ...appearedIds])];
        
        // Fetch details for each student
        const detailsMap = {};
        
        for (const id of uniqueIds) {
          try {
            const studentData = await studentService.getStudentById(id);
            detailsMap[id] = studentData;
          } catch (error) {
            console.error(`Error fetching details for student ${id}:`, error);
          }
        }
        
        setSelectedStudentDetails(detailsMap);
        setAppearedStudentDetails(detailsMap);
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoadingStudentDetails(false);
      }
    };
    
    fetchStudentDetails();
  }, [roundResult]);

  const handleRoundClick = (index) => {
    const currentIndex = rounds.findIndex(r => r._id === selectedRound?._id);
    setPage([index, index > currentIndex ? 1 : -1]);
    setSelectedRound(rounds[index]);
  };

  const handleOpenStudentDialog = () => {
    setOpenStudentDialog(true);
  };

  const handleOpenEditDialog = () => {
    if (selectedRound) {
      setEditingRound(selectedRound);
      setRoundName(selectedRound.roundName || '');
      setRoundNumber(selectedRound.roundNumber || '');
      setStartTime(selectedRound.startTime ? new Date(selectedRound.startTime) : null);
      setEndTime(selectedRound.endTime ? new Date(selectedRound.endTime) : null);
      setVenue(selectedRound.venue || '');
      setRoundDurationHours(selectedRound.roundDurationHours || 0);
      setRoundDurationMinutes(selectedRound.roundDurationMinutes || 0);
      setRoundStatus(selectedRound.roundStatus || 'upcoming');
      setOpenEditDialog(true);
    }
  };
  

  const handleOpenNewRoundDialog = () => {
    // Initialize new round with default values
    setNewRound({
      roundNumber: rounds.length + 1,
      roundName: "",
      roundType: "online",
      roundDate: "",
      roundDurationHours: "",
      roundDurationMinutes: "",
      venue: "",
      roundStatus: "upcoming",
      details: "",
    });
    setOpenNewRoundDialog(true);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add this constant for round options - matching SelectionProcessSteps.jsx
  const roundOptions = [
    { value: 'resumeShortlisting', label: 'Resume Shortlisting', color: '#4caf50' },
    { value: 'aptitudeTest', label: 'Aptitude Test', color: '#2196f3' },
    { value: 'technicalTest', label: 'Technical Test', color: '#ff9800' },
    { value: 'groupDiscussion', label: 'Group Discussion', color: '#9c27b0' },
    { value: 'technicalInterview', label: 'Technical Interview', color: '#f44336' },
    { value: 'hrInterview', label: 'HR Interview', color: '#795548' },
    { value: 'codingTest', label: 'Coding Test', color: '#607d8b' },
    { value: 'caseStudy', label: 'Case Study', color: '#00bcd4' },
    { value: 'presentationRound', label: 'Presentation Round', color: '#673ab7' }
  ];

  const handleAddNewRound = async () => {
    if (!newRound.roundName || !newRound.roundDate || !newRound.roundDurationHours) {
      setSnackbar({ open: true, message: "Please fill all required fields", severity: "error" });
      return;
    }

    try {
      const roundData = {
        roundNumber: rounds.length + 1,
        roundName: newRound.roundName,
        details: newRound.details,
        roundType: newRound.roundType,
        roundDate: new Date(newRound.roundDate).toISOString(),
        roundDuration: `${newRound.roundDurationHours}h ${newRound.roundDurationMinutes || 0}m`,
        roundStatus: "upcoming",
        venue: newRound.venue,
      };

      const response = await placementService.addRound(placementId, roundData);
      if (response) {
        setSnackbar({ open: true, message: "New round added successfully!", severity: "success" });
        fetchRoundDetails();
        setOpenNewRoundDialog(false);
        setNewRound({
          roundNumber: "",
          roundName: "",
          details: "",
          roundType: "",
          roundDate: "",
          roundDurationHours: "",
          roundDurationMinutes: "",
          roundStatus: "",
          venue: "",
        });
      }
    } catch (error) {
      console.error("Add round error:", error);
      setSnackbar({ open: true, message: "Failed to add round", severity: "error" });
    }
  };
  
  const handleUpdateRound = async () => {
    if (!editingRound) return;
    
    setLoading(true);
    try {
      // Only send the necessary round data, not the entire placement object
      const roundData = {
        roundName,
        roundNumber: parseInt(roundNumber),
        startTime,
        endTime,
        venue,
        roundDurationHours: parseInt(roundDurationHours) || 0,
        roundDurationMinutes: parseInt(roundDurationMinutes) || 0,
        // Include the round status
        roundStatus
      };
      
      console.log("Updating round with data:", roundData);
      
      const response = await placementService.updateRound(
        placementId, 
        editingRound._id, 
        roundData
      );
      
      if (response.success) {
        setSnackbar({ open: true, message: "Round updated successfully!", severity: "success" });
        setOpenEditDialog(false);
        fetchRoundDetails();
      } else {
        setSnackbar({ open: true, message: response.message || "Failed to update round", severity: "error" });
      }
    } catch (error) {
      console.error("Error updating round:", error);
      setSnackbar({ open: true, message: "Error updating round: " + (error.message || "Unknown error"), severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleNewRoundChange = (event) => {
    setNewRound({ ...newRound, [event.target.name]: event.target.value });
  };

  const handleEditRoundChange = (event) => {
    setEditingRound({ ...editingRound, [event.target.name]: event.target.value });
  };

  const handleDeclareResult = async () => {
      if (!resultData.resultMessage || !resultData.resultDescription || !selectedRound) {
        setSnackbar({
          open: true,
          message: "Please fill all required fields",
          severity: "error"
        });
        return;
      }

      try{
        const resultDeclare ={
          resultMessage: resultData.resultMessage,
          resultDescription: resultData.resultDescription,
        };

        const response = await placementService.declareResults(placementId, selectedRound._id, resultDeclare);

      // Check if response exists and handle accordingly
      if (response) {
        setSnackbar({
          open: true,
          message: "Results declared successfully!",
          severity: "success"
        });
        setOpenDeclareResultDialog(false);
        setResultData({
          resultMessage: "",
          resultDescription: ""
        });
        fetchRoundDetails();
      } else {
        throw new Error(response?.message || "Failed to declare results");
      }
    } catch (error) {
      console.error("Error declaring results:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to declare results",
        severity: "error"
      });
    }
  };

  const handleViewResults = async () => {
    if (!selectedRound) {
      setSnackbar({
        open: true,
        message: "No round selected",
        severity: "error"
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching results for round:", selectedRound._id);
      
      // Use the detailed results endpoint
      const detailedResults = await placementService.getDetailedResults(placementId, selectedRound._id);
      
      console.log("Received results:", detailedResults);
      setRoundResult(detailedResults);
      setOpenResultDialog(true);
    } catch (error) {
      console.error("Error fetching round results:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to fetch round results",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelection = async (roundId, student) => {
    try {
      await placementService.updateSelectedStudents(placementId, roundId, student._id);
      
      // Refresh the appeared students data
      const updatedStudents = await placementService.getAppearedStudentsForRound(placementId, roundId);
      setAppearedStudents(prev => ({
        ...prev,
        [roundId]: updatedStudents
      }));

      setSnackbar({
        open: true,
        message: "Student selected successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error selecting student:", error);
      setSnackbar({
        open: true,
        message: "Failed to select student",
        severity: "error"
      });
    }
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2 }, position: 'relative', height: 'auto', overflow: 'hidden' }}>

      {/* Toast Notification */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Toolbar with Add New Round Button */}
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{ 
          mb: 3,
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ResponsiveToolbar>
          <Typography 
            variant="h6" 
            color="text.primary"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' },
              fontWeight: 600,
            }}
          >
            {placementTitle}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<AddIcon />}
              onClick={handleOpenNewRoundDialog}
              size={isMobile ? "small" : "medium"}
              sx={{
                minWidth: { xs: 'auto', sm: '140px' },
                whiteSpace: 'nowrap',
              }}
            >
              New Round
            </Button>
          </Box>
        </ResponsiveToolbar>
      </AppBar>

      {/* Stepper Section */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <ResponsiveStepper
          activeStep={selectedRound ? rounds.findIndex(r => r._id === selectedRound._id) : 0}
          alternativeLabel
        >
          {rounds.map((round, i) => (
            <Step 
              key={i} 
              onClick={() => handleRoundClick(i)} 
              completed={round.roundStatus === "completed"}
              sx={{ 
                cursor: "pointer",
                '& .MuiStepLabel-root': {
                  maxWidth: '100%',
                  overflow: 'hidden',
                },
              }}
            >
              <StyledStepLabel StepIconComponent={() => (
                <Box sx={{
                  width: isMobile ? 28 : 36,
                  height: isMobile ? 28 : 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedRound && selectedRound._id === round._id 
                    ? getStatusColor(round.roundStatus)
                    : theme.palette.background.paper,
                  border: `1px solid ${getStatusColor(round.roundStatus)}`,
                  color: selectedRound && selectedRound._id === round._id 
                    ? theme.palette.background.paper 
                    : getStatusColor(round.roundStatus),
                  fontWeight: 600,
                  fontSize: isMobile ? 12 : 14,
                  transition: 'all 0.3s ease',
                  boxShadow: theme.shadows[1],
                }}>
                  {i + 1}
                </Box>
              )}>
                <Typography 
                  variant="caption"
                  sx={{ 
                    fontWeight: selectedRound && selectedRound._id === round._id ? 600 : 500,
                    color: selectedRound && selectedRound._id === round._id 
                      ? getStatusColor(round.roundStatus)
                      : theme.palette.text.primary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    textAlign: 'center',
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                  }}
                >
                  {round.roundName}
                </Typography>
                <Chip
                  label={round.roundStatus.toUpperCase()}
                  size="small"
                  color={getStatusChipColor(round.roundStatus)}
                  sx={{ 
                    mt: 0.5,
                    fontWeight: 500,
                    fontSize: isMobile ? '0.6rem' : '0.7rem',
                    height: isMobile ? 20 : 24,
                    '& .MuiChip-label': {
                      px: isMobile ? 0.5 : 1,
                    },
                  }}
                />
              </StyledStepLabel>
            </Step>
          ))}
        </ResponsiveStepper>
      </Box>

      {/* Display Selected Round */}
      <Box sx={{ position: 'relative', minHeight: '400px', mb: 4 }}>
        <AnimatePresence initial={false} custom={direction}>
          {selectedRound && (
            <ResponsiveRoundCard
              key={selectedRound._id}
              status={selectedRound.roundStatus}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.3 }
              }}
              sx={{
                position: 'absolute',
                width: '100%',
                left: 0,
                right: 0
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"}
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1.5,
                    mb: 3,
                    color: getStatusColor(selectedRound.roundStatus),
                    fontWeight: 600,
                  }}
                >
                  <TrackChanges fontSize={isMobile ? "small" : "medium"} />
                  {selectedRound.roundName} {selectedRound.roundNumber && `(Round ${selectedRound.roundNumber})`}
                </Typography>

                <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
                  {[
                    ["Type", "roundType", Assignment],
                    ["Date", selectedRound.startTime ? new Date(selectedRound.startTime).toLocaleDateString() : selectedRound.roundDate, Event],
                    ["Time", selectedRound.startTime ? new Date(selectedRound.startTime).toLocaleTimeString() : "Not specified", AccessTime],
                    ["Duration", "roundDuration", HourglassEmpty],
                    ["Venue", "venue", LocationOn],
                    ["Students", `${selectedRound.appearedStudents?.length || 0} appeared / ${selectedRound.selectedStudents?.length || 0} selected`, People]
                  ].map(([label, value, Icon]) => (
                    <Grid item xs={12} sm={6} key={label}>
                      <DetailItem>
                        <Icon sx={{ color: getStatusColor(selectedRound.roundStatus) }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            {label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {typeof value === 'string' ? (selectedRound[value] || value) : value}
                          </Typography>
                        </Box>
                      </DetailItem>
                    </Grid>
                  ))}
                </Grid>

                {selectedRound.details && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Details
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                      <Typography variant="body2">
                        {selectedRound.details}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1.5,
                  mb: 3,
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? `${getStatusColor(selectedRound.roundStatus)}20`
                    : `${getStatusColor(selectedRound.roundStatus)}10`,
                }}>
                  {getStatusIcon(selectedRound.roundStatus)}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Status:
                  </Typography>
                  <Chip
                    label={selectedRound.roundStatus.charAt(0).toUpperCase() + selectedRound.roundStatus.slice(1)}
                    color={getStatusChipColor(selectedRound.roundStatus)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  
                  {selectedRound.resultMessage && (
                    <Tooltip title="Results have been declared">
                      <Chip
                        icon={<CheckCircle fontSize="small" />}
                        label="Results Declared"
                        color="success"
                        size="small"
                        sx={{ ml: 'auto', fontWeight: 500 }}
                      />
                    </Tooltip>
                  )}
                </Box>

                <Box sx={{ 
                  display: "flex", 
                  gap: 1.5, 
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}>
                  {selectedRound.roundStatus === "ongoing" && (
                    <>
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        onClick={handleOpenStudentDialog} 
                        startIcon={<List />}
                      >
                        Manage Students
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        size="medium"
                        onClick={() => setOpenDeclareResultDialog(true)}
                        startIcon={<Event />}
                        sx={{ fontWeight: 500 }}
                      >
                        Declare Results
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        size="medium"
                        onClick={handleOpenEditDialog}
                        startIcon={<Edit />}
                        sx={{ fontWeight: 500 }}
                      >
                        Edit Round
                      </Button>
                    </>
                  )}
                  {selectedRound.roundStatus === "upcoming" && (
                    <>
                    <Button
                      variant="outlined"
                      color="default"
                      size="medium"
                      onClick={handleOpenEditDialog}
                      startIcon={<Edit />}
                      sx={{ fontWeight: 500 }}
                    >
                      Edit Round
                    </Button>
                     <Button
                     variant="contained"
                     color="primary"
                     size="medium"
                     onClick={async () => {
                       try {
                         if (!selectedRound) {
                           setSnackbar({
                             open: true,
                             message: "No round selected",
                             severity: "error"
                           });
                           return;
                         }
                         
                         // Update round status to ongoing
                         await placementService.updateRound(placementId, selectedRound._id, {
                           ...selectedRound,
                           roundStatus: "ongoing"
                         });
                         
                         // Refresh round details
                         fetchRoundDetails();
                         
                         setSnackbar({
                           open: true,
                           message: "Round started successfully",
                           severity: "success"
                         });
                        } catch (error) {
                          console.error("Error starting round:", error);
                          setSnackbar({
                            open: true,
                            message: error.message || "Failed to start round",
                            severity: "error"
                          });
                        }
                      }}
                      startIcon={<Start />}
                      sx={{ fontWeight: 500 }}
                    >
                      Start Round
                    </Button>
                    </>
                  )}
                  {selectedRound.roundStatus === "completed" && (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        onClick={handleViewResults}
                        startIcon={<Assessment />}
                        sx={{ fontWeight: 500 }}
                      >
                        View Results
                      </Button>
                      {!selectedRound.resultMessage && (
                        <Button
                          variant="outlined"
                          color="success"
                          size="medium"
                          onClick={() => setOpenDeclareResultDialog(true)}
                          startIcon={<Event />}
                          sx={{ fontWeight: 500 }}
                        >
                          Declare Results
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              </CardContent>
            </ResponsiveRoundCard>
          )}
        </AnimatePresence>
      </Box>

      {selectedRound && (
        <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Manage Students</Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpenStudentDialog(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <RoundStudents roundId = {selectedRound._id} placementId= {placementId}/>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          Edit Round
          <IconButton
            aria-label="close"
            onClick={() => setOpenEditDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Round Name"
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Round Number"
                type="number"
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Time"
                type="datetime-local"
                value={startTime ? startTime.toISOString().slice(0, 16) : ''}
                onChange={(e) => setStartTime(new Date(e.target.value))}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Time"
                type="datetime-local"
                value={endTime ? endTime.toISOString().slice(0, 16) : ''}
                onChange={(e) => setEndTime(new Date(e.target.value))}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Round Status</InputLabel>
                <Select
                  value={roundStatus}
                  onChange={(e) => setRoundStatus(e.target.value)}
                  label="Round Status"
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (Hours)"
                type="number"
                value={roundDurationHours}
                onChange={(e) => setRoundDurationHours(Number(e.target.value))}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (Minutes)"
                type="number"
                value={roundDurationMinutes}
                onChange={(e) => setRoundDurationMinutes(Number(e.target.value))}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0, max: 59 } }}
              />
            </Grid>
            {roundStatus === 'completed' && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  <strong>Warning:</strong> Changing a round to "completed" status will finalize the selection process for this round. Make sure all student selections are finalized before proceeding.
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateRound} 
            variant="contained" 
            color="primary"
            disabled={loading || !roundName || !roundNumber || !startTime || !endTime || !roundStatus}
          >
            {loading ? <CircularProgress size={24} /> : "Update Round"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Round Dialog */}
      <Dialog open={openNewRoundDialog} onClose={() => setOpenNewRoundDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Round</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="round-name-label">Round Name</InputLabel>
                <Select
                  labelId="round-name-label"
                  value={newRound.roundName}
                  onChange={(e) => setNewRound({ ...newRound, roundName: e.target.value })}
                  label="Round Name"
                  required
                >
                  {roundOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: option.color 
                          }} 
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="round-type-label">Round Type</InputLabel>
                <Select
                  labelId="round-type-label"
                  value={newRound.roundType}
                  onChange={(e) => setNewRound({ ...newRound, roundType: e.target.value })}
                  label="Round Type"
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Round Date"
                type="date"
                value={newRound.roundDate}
                onChange={(e) => setNewRound({ ...newRound, roundDate: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Venue"
                value={newRound.venue}
                onChange={(e) => setNewRound({ ...newRound, venue: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (Hours)"
                type="number"
                value={newRound.roundDurationHours}
                onChange={(e) => setNewRound({ ...newRound, roundDurationHours: e.target.value })}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (Minutes)"
                type="number"
                value={newRound.roundDurationMinutes}
                onChange={(e) => setNewRound({ ...newRound, roundDurationMinutes: e.target.value })}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0, max: 59 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Details (Optional)"
                multiline
                rows={3}
                value={newRound.details}
                onChange={(e) => setNewRound({ ...newRound, details: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewRoundDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddNewRound} 
            variant="contained" 
            color="primary"
            disabled={!newRound.roundName || !newRound.roundDate || !newRound.roundDurationHours}
          >
            Add Round
          </Button>
        </DialogActions>
      </Dialog>

      {/* Declare Result Dialog */}
      <Dialog 
        open={openDeclareResultDialog} 
        onClose={() => {
          setOpenDeclareResultDialog(false);
          setResultData({
            resultMessage: "",
            resultDescription: ""
          });
        }} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Declare Round Results</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Result Message"
            value={resultData.resultMessage}
            onChange={(e) => setResultData({...resultData, resultMessage: e.target.value})}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Result Description"
            multiline
            rows={4}
            value={resultData.resultDescription}
            onChange={(e) => setResultData({...resultData, resultDescription: e.target.value})}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDeclareResultDialog(false);
            setResultData({
              resultMessage: "",
              resultDescription: ""
            });
          }}>Cancel</Button>
          <Button 
            onClick={handleDeclareResult} 
            variant="contained" 
            color="primary"
            disabled={!resultData.resultMessage || !resultData.resultDescription}
          >
            Declare Results
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Result Dialog */}
      <Dialog 
        open={openResultDialog} 
        onClose={() => setOpenResultDialog(false)} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedRound?.roundName || 'Round'} Results
          </Typography>
          <IconButton onClick={() => setOpenResultDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Paper elevation={3} sx={{ p: 3, mt: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      Round Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2">
                        <strong>Round Name:</strong> {roundResult?.roundName || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Round Number:</strong> {roundResult?.roundNumber || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Round Type:</strong> {roundResult?.roundType || 'Not specified'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong> {roundResult?.startTime ? new Date(roundResult.startTime).toLocaleDateString() : 'Not specified'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Duration:</strong> {roundResult?.roundDuration || 'Not specified'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Venue:</strong> {roundResult?.venue || 'Not specified'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {roundResult?.roundStatus || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      Result Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2">
                        <strong>Result Declared:</strong> {roundResult?.resultDeclaredAt ? new Date(roundResult.resultDeclaredAt).toLocaleString() : 'Not available'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Selected Students:</strong> {roundResult?.totalSelected || roundResult?.selectedStudents?.length || 0}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Total Appeared:</strong> {roundResult?.totalAppeared || roundResult?.appearedStudents?.length || 0}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Selection Rate:</strong> {
                          (roundResult?.totalAppeared || roundResult?.appearedStudents?.length) > 0 
                            ? `${(((roundResult?.totalSelected || roundResult?.selectedStudents?.length) / 
                                   (roundResult?.totalAppeared || roundResult?.appearedStudents?.length)) * 100).toFixed(1)}%` 
                            : 'N/A'
                        }
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="h6" gutterBottom>
                Result Message
              </Typography>
              <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                <Typography variant="body1" paragraph>
                  {roundResult?.resultMessage || 'No result message available'}
                </Typography>
              </Paper>

              <Typography variant="h6" gutterBottom>
                Result Description
              </Typography>
              <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                <Typography variant="body1" paragraph>
                  {roundResult?.resultDescription || 'No result description available'}
                </Typography>
              </Paper>

              {/* Selected Students Table */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Selected Students ({roundResult?.selectedStudents?.length || 0})
              </Typography>
              {loadingStudentDetails ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : roundResult?.selectedStudents?.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Roll Number</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Batch</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roundResult.selectedStudents.map((student, index) => {
                        const studentId = typeof student === 'string' ? student : student._id;
                        const studentData = selectedStudentDetails[studentId]?.data;
                        
                        return (
                          <TableRow key={studentId || index}>
                            <TableCell>{studentData?.personalInfo?.name || 'N/A'}</TableCell>
                            <TableCell>{studentData?.personalInfo?.rollNumber || 'N/A'}</TableCell>
                            <TableCell>{studentData?.personalInfo?.department || 'N/A'}</TableCell>
                            <TableCell>{studentData?.personalInfo?.batch || 'N/A'}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  No selected students data available
                </Typography>
              )}

              {/* Appeared Students Table */}
              <Typography variant="h6" gutterBottom>
                Appeared Students ({roundResult?.appearedStudents?.length || 0})
              </Typography>
              {loadingStudentDetails ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : roundResult?.appearedStudents?.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Roll Number</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Batch</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roundResult.appearedStudents.map((student, index) => {
                        const studentId = typeof student === 'string' ? student : student._id;
                        const studentData = appearedStudentDetails[studentId]?.data;
                        
                        return (
                          <TableRow key={studentId || index}>
                            <TableCell>{studentData?.personalInfo?.name || 'N/A'}</TableCell>
                            <TableCell>{studentData?.personalInfo?.rollNumber || 'N/A'}</TableCell>
                            <TableCell>{studentData?.personalInfo?.department || 'N/A'}</TableCell>
                            <TableCell>{studentData?.personalInfo?.batch || 'N/A'}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  No appeared students data available
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            onClick={() => setOpenResultDialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlacementRounds;