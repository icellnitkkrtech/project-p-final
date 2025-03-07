import React, { useState } from "react";
import { 
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Stepper, Step, StepLabel 
} from "@mui/material";
import PlacementData from "./PlacementData";
import { AddCardRounded } from "@mui/icons-material";
import PlacementStudents from "./PlacementStudents";

const PlacementRounds = () => {
  const drive = PlacementData[0]; // Fetching data from DriveData
  const [rounds, setRounds] = useState(drive.roundDetails.rounds);

  // Default to ongoing round, or last round if none are ongoing
  const defaultRoundIndex = rounds.findIndex(round => round.roundStatus === "ONGOING");
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(defaultRoundIndex !== -1 ? defaultRoundIndex : rounds.length - 1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openNewRoundDialog, setOpenNewRoundDialog] = useState(false);
  const [editRound, setEditRound] = useState(null);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [newRound, setNewRound] = useState({
    roundName: "",
    roundType: "",
    roundDate: "",
    roundDuration: "",
    venue: "",
    roundStatus: "UPCOMING"
  });

  const [roundResult, setRoundResult] = useState({ message: "", selectedStudents: rounds[selectedRoundIndex]?.selectedStudents || [] });


  const handleRoundClick = (index) => {
    setSelectedRoundIndex(index);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenNewRoundDialog = () => {
    setNewRound({
      roundName: "",
      roundType: "",
      roundDate: "",
      roundDuration: "",
      venue: "",
      roundStatus: "UPCOMING"
    });
    setOpenNewRoundDialog(true);
  };

  const handleDeclareResults = (selectedRoundIndex) => {
    const updatedRounds = rounds.map((round, index) => {
      if (index === selectedRoundIndex) {
        return { ...round, roundStatus: "COMPLETED" };
      } 
      if (index === selectedRoundIndex + 1) {
        // setSelectedRoundIndex(selectedRoundIndex + 1);
        return { ...round, roundStatus: "ONGOING" };
      }
      return round;
    });
    setRounds(updatedRounds);
    setOpenResultDialog(false);
  };
  
  
  const handleCloseNewRoundDialog = () => {
    setOpenNewRoundDialog(false);
  };

  const handleOpenEditDialog = () => {
    setEditRound({ ...rounds[selectedRoundIndex] });
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

  const handleAddNewRound = () => {
    if (!newRound.roundName || !newRound.roundType || !newRound.roundDate || !newRound.roundDuration || !newRound.venue) {
      alert("Please fill all fields before adding a round.");
      return;
    }
  
    const updatedRounds = [...rounds, { ...newRound, appliedStudents: [], appearedStudents: [], selectedStudents: [] }];
    
    setRounds(updatedRounds);  // Ensure rounds state updates
    setSelectedRoundIndex(updatedRounds.length - 1); // Select newly added round
    setOpenNewRoundDialog(false); // Close the dialog
  };

  const handleSaveEditRound = () => {
    const updatedRounds = rounds.map((round, index) =>
      index === selectedRoundIndex ? editRound : round
    );

    setRounds(updatedRounds);
    setOpenEditDialog(false);
  };

  const handleOpenResultDialog = () => {
    setRoundResult({
      message: "",
      selectedStudents: rounds[selectedRoundIndex]?.selectedStudents || []
    });
    setOpenResultDialog(true);
  };

  const handleCloseResultDialog = () => {
    setOpenResultDialog(false);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>

      {/* Timeline Progress */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Stepper activeStep={selectedRoundIndex} alternativeLabel>
          {rounds.map((round, index) => (
            <Step 
              key={index} 
              onClick={() => handleRoundClick(index)}
              completed={round.roundStatus === "COMPLETED"} // Mark step as completed
              color={round.roundStatus === "COMPLETED" ? "green" : "primary"} // Change color based on status
            >
              <StepLabel 
                StepIconProps={{
                  sx: {
                    color: round.roundStatus === "COMPLETED" 
                      ? "green" 
                      : round.roundStatus === "ONGOING" 
                      ? "blue" 
                      : "gray"
                  }
                }}
              >
                <Typography variant="body1" sx={{ cursor: "pointer" }}>
                  {round.roundName}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={
                    round.roundStatus === "COMPLETED" ? "green" : 
                    round.roundStatus === "ONGOING" ? "blue" : "gray"
                  }
                >
                  {round.roundStatus}
                </Typography>
              </StepLabel>
            </Step>
          ))}
          
          {/* Step for Adding a New Round */}
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
      {selectedRoundIndex !== null && (
        <Card sx={{ maxWidth: 500, mx: "auto", p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">{rounds[selectedRoundIndex].roundName}</Typography>
            <Typography variant="body2">Type: {rounds[selectedRoundIndex].roundType}</Typography>
            <Typography variant="body2">Date: {rounds[selectedRoundIndex].roundDate}</Typography>
            <Typography variant="body2">Duration: {rounds[selectedRoundIndex].roundDuration}</Typography>
            <Typography variant="body2">Venue: {rounds[selectedRoundIndex].venue}</Typography>
            <Typography variant="body2">Status: {rounds[selectedRoundIndex].roundStatus}</Typography>
            
            {rounds[selectedRoundIndex].roundStatus === "ONGOING" && (
            <Button variant="contained" sx={{ mt: 2, mr: 1 }} onClick={handleOpenDialog}>
              Manage Participants
            </Button>
            )}

            {/* Edit Button (Only for Upcoming and Ongoing rounds) */}
            {rounds[selectedRoundIndex].roundStatus !== "COMPLETED" && (
              <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleOpenEditDialog}>
                Edit Round
              </Button>
            )}


            {rounds[selectedRoundIndex].roundStatus === "ONGOING" && (
              <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleOpenResultDialog}>
                Declare Results
              </Button>
            )}

            {rounds[selectedRoundIndex].roundStatus == "COMPLETED" && (
              <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleOpenResultDialog}>
                See Results
              </Button>
            )}

          </CardContent>
        </Card>
      )}

      {/* Dialog for Managing Participants */}
      {selectedRoundIndex !== null && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>Manage Participants - {rounds[selectedRoundIndex].roundName}</DialogTitle>
          <DialogContent>
            <PlacementStudents
              appliedStudents={rounds[selectedRoundIndex].appliedStudents || []}
              appearedStudents={rounds[selectedRoundIndex].appearedStudents || []}
              selectedStudents={rounds[selectedRoundIndex].selectedStudents || []}
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
          <TextField fullWidth margin="dense" type="date" label="Round Date" name="roundDate" InputLabelProps={{ shrink: true }} value={editRound?.roundDate} onChange={handleEditRoundChange} />
          <TextField fullWidth margin="dense" label="Duration" name="roundDuration" value={editRound?.roundDuration} onChange={handleEditRoundChange} />
          <TextField fullWidth margin="dense" label="Venue" name="venue" value={editRound?.venue} onChange={handleEditRoundChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSaveEditRound} color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

        {/* Dialog for Adding a New Round */}
      <Dialog open={openNewRoundDialog} onClose={handleCloseNewRoundDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Round</DialogTitle>
        <DialogContent>
            <TextField fullWidth margin="dense" label="Round Name" name="roundName" value={newRound.roundName} onChange={handleNewRoundChange} />
            <TextField fullWidth margin="dense" label="Round Type" name="roundType" value={newRound.roundType} onChange={handleNewRoundChange} />
            <TextField fullWidth margin="dense" type="date" label="Round Date" name="roundDate" InputLabelProps={{ shrink: true }} value={newRound.roundDate} onChange={handleNewRoundChange} />
            <TextField fullWidth margin="dense" label="Duration" name="roundDuration" value={newRound.roundDuration} onChange={handleNewRoundChange} />
            <TextField fullWidth margin="dense" label="Venue" name="venue" value={newRound.venue} onChange={handleNewRoundChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseNewRoundDialog} color="secondary">Cancel</Button>
            <Button onClick={handleAddNewRound} color="primary" variant="contained">Add Round</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openResultDialog} onClose={handleCloseResultDialog} fullWidth maxWidth="sm">
        <DialogTitle>Declare Results</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Result Message" name="message" value={roundResult.message} onChange={(e) => setRoundResult({ ...roundResult, message: e.target.value })} />
          <Typography variant="body1" sx={{ mt: 2 }}>Selected Students:</Typography>
          {rounds[selectedRoundIndex].appearedStudents.length > 0 ? (
            rounds[selectedRoundIndex].appearedStudents.map((student, index) => (
              <Typography key={index} variant="body2">{student.studentName} (Roll No: {student.studentId})</Typography>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">No students selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultDialog} color="secondary">Close</Button>
          {rounds[selectedRoundIndex].roundStatus === "ONGOING" && (
            <Button onClick={() => handleDeclareResults(selectedRoundIndex)} color="primary" variant="contained">Declare</Button>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PlacementRounds;
