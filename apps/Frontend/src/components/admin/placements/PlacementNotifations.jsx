import React, { useState, useEffect, useRef } from "react";
import {
  TextField, Button, Typography, Card, CardContent, MenuItem, Select,
  FormControl, InputLabel, List, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Divider, CardActionArea, Collapse
} from "@mui/material";
import { Send, Add, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import { Editor } from '@tinymce/tinymce-react';

const mockStudents = [
  { student: "student1@example.com", studentName: "Alice" },
  { student: "student2@example.com", studentName: "Bob" },
  { student: "student3@example.com", studentName: "Charlie" },
  { student: "student4@example.com", studentName: "Gaurav" },
  { student: "student5@example.com", studentName: "Amit" },
  { student: "student6@example.com", studentName: "Dev" },
  { student: "student7@example.com", studentName: "Shreya" },
  { student: "student8@example.com", studentName: "Shivam" },
  { student: "student9@example.com", studentName: "Akarshit" },
];

const PlacementNotifications = () => {
  const [message, setMessage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [threads, setThreads] = useState(() => {
    return JSON.parse(localStorage.getItem("notificationThreads")) || [];
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("notificationThreads", JSON.stringify(threads));
  }, [threads]);

  const handleSendNotification = () => {
    if (!message || selectedStudents.length === 0 || !editorRef.current) return;
  
    const notification = {
      message,
      description: editorRef.current.getContent(),
      students: selectedStudents,
      timestamp: new Date().toLocaleString(),
    };
  
    setThreads((prevThreads) => {
      // Ensure prevThreads is an object
      if (typeof prevThreads !== "object" || prevThreads === null) {
        prevThreads = {}; // Reset to an empty object if it's invalid
      }
  
      const updatedThreads = {
        [message]: prevThreads[message] ? [notification, ...prevThreads[message]] : [notification], // Add new on top
        ...prevThreads, // Keep previous notifications
      };
  
      localStorage.setItem("notificationThreads", JSON.stringify(updatedThreads));
      return updatedThreads;
    });
  
    setOpenDialog(false);
    setMessage("");
    setSelectedStudents([]);
  };
  

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <CardContent>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          fullWidth
        >
          New Notification
        </Button>
      </CardContent>

      <CardContent>
        <Typography variant="h6">Notification Log</Typography>
        <List>
          {Object.entries(threads).map(([threadId, notifications]) => (
            <Card key={threadId} sx={{ marginBottom: 2, boxShadow: 2 }}>
              <CardActionArea onClick={() => setSelectedThread(notifications[0])}>
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {threadId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {notifications[0].timestamp}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </List>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Students (BCC)</InputLabel>
            <Select
              multiple
              value={selectedStudents}
              onChange={(e) => setSelectedStudents(e.target.value)}
              renderValue={(selected) => `${selected.length} recipients`}
            >
              {mockStudents.map((student) => (
                <MenuItem key={student.student} value={student.student}>
                  {student.studentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Notification Subject"
            variant="outlined"
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Editor
            apiKey='aplsj1wh83umufb21rl4ufh8o0t03y4cqikkzmfps382mupk'
            onInit={(_evt, editor) => (editorRef.current = editor)}
            initialValue=""
            init={{
              height: 250,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | bold italic forecolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | removeformat | help',
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Send />}
            onClick={handleSendNotification}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to view full notification details */}
      {selectedThread && (
        <Dialog open={Boolean(selectedThread)} onClose={() => setSelectedThread(null)} fullWidth>
          <DialogTitle>Notification Details</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1"><strong>Subject:</strong> {selectedThread.message}</Typography>
            <Divider sx={{ my: 1 }} />

            {/* Recipients with Gmail-like Show More button */}
            <Typography variant="subtitle1"><strong>Recipients:</strong></Typography>
            <Collapse in={showAllRecipients} collapsedSize={20}>
              <Typography variant="body2">
                {selectedThread.students.join(", ")}
              </Typography>
            </Collapse>
            {selectedThread.students.length > 3 && (
              <Button size="small" onClick={() => setShowAllRecipients(!showAllRecipients)}>
                {showAllRecipients ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </Button>
            )}
            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle1"><strong>Date:</strong> {selectedThread.timestamp}</Typography>
            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle1"><strong>Description:</strong></Typography>
            <div dangerouslySetInnerHTML={{ __html: selectedThread.description }} />
          </DialogContent>
          <DialogActions>
            <IconButton onClick={() => handleDeleteNotification(selectedThread.index)} color="error">
              <Delete />
            </IconButton>
            <Button onClick={() => setSelectedThread(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default PlacementNotifications;
