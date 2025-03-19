import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Stepper, Step, StepLabel, FormControl, InputLabel, Select, MenuItem 
} from "@mui/material";
import { AddCardRounded } from "@mui/icons-material";
import PlacementStudents from "./PlacementStudents";
import placementService from "../../../services/admin/placementService";

const PlacementRounds = ({ placementId }) => {

  const [roundDetails, setRoundDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openNewRoundDialog, setOpenNewRoundDialog] = useState(false);
  const [editRound, setEditRound] = useState( null );
  const [openResultDialog, setOpenResultDialog] = useState(false);

  const [newRound, setNewRound] = useState({
    roundNumber: "",
    roundName: "",
    details: "",
    roundType: "online",
    roundDate: Date.now(),
    roundDuration: "",
    roundStatus: "upcoming",
    venue: ""
  });

  const [roundResult, setRoundResult] = useState({
    resultTitle: "",
    resultDescription: "",
    roundStatus: "completed"
  });

  useEffect(() => {
    const fetchRoundDetails = async () => {
      try {
        setLoading(true);
        const response = await placementService.getRoundDetails(placementId);
        console.log("Rounds",response.rounds);
        console.log("Round Details",response);
        setRoundDetails(response);
        setRounds(response.rounds);
        if (response.rounds.length > 0) {
          setSelectedRound(response.rounds[0]);
        }
      } catch (err) {
        console.log("Error",err);
        setError("Failed to load placement rounds.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoundDetails();
  }, [placementId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!roundDetails) return <Typography>No Round Details available.</Typography>;

  const handleRoundClick = (index) => {
    setSelectedRound(rounds[index]);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenNewRoundDialog = () => {
    setNewRound({
      roundNumber: rounds.length + 1,
      roundName: "",
      roundType: "online",
      roundDate: Date.now(),
      roundDuration: "",
      venue: "",
      roundStatus: "upcoming",
      details: "",
    });
    setOpenNewRoundDialog(true);
  };

  const handleAddNewRound = async () => {
    if (!newRound.roundName || !newRound.roundType || !newRound.roundDate || !newRound.roundDuration) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const roundData = {
        user_id: userId,
        placementDrive_id: placementId,
        round: {
          roundNumber: rounds.length + 1,
          roundName: newRound.roundName,
          details: newRound.details || "",
          roundType: newRound.roundType.toLowerCase(), // ensure 'online' or 'offline'
          roundDate: new Date(newRound.roundDate).toISOString(), // Convert to ISO timestamp
          roundDuration: newRound.roundDuration,
          roundStatus: "upcoming",
          venue: newRound.venue || "" // Optional field
        }
      };

      const response = await placementService.addRound(placementId, roundData);
      if (response.success) {
        await fetchRounds(); // Refresh the rounds list
        setOpenNewRoundDialog(false);
        // Reset new round form
        setNewRound({
          roundNumber: "",
          roundName: "",
          details: "",
          roundType: "online",
          roundDate: "",
          roundDuration: "",
          roundStatus: "upcoming",
          venue: ""
        });
      }
    } catch (error) {
      console.error("Add round error:", error);
      alert(error.response?.data?.message || "Failed to add new round");
    }
  };

  const handleUpdateRound = async () => {
    try {
      const roundData = {
        round: {
          round_id: selectedRound._id,
          roundNumber: selectedRound.roundNumber,
          roundName: selectedRound.roundName,
          roundType: selectedRound.roundType.toLowerCase(),
          roundDate: selectedRound.roundDate 
          ? new Date(selectedRound.roundDate).toISOString().split("T")[0] 
          : "",
          venue: selectedRound.venue || ""
        }
      };

      const response = await placementService.updateRound(placementId, selectedRound._id, roundData);
      if (response.status === 200) {
        // await fetchRounds();
        setOpenEditDialog(false);
      }
    } catch (error) {
      console.error("Update round error:", error);
      alert(error.response?.data?.message || "Failed to update round");
    }
  };

  const handleDeclareResults = async () => {
    if (!roundResult.resultTitle || !roundResult.resultDescription) {
      alert("Please fill in both result title and description");
      return;
    }

    try {
      const resultData = {
        placementDrive_id: placementId,
        round_id: selectedRound._id,
        user_id: userId,
        roundStatus: "completed", // Update status to completed
        resultTitle: roundResult.resultTitle,
        resultDescription: roundResult.resultDescription
      };

      const response = await placementService.declareResults(placementId, selectedRound._id, resultData);
      if (response.success) {
        await fetchRounds();
        setOpenResultDialog(false);
        // Reset result form
        setRoundResult({
          resultTitle: "",
          resultDescription: "",
          roundStatus: "completed"
        });
      }
    } catch (error) {
      console.error("Declare results error:", error);
      alert(error.response?.data?.message || "Failed to declare results");
    }
  };

  const handleUpdateSelectedStudents = async (selectedStudents) => {
    try {
      const data = {
        user_id: userId,
        placementDrive_id: placementId,
        round_id: selectedRound._id,
        selectedStudents
      };

      await placementService.updateSelectedStudents(placementId, selectedRound._id, data);
      await fetchRounds();
    } catch (error) {
      alert("Failed to update selected students");
    }
  };

  const handleCloseNewRoundDialog = () => {
    setOpenNewRoundDialog(false);
  };

  const handleOpenEditDialog = () => {
    setEditRound({ ...selectedRound });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleNewRoundChange = (event) => {
    setNewRound({ ...newRound, [event.target.name]: event.target.value });
  };

  const handleEditRoundChange = (event) => {
    setEditRound({ ...editRound, [event.target.name]: event.target.value });
  };

  const handleOpenResultDialog = () => {
    setRoundResult({
      resultTitle: "",
      resultDescription: "",
      roundStatus: "completed"
    });
    setOpenResultDialog(true);
  };

  const handleCloseResultDialog = () => {
    setOpenResultDialog(false);
  };

  const fetchRounds = async () => {
    try {
      setLoading(true);
      const response = await placementService.getRounds(placementId);
      setRounds(response.data.rounds);
      if (response.data.rounds.length > 0) {
        setSelectedRound(response.data.rounds[0]);
      }
    } catch (err) {
      setError("Failed to load rounds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>

      {/* Timeline Progress */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Stepper activeStep={rounds.findIndex(round => round._id === selectedRound._id)} alternativeLabel>
          {rounds.map((round, index) => (
            <Step 
              key={index} 
              onClick={() => handleRoundClick(index)}
              completed={round.roundStatus === "completed"}
            >
              <StepLabel 
                StepIconProps={{
                  sx: {
                    color: round.roundStatus === "completed" 
                      ? "green" 
                      : round.roundStatus === "ongoing" 
                      ? "blue" 
                      : "gray"
                  }
                }}
              >
                <Typography variant="body1" sx={{ cursor: "pointer" }}>
                  Round {round.roundNumber}: {round.roundName}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={
                    round.roundStatus === "completed" ? "green" : 
                    round.roundStatus === "ongoing" ? "blue" : "gray"
                  }
                >
                  {round.roundStatus.toUpperCase()}
                </Typography>
              </StepLabel>
            </Step>
          ))}
          
          <Step>
            <StepLabel>
              <Typography 
                variant="body1" 
                sx={{ cursor: "pointer" }} 
                onClick={handleOpenNewRoundDialog}
              >
                Add New Round
              </Typography>
              <AddCardRounded onClick={handleOpenNewRoundDialog} />
            </StepLabel>
          </Step>
        </Stepper>
      </Box>

      {/* Display Selected Round */}
      {selectedRound && (
        <Card sx={{ maxWidth: 500, mx: "auto", p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">Round {selectedRound.roundNumber}: {selectedRound.roundName}</Typography>
            <Typography variant="body2">Type: {selectedRound.roundType}</Typography>
            <Typography variant="body2">Date: {selectedRound.roundDate}</Typography>
            <Typography variant="body2">Duration: {selectedRound.roundDuration}</Typography>
            <Typography variant="body2">Venue: {selectedRound.venue || 'Not specified'}</Typography>
            <Typography variant="body2">Status: {selectedRound.roundStatus.toUpperCase()}</Typography>
            
            {selectedRound.roundStatus === "ongoing" && (
              <>
                <Button variant="contained" sx={{ mt: 2, mr: 1 }} onClick={handleOpenDialog}>
                  Manage Participants
                </Button>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpenResultDialog}>
                  Declare Results
                </Button>
              </>
            )}

            {selectedRound.roundStatus === "upcoming" && (
              <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleOpenEditDialog}>
                Edit Round
              </Button>
            )}

            {selectedRound.roundStatus === "completed" && (
              <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleOpenResultDialog}>
                View Results
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog for Managing Participants */}
      {selectedRound && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>Manage Participants - {selectedRound.roundName}</DialogTitle>
          <DialogContent>
            <PlacementStudents
              appliedStudents={selectedRound.applicantStudents || []}
              appearedStudents={selectedRound.appearedStudents || []}
              selectedStudents={selectedRound.selectedStudents || []}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog for Editing a Round */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Round</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Round Name" name="roundName" value={editRound?.roundName} onChange={handleEditRoundChange} />
          <TextField fullWidth margin="dense" label="Round Type" name="roundType" value={editRound?.roundType} onChange={handleEditRoundChange} />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            label="Round Date"
            name="roundDate"
            InputLabelProps={{ shrink: true }}
            value={editRound?.roundDate ? editRound.roundDate.split("T")[0] : ""}
            onChange={handleEditRoundChange}
          />
          <TextField fullWidth margin="dense" label="Duration" name="roundDuration" value={editRound?.roundDuration} onChange={handleEditRoundChange} />
          <TextField fullWidth margin="dense" label="Venue" name="venue" value={editRound?.venue} onChange={handleEditRoundChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateRound} color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Adding a New Round */}
      <Dialog open={openNewRoundDialog} onClose={handleCloseNewRoundDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Round</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Round Name" name="roundName" value={newRound.roundName} onChange={handleNewRoundChange} />
          <TextField fullWidth margin="dense" label="Round Type" name="roundType" value={newRound.roundType} onChange={handleNewRoundChange} />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            label="Round Date"
            name="roundDate"
            InputLabelProps={{ shrink: true }}
            value={newRound.roundDate}
            onChange={handleNewRoundChange}
          />

          <TextField fullWidth margin="dense" label="Duration" name="roundDuration" value={newRound.roundDuration} onChange={handleNewRoundChange} />
          <TextField fullWidth margin="dense" label="Venue" name="venue" value={newRound.venue} onChange={handleNewRoundChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewRoundDialog} color="secondary">Cancel</Button>
          <Button onClick={handleAddNewRound} color="primary" variant="contained">Add Round</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openResultDialog} onClose={handleCloseResultDialog} fullWidth maxWidth="sm">
        <DialogTitle>Declare Round Results</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            margin="dense" 
            label="Result Title" 
            name="resultTitle" 
            value={roundResult.resultTitle}
            onChange={(e) => setRoundResult({ ...roundResult, resultTitle: e.target.value })}
            required
          />
          <TextField 
            fullWidth 
            margin="dense" 
            label="Result Description" 
            name="resultDescription" 
            multiline
            rows={4}
            value={roundResult.resultDescription}
            onChange={(e) => setRoundResult({ ...roundResult, resultDescription: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultDialog} color="secondary">Cancel</Button>
          <Button onClick={handleDeclareResults} color="primary" variant="contained">
            Declare Results
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PlacementRounds;