import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const DriveDetailDialog = ({ open, drive, onClose, onPublish }) => {
  if (!drive) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Drive Details</DialogTitle>
      <DialogContent>
        Drives
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={onPublish} color="primary">
          Publish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DriveDetailDialog;
