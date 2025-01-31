import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Button, Typography } from '@mui/material';

const AssignUserDialog = ({ open, onClose, onAssign, users, job }) => {
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleAssign = () => {
        if (selectedUser) {
            const assignedTask = {
                user: selectedUser,
                job,
                date: new Date().toLocaleString(),
            };
            onAssign(assignedTask); 
            console.log('Assigned Task:', assignedTask);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Assign Task</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Select a user to assign the task:
                </Typography>
                <List>
                    {users.map((user) => (
                        <ListItem
                            key={user.id}
                            button
                            onClick={() => handleUserClick(user)}
                            sx={{
                                backgroundColor:
                                    selectedUser?.id === user.id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                                '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.1)' },
                            }}
                        >
                            <ListItemText primary={user.name} secondary={user.email} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleAssign} color="primary" disabled={!selectedUser}>
                    Assign
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignUserDialog;
