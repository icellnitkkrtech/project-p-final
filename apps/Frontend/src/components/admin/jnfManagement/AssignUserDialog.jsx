import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    List, 
    ListItem, 
    ListItemText, 
    Button, 
    Typography, 
    Alert,
    Box,
    Divider,
    CircularProgress 
} from '@mui/material';
import jnfService from '../../../services/admin/jnfService';

const AssignUserDialog = ({ open, onClose, onAssign, users, job }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAssignDialogOpen, setConfirmAssignDialogOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCurrentAssignment = async () => {
            if (!job?._id || !open) return;

            try {
                setLoading(true);
                setError(null);
                const response = await jnfService.getJNFAssignment(job._id);
                
                if (!isMounted) return;

                // Handle nested response structure
                const assignedUser = response?.data?.data?.user;
                if (assignedUser?._id) {
                    // Find the full user details from the users prop
                    const fullUserDetails = users.find(user => user._id === assignedUser._id);
                    
                    if (fullUserDetails) {
                        setCurrentAssignment({
                            user: {
                                _id: fullUserDetails._id,
                                name: fullUserDetails.name,
                                email: fullUserDetails.email
                            },
                            assignedDate: new Date().toISOString() // Use current date if not provided
                        });
                    } else {
                        // If user not found in users list, use available data
                        setCurrentAssignment({
                            user: {
                                _id: assignedUser._id,
                                name: 'Unknown User',
                                email: assignedUser.email
                            },
                            assignedDate: new Date().toISOString()
                        });
                    }
                } else {
                    setCurrentAssignment(null);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error('Error fetching assignment:', err);
                setError(err.message || 'Failed to fetch current assignment');
                setCurrentAssignment(null);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCurrentAssignment();

        return () => {
            isMounted = false;
        };
    }, [job?._id, open, users]); // Added users to dependencies

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setError(null); // Clear any previous errors
    };

    const handleConfirmAssign = async () => {
        if (selectedUser && job?._id) {
            try {
                setLoading(true);
                setError(null);
                
                const response = await jnfService.assignJNF(job._id, selectedUser._id);
                
                if (response?.data?.success) {
                    // Update current assignment after successful assignment
                    setCurrentAssignment({
                        user: {
                            _id: selectedUser._id,
                            name: selectedUser.name,
                            email: selectedUser.email
                        },
                        assignedDate: new Date().toISOString()
                    });

                    onAssign({
                        user: selectedUser,
                        job,
                        date: new Date().toLocaleString(),
                    });
                    
                    setConfirmAssignDialogOpen(false);
                    onClose();
                }
            } catch (error) {
                setError(error.message || 'Failed to assign JNF');
                console.error('Error assigning JNF:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAssign = () => {
        setConfirmAssignDialogOpen(true);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Assign Task</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 2 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                {/* Show current assignment only if it exists and has all required fields */}
                {currentAssignment?.user?.email && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                            Current Assignment
                        </Typography>
                        <Typography variant="body2">
                            Assigned to:  ({currentAssignment.user.email})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Assigned on: {new Date(currentAssignment.assignedDate).toLocaleString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                    </Box>
                )}

                <Typography variant="body1" gutterBottom>
                    {currentAssignment ? 'Reassign this JNF to:' : 'Select a PCC to assign this JNF:'}
                </Typography>
                <List>
                    {users.map((user) => (
                        <ListItem
                            key={user._id}
                            button
                            onClick={() => handleUserClick(user)}
                            sx={{
                                backgroundColor:
                                    selectedUser?._id === user._id ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                                '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.1)' },
                            }}
                        >
                            <ListItemText 
                                primary={user.name} 
                                secondary={user.email}
                                // Highlight if this is the current assignee
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontWeight: currentAssignment?.user._id === user._id ? 'bold' : 'normal',
                                    }
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button 
                    onClick={handleAssign} 
                    color="primary" 
                    disabled={!selectedUser || loading}
                >
                    Assign
                </Button>
            </DialogActions>

            <Dialog open={confirmAssignDialogOpen} onClose={() => setConfirmAssignDialogOpen(false)}>
                <DialogTitle>Confirm Assignment</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to assign this JNF to {selectedUser?.name}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setConfirmAssignDialogOpen(false)} 
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmAssign} 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Assigning...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
        </Dialog>
    );
};

export default AssignUserDialog;
