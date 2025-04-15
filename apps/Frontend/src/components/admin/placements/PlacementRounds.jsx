import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stepper, Step, StepLabel, FormControl, InputLabel, Select, MenuItem, Grid,
  IconButton, Snackbar, Alert, Chip, Paper, List, ListItem, ListItemText, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, useTheme, AppBar, Toolbar, useMediaQuery
} from "@mui/material";
import { AddCardRounded, Assignment, Category, Circle, Start, TrackChanges, Event, Close } from "@mui/icons-material";
import RoundStudents from "./RoundStudents";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { AccessTime, LocationOn, Schedule, Upcoming, Autorenew, CheckCircle } from "@mui/icons-material";
import placementService from "../../../services/admin/placementService";
import { motion, AnimatePresence } from "framer-motion";

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
    case "ongoing":
      return "info";
    case "completed":
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
  borderLeft: `4px solid ${status === 'ongoing' 
    ? (theme.palette.mode === 'dark' ? '#1976D2' : '#1976D2')
    : status === 'completed'
      ? (theme.palette.mode === 'dark' ? '#81C784' : '#4CAF50')
      : status === 'upcoming'
        ? (theme.palette.mode === 'dark' ? '#616161' : '#424242')
        : (theme.palette.mode === 'dark' ? '#9E9E9E' : '#757575')}`,
  backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper}, ${
    status === 'ongoing' 
      ? (theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.05)' : 'rgba(25, 118, 210, 0.05)')
      : status === 'completed'
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

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return theme.palette.mode === 'dark' ? '#64B5F6' : '#2196F3';
      case "completed":
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
    const fetchRoundResult = async () => {
      try {
        if (!selectedRound) return;
        
        const result = await placementService.getResults(placementId, selectedRound._id);
        if (result) {
          setRoundResult({
            resultMessage: result.resultMessage,
            resultDescription: result.resultDescription
          });
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        console.error("Error fetching round result:", err);
        // Only set error for non-404 responses
        if (!err.message?.includes("No results found")) {
          setError(err.message || "Failed to fetch round result");
        }
      }
    };

    if (placementId && selectedRound) {
      fetchRoundResult();
    }
  }, [placementId, selectedRound]);

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
      setEditRound(selectedRound);
      setOpenEditDialog(true);
    }
  };
  

  const handleOpenNewRoundDialog = () => {
    // setNewRound({
    //   roundNumber: rounds.length + 1,
    //   roundName: "",
    //   roundType: "online",
    //   roundDate:"",
    //   roundDuration: "",
    //   venue: "",
    //   roundStatus: "upcoming",
    //   details: "",
    // });
    setOpenNewRoundDialog(true);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddNewRound = async () => {
    if (!newRound.roundName || !newRound.roundDate || !newRound.roundDurationHours) {
      alert("Please fill all required fields");
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
        venue: newRound.venue ,
      };
  
      const response = await placementService.addRound(placementId, roundData);
      if (response) {
        setSnackbar({ open: true, message: "New round added successfully!", severity: "success" });
        fetchRoundDetails();
        setOpenNewRoundDialog(false);
        // setNewRound({
        //   roundNumber: "",
        //   roundName: "",
        //   details: "",
        //   roundType: "",
        //   roundDate: "",
        //   roundDurationHours: "",
        //   roundDurationMinutes: "",
        //   roundStatus: "",
        //   venue: "",
        // });
      }
    } catch (error) {
      // console.error("Add round error:", error);
      setSnackbar({ open: true, message: "Failed to add round", severity: "error" });
    }
  };
  
  const handleUpdateRound = async () => {
    if (!editRound.roundName   ) {
      alert("Please fill all required fields");
      return;
    }
  
    try {
      const roundData = {
        round_id: editRound._id,
        roundNumber: editRound.roundNumber,
        roundName: editRound.roundName,
        details: editRound.details,
        roundType: editRound.roundType,
        roundDate: new Date(editRound.roundDate).toISOString().split("T")[0],
        roundDuration: `${editRound.roundDurationHours}h ${editRound.roundDurationMinutes || 0}m`,
        roundStatus: editRound.roundStatus,
        venue: editRound.venue,
        startTime: editRound.startTime,
      };
  
      const response = await placementService.updateRound(placementId, editRound._id, roundData);
      if (response.status === 200) {
        setSnackbar({ open: true, message: "Round updated successfully!", severity: "success" });
        setOpenEditDialog(false);
        fetchRoundDetails();
      }
    } catch (error) {
      // console.error("Update round error:", error);
      setSnackbar({ open: true, message: "Failed to update round", severity: "error" });
    }
  };  

  const handleNewRoundChange = (event) => {
    setNewRound({ ...newRound, [event.target.name]: event.target.value });
  };

  const handleEditRoundChange = (event) => {
    setEditRound({ ...editRound, [event.target.name]: event.target.value });
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
    try {
      setRoundResult(roundResult);
      setOpenResultDialog(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch results",
        severity: "error"
      });
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
                  {selectedRound.roundName}
                </Typography>

                <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
                  {[
                    ["Type", "roundType", Assignment],
                    ["Date", "roundDate", Event],
                    ["Time", "roundDuration", AccessTime],
                    ["Venue", "venue", LocationOn]
                  ].map(([label, value, Icon]) => (
                    <Grid item xs={12} sm={6} key={label}>
                      <DetailItem>
                        <Icon sx={{ color: getStatusColor(selectedRound.roundStatus) }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            {label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {selectedRound[value] || 'Not specified'}
                          </Typography>
                        </Box>
                      </DetailItem>
                    </Grid>
                  ))}
                </Grid>

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
                        color="primary"
                        size="medium"
                        onClick={handleOpenStudentDialog}
                        startIcon={<List />}
                        sx={{ fontWeight: 500 }}
                      >
                        Manage Students
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        onClick={() => setOpenDeclareResultDialog(true)}
                        startIcon={<Event />}
                        sx={{ fontWeight: 500 }}
                      >
                        Declare Results
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        onClick={handleOpenEditDialog}
                        startIcon={<Event />}
                        sx={{ fontWeight: 500 }}
                      >
                        Edit Round
                      </Button>
                    </>
                  )}
                  {selectedRound.roundStatus === "upcoming" && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      onClick={handleOpenEditDialog}
                      startIcon={<Event />}
                      sx={{ fontWeight: 500 }}
                    >
                      Edit Round
                    </Button>
                  )}
                  {selectedRound.roundStatus === "completed" && (
                    <Button 
                      variant="outlined"
                      color="success"
                      size="medium"
                      onClick={handleViewResults}
                      startIcon={<AccessTime />}
                      sx={{ fontWeight: 500 }}
                    >
                      View Results
                    </Button>
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

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Round</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Round Name"
            name="roundName"
            value={editRound?.roundName || ""}
            onChange={handleEditRoundChange}
            required
          />
          
          <TextField
            fullWidth
            margin="dense"
            label="Start Time"
            name="startTime"
            type="datetime-local"
            value={editRound?.startTime ? new Date(editRound.startTime).toISOString().slice(0, 16) : ""}
            onChange={handleEditRoundChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <TextField
            fullWidth
            margin="dense"
            label="Venue"
            name="venue"
            value={editRound?.venue || ""}
            onChange={handleEditRoundChange}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Round Type</InputLabel>
            <Select
              name="roundType"
              value={editRound?.roundType || "online"}
              onChange={handleEditRoundChange}
              label="Round Type"
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>

          {/* New Round Status Field */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Round Status</InputLabel>
            <Select
              name="roundStatus"
              value={editRound?.roundStatus || "upcoming"}
              onChange={handleEditRoundChange}
              label="Round Status"
            >
              <MenuItem value="upcoming">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Upcoming fontSize="small" sx={{ color: "purple" }} />
                  Upcoming
                </Box>
              </MenuItem>
              <MenuItem value="ongoing">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Autorenew fontSize="small" sx={{ color: "blue" }} />
                  Ongoing
                </Box>
              </MenuItem>
              <MenuItem value="completed">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle fontSize="small" sx={{ color: "green" }} />
                  Completed
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateRound} variant="contained" color="primary">
            Update Round
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openNewRoundDialog} onClose={() => setOpenNewRoundDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Round</DialogTitle>
        <DialogContent>
          {[
            { label: "Round Name", name: "roundName", type: "text", value: newRound.roundName },
            { label: "Round Date", name: "roundDate", type: "date", value: newRound.roundDate },
            { label: "Venue", name: "venue", type: "text", value: newRound.venue }
          ].map(({ label, name, type, value }) => (
            <TextField key={name} fullWidth margin="dense" label={label} name={name} type={type} value={value} onChange={handleNewRoundChange} variant="outlined" InputLabelProps={{ shrink: true }} />
          ))}
          
          <FormControl size="small" fullWidth margin="dense" variant="outlined">
            <InputLabel>Round Type</InputLabel>
            <Select name="roundType" value={newRound.roundType} onChange={handleNewRoundChange} label="Round Type">
              {["online", "offline"].map(type => <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>)}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            {["Hours", "Minutes"].map((unit, i) => (
              <Grid key={unit} item xs={6}>
                <TextField fullWidth margin="dense" type="number" label={`Duration (${unit})`} name={`roundDuration${unit}`} value={newRound[`roundDuration${unit}`]} onChange={handleNewRoundChange} variant="outlined" inputProps={{ min: 0, ...(i ? { max: 59 } : {}) }} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewRoundDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddNewRound} color="primary" variant="contained">Add Round</Button>
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
        <DialogTitle>Round Results</DialogTitle>
        <DialogContent>
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Result Message
            </Typography>
            <Typography variant="body1" paragraph>
              {roundResult.resultMessage}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Result Description
            </Typography>
            <Typography variant="body1" paragraph>
              {roundResult.resultDescription}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResultDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlacementRounds;