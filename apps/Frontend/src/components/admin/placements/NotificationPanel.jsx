import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  Chip,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  Card,
  CardContent,
  CardActionArea,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Badge
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import placementService from "../../../services/admin/placementService";

const NotificationPanel = ({ placementId, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [notificationType, setNotificationType] = useState("general");
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
        type: notificationType
      };

      await placementService.addNotification(placementId, notificationData);
      
      setSnackbar({
        open: true,
        message: "Notification sent successfully!",
        severity: "success"
      });
      
      await fetchNotifications();
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

  const getNotificationColor = (type) => {
    switch (type) {
      case 'application':
        return 'primary';
      case 'schedule':
        return 'warning';
      case 'result':
        return 'success';
      case 'general':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        right: 0,
        top: 90,
        height: '85vh',
        width: isMinimized ? '50px' : '400px',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {!isMinimized ? (
        <>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6">Notifications</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="New Notification">
                <IconButton onClick={() => setOpenDialog(true)}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={isMinimized ? "Maximize" : "Minimize"}>
                <IconButton onClick={() => setIsMinimized(!isMinimized)}>
                  {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Typography>Loading notifications...</Typography>
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <PersonIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">No notifications available</Typography>
              </Box>
            ) : (
              <List>
                {notifications.map((notification) => (
                  <Card 
                    key={notification._id} 
                    sx={{ 
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => setSelectedNotification(notification)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {notification.subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={notification.type}
                          size="small"
                          color={getNotificationColor(notification.type)}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {notification.content.substring(0, 100)}...
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Tooltip title="Maximize">
            <IconButton onClick={() => setIsMinimized(false)}>
              <MaximizeIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

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
              value={notificationType}
              label="Notification Type"
              onChange={(e) => setNotificationType(e.target.value)}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="application">Application</MenuItem>
              <MenuItem value="schedule">Schedule</MenuItem>
              <MenuItem value="result">Result</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSendNotification} 
            variant="contained" 
            color="primary"
            startIcon={<SendIcon />}
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
                <DeleteIcon />
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
    </Paper>
  );
};

export default NotificationPanel; 