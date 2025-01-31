import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

const QueryDialog = ({ 
  open, 
  query, 
  replyText, 
  setReplyText, 
  onClose, 
  onSendReply, 
  activeTab 
}) => {
  if (!query) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Header with user info */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid #ddd",
          pb: 2,
        }}
      >
        <PersonIcon color="primary" />
        <Box>
          <Typography variant="h6">
            {activeTab === "student" ? query.name : query.company}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {query.email || "N/A"}
          </Typography>
        </Box>
      </DialogTitle>

      {/* Query details */}
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          backgroundColor: "#f9f9f9",
          p: 3,
        }}
      >
        {/* Subject */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Subject:</strong>
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {query.subject}
          </Typography>
        </Box>

        {/* Description */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Description:</strong>
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {query.description}
          </Typography>
        </Box>

        {/* Reply Field */}
        <TextField
          placeholder="Type your reply..."
          fullWidth
          multiline
          rows={3}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          sx={{ backgroundColor: "#ffffff", borderRadius: 2 }}
        />
      </DialogContent>

      {/* Footer with buttons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          borderTop: "1px solid #ddd",
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSendReply}
          disabled={!replyText.trim()}
        >
          Send
          <SendIcon sx={{ ml: 1 }} />
        </Button>
      </Box>
    </Dialog>
  );
};

export default QueryDialog;
