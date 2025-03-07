import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Button, Typography } from '@mui/material';

const AssignUserDialog = ({ open, onClose, onAssign, users, job }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAssignDialogOpen, setConfirmAssignDialogOpen] = useState(false);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleConfirmAssign = () => {
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
        setConfirmAssignDialogOpen(false);
    };

    const handleAssign = () => {
        setConfirmAssignDialogOpen(true);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Assign Task</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Select a PCC to assign this drive jnf:
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

            <Dialog open={confirmAssignDialogOpen} onClose={() => setConfirmAssignDialogOpen(false)}>
                <DialogTitle>Confirm Assignment</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to assign this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmAssignDialogOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleConfirmAssign} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default AssignUserDialog;
