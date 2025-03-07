import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Chip,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const AssignedPlacement = ({ assignedPlacement }) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Assigned Placement Drives</Typography>
        <List>
          {assignedPlacement.length > 0 ? (
            assignedPlacement.map((drive, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={drive.title}
                  secondary={`Company: ${drive.companyName} | Role: ${drive.role}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No assigned drives</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

const AssignPlacementDialog = ({ open, handleClose, users }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleConfirmAssign = () => {
  
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Placement Drive</DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => option.name}
          value={selectedUsers}
          onChange={(e, newValue) => setSelectedUsers(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={index} label={option.name} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Select Users" placeholder="Assign to..." />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirmAssign} color="primary" disabled={selectedUsers.length === 0}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { AssignedPlacement, AssignPlacementDialog };
