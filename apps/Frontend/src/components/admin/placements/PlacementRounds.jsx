import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Stepper, Step, StepLabel, FormControl, InputLabel, Select, MenuItem, Grid,
  IconButton, Snackbar, Alert, Chip, Paper, List, ListItem, ListItemText, CircularProgress
} from "@mui/material";
import { AddCardRounded, Assignment, Category, Circle, Start, TrackChanges, Event, Edit as EditIcon } from "@mui/icons-material";
import RoundStudents from "./RoundStudents";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { AccessTime, LocationOn, Schedule, Upcoming, Autorenew, CheckCircle } from "@mui/icons-material";
import placementService from "../../../services/admin/placementService";

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

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "ongoing":
      return "primary"; // Blue
    case "completed":
      return "success"; // Green
    case "upcoming":
      return "warning"; // Orange
    default:
      return "default"; // Gray
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "ongoing":
      return <Autorenew fontSize="small" sx={{ color: "blue" }} />;
    case "upcoming":
      return <Upcoming fontSize="small" sx={{ color: "purple" }} />;
    case "completed":
      return <CheckCircle fontSize="small" sx={{ color: "green" }} />;
    default:
      return <Upcoming fontSize="small" sx={{ color: "gray" }} />;
  }
};


const PlacementRounds = ({ placementId }) => {

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
    if (!editRound.roundName || !editRound.roundDate || !editRound.roundDurationHours) {
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

  return (
    <Box sx={{ width: "100%", p: 2 }}>

      {/* Toast Notification */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Stepper
  activeStep={selectedRound ? rounds.findIndex(r => r._id === selectedRound._id) : 0}
  alternativeLabel
  sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: 2, width: "100%", my: 3 }}
>
  {rounds.map((round, i) => (
    <Step key={i} onClick={() => handleRoundClick(i)} completed={round.roundStatus === "completed"}
      sx={{ cursor: "pointer", flex: "1 1 calc(10% - 10px)", maxWidth: "12%", minWidth: "100px" }}>
      <StepLabel StepIconComponent={() => (
        <Box sx={{
          width: 35, height: 35, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: selectedRound && selectedRound._id === round._id 
          ? "gray" 
          : round.roundStatus === "completed" 
            ? "#4caf50"   // Green (Success)
            : round.roundStatus === "ongoing"
              ? "#1976d2"  // Blue (Primary)
              : round.roundStatus === "upcoming"
                ? "#9c27b0"  // Purple (Secondary)
              : "#fff",
              fontSize: 16,
        }}>
          {i + 1}
        </Box>
      )}>
        <Typography variant="body1">{round.roundName}</Typography>
        <Typography variant="caption" sx={{ fontWeight: "bold" }} color={getStatusColor(round.roundStatus)}>
          {round.roundStatus.toUpperCase()}
        </Typography>
      </StepLabel>
    </Step>
  ))}

  {/* Add New Round Step */}
  <Step sx={{ flex: "1 1 calc(10% - 10px)", maxWidth: "12%", minWidth: "100px" }}>
    <StepLabel StepIconComponent={() => (
      <RoundButton onClick={handleOpenNewRoundDialog} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {hover ? <AddIcon /> : rounds.length + 1}
      </RoundButton>
    )}/>
    <Typography variant="body1">New Round</Typography>
  </Step>
</Stepper>

      {/* Display Selected Round */}
      {selectedRound && (
            <Card sx={{ maxWidth: 500, mx: "auto", p: 2, boxShadow: 3, borderRadius: 2,
              boxShadow: (theme) => `0px 1px 1px ${theme.palette[getStatusColor(selectedRound.roundStatus)].main}`,
              border: (theme) => `2px solid ${theme.palette[getStatusColor(selectedRound.roundStatus)].main}`,
            }} >
            <CardContent>
              <Typography variant="h6" color= {getStatusColor(selectedRound.roundStatus)} sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
                <TrackChanges fontSize="small" color= {getStatusColor(selectedRound.roundStatus)} />
                {selectedRound.roundName}
              </Typography>
              {/* Round Details */}
              <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={0.5}>
              {[["Type","roundType", Assignment], ["Date","roundDate", Event], ["Duration", "roundDuration", AccessTime], ["Venue", "venue", LocationOn]].map(([label,value, Icon]) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Icon fontSize="small" color={getStatusColor(selectedRound.roundStatus)} />
                  <Typography variant="body2">
                    <strong>{label}:</strong> {selectedRound[`${value}`]}
                  </Typography>
                </Box>
              ))}
            </Box>
              {/* Status Chip */}
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", rowGap:2, columnGap: 1 }}>
              {getStatusIcon(selectedRound.roundStatus)}
              <Typography variant="body2">
                  <strong>Status:</strong>
                </Typography>
                <Chip
                  label={selectedRound.roundStatus.charAt(0).toUpperCase() + selectedRound.roundStatus.slice(1)}
                  color={getStatusColor(selectedRound.roundStatus)}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
      
              {/* Action Buttons */}
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedRound.roundStatus === "ongoing" && (
                  <>
                    <Button variant="contained" color= {getStatusColor(selectedRound.roundStatus)} size="small" onClick={handleOpenStudentDialog} startIcon={<List />}>
                      Manage
                    </Button>
                    <Button variant="outlined" color={getStatusColor(selectedRound.roundStatus)} size="small" onClick={() => setOpenDeclareResultDialog(true)} startIcon={<Event />}>
                      Declare Results
                    </Button>
                    <Button variant="outlined" color= {getStatusColor(selectedRound.roundStatus)} size="small" onClick={handleOpenEditDialog} startIcon={<Event />}>
                    Edit Round
                  </Button>
                  </>
                )}
                {selectedRound.roundStatus === "upcoming" && (
                  <Button variant="outlined" color= {getStatusColor(selectedRound.roundStatus)} size="small" onClick={handleOpenEditDialog} startIcon={<Event />}>
                    Edit Round
                  </Button>
                )}
                {selectedRound.roundStatus === "completed" && (
                  <Button 
                    variant="outlined" 
                    color={getStatusColor(selectedRound.roundStatus)} 
                    size="small" 
                    onClick={handleViewResults}
                    startIcon={<AccessTime />}
                  >
                    View Results
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
      )}

      {selectedRound && (
        <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Manage Participants - {selectedRound?.roundName}</DialogTitle>
          <DialogContent>
            <RoundStudents roundId = {selectedRound._id} placementId= {placementId}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStudentDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Round</DialogTitle>
        <DialogContent>
          {[
            { label: "Round Name", name: "roundName", type: "text", value: editRound?.roundName || "" },
            { label: "Round Date", name: "roundDate", type: "date", value: editRound?.roundDate?.split("T")[0] || "" },
            { label: "Venue", name: "venue", type: "text", value: editRound?.venue || "" }
          ].map(({ label, name, type, value }) => (
            <TextField key={name} fullWidth margin="dense" label={label} name={name} type={type} value={value} onChange={handleEditRoundChange} variant="outlined" InputLabelProps={{ shrink: true }} />
          ))}

          <FormControl size="small" fullWidth margin="dense" variant="outlined">
            <InputLabel>Round Type</InputLabel>
            <Select name="roundType" value={editRound?.roundType || ""} onChange={handleEditRoundChange} label="Round Type">
              {["online", "offline"].map(type => (
                <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            {["Hours", "Minutes"].map((unit, i) => (
              <Grid key={unit} item xs={6}>
                <TextField fullWidth margin="dense" type="number" label={`Duration (${unit})`} name={`roundDuration${unit}`} value={editRound?.[`roundDuration${unit}`] || ""} onChange={handleEditRoundChange} variant="outlined" inputProps={{ min: 0, ...(i ? { max: 59 } : {}) }} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateRound} color="primary" variant="contained">Save Changes</Button>
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