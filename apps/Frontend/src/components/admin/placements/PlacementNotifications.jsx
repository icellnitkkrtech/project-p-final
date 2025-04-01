import React, { useState, useEffect, useRef } from "react";
import {
  TextField, Button, Typography, Card, CardContent, MenuItem, Select,
  FormControl, InputLabel, List, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Divider, CardActionArea, Collapse, Box,
  Snackbar, Alert, Grid, Paper
} from "@mui/material";
import { Send, Add, Delete, ExpandMore, ExpandLess, Notifications } from "@mui/icons-material";
import { Editor } from '@tinymce/tinymce-react';
import placementService from "../../../services/admin/placementService";

const PlacementNotifications = ({ placementId }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (placementId) {
      fetchNotifications();
    }
  }, [placementId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await placementService.getAllNotifications(placementId);
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setSnackbar({
        open: true,
        message: "Error fetching notifications",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!subject || !editorRef.current) {
      setSnackbar({
        open: true,
        message: "Subject and content are required",
        severity: "warning"
      });
      return;
    }

    try {
      const notificationData = {
        subject: subject,
        content: editorRef.current.getContent(),
        type: "general" // You can add more types as needed
      };

      await placementService.addNotification(placementId, notificationData);
      
      setSnackbar({
        open: true,
        message: "Notification sent successfully!",
        severity: "success"
      });
      
      // Refresh notifications list
      await fetchNotifications();
      
      // Reset form
      setOpenDialog(false);
      setSubject("");
      setContent("");
      
    } catch (error) {
      console.error("Error sending notification:", error);
      setSnackbar({
        open: true,
        message: "Error sending notification",
        severity: "error"
      });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await placementService.deleteNotification(placementId, notificationId);
      await fetchNotifications();
      setSelectedNotification(null);
      setSnackbar({
        open: true,
        message: "Notification deleted successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      setSnackbar({
        open: true,
        message: "Error deleting notification",
        severity: "error"
      });
    }
  };

  const handleViewNotification = async (notificationId) => {
    try {
      const response = await placementService.getNotification(placementId, notificationId);
      setSelectedNotification(response.data);
    } catch (error) {
      console.error("Error fetching notification details:", error);
      setSnackbar({
        open: true,
        message: "Error fetching notification details",
        severity: "error"
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
              Placement Notifications
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              New Notification
            </Button>
          </Box>

          {loading ? (
            <Typography>Loading notifications...</Typography>
          ) : notifications.length === 0 ? (
            <Typography>No notifications found</Typography>
          ) : (
            <List>
              {notifications.map((notification) => (
                <Paper key={notification._id} elevation={2} sx={{ mb: 2, overflow: 'hidden' }}>
                  <CardActionArea onClick={() => handleViewNotification(notification._id)}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {notification.subject}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Sent: {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Type: {notification.type || "General"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Paper>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* New Notification Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Notification</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            margin="normal"
            required
          />
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Content
            </Typography>
            <Editor
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue=""
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </Box>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Notification Type</InputLabel>
            <Select
              value="general"
              label="Notification Type"
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="round_update">Round Update</MenuItem>
              <MenuItem value="result">Result</MenuItem>
              <MenuItem value="offer_letter">Offer Letter</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSendNotification} 
            variant="contained" 
            color="primary"
            startIcon={<Send />}
          >
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Notification Dialog */}
      {selectedNotification && (
        <Dialog 
          open={Boolean(selectedNotification)} 
          onClose={() => setSelectedNotification(null)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {selectedNotification.subject}
              <IconButton 
                color="error" 
                onClick={() => handleDeleteNotification(selectedNotification._id)}
              >
                <Delete />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Sent: {new Date(selectedNotification.createdAt).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <div dangerouslySetInnerHTML={{ __html: selectedNotification.content }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedNotification(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlacementNotifications;
