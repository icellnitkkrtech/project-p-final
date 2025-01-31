import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const SurveyDialog = ({
  open,
  newForm,
  setNewForm,
  isFormValid,
  isEditMode,
  isCloneMode,
  handleSaveAsDraft,
  handlePublish,
  handleClose,
}) => {
  const dialogTitle = isEditMode
    ? "Edit Survey"
    : isCloneMode
    ? "Clone Survey"
    : "Create New Survey";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Survey Title"
          value={newForm.title}
          onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
          placeholder="Enter the title of the survey"
        />
        <FormControl fullWidth margin="normal" color="primary">
          <Select
            value={newForm.type}
            onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
          >
            <MenuItem value="" disabled>
              Select the type of survey
            </MenuItem>
            <MenuItem value="Feedback">Feedback</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Career">Career</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Description / Objective"
          multiline
          rows={3}
          value={newForm.description}
          onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
          placeholder="Provide a description or objective for the survey"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSaveAsDraft}
          color="secondary"
          variant="outlined"
        >
          Save as Draft
        </Button>
        <Button
          onClick={handlePublish}
          color="primary"
          variant="contained"
          disabled={!isFormValid()}
        >
          Publish
        </Button>
        <Button onClick={handleClose} color="error" variant="text">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SurveyDialog;
