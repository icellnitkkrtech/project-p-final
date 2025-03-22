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
    CircularProgress,
    Avatar,
    ListItemAvatar,
    TextField,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Search, Person, Close } from '@mui/icons-material';
import jnfService from '../../../services/admin/jnfService';

const AssignUserDialog = ({ open, onClose, onAssign, users, job }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchCurrentAssignment = async () => {
            if (!job?._id || !open) return;

            try {
                setLoading(true);
                const response = await jnfService.getJNFAssignment(job._id);
                
                if (isMounted) {
                    if (response.success) {
                        setCurrentAssignment(response.data);
                        
                        // If there's a current assignment, pre-select that user
                        if (response.data?.user?.id) {
                            const matchingUser = users.find(u => u.id === response.data.user.id);
                            if (matchingUser) {
                                setSelectedUser(matchingUser);
                            }
                        }
                    } else {
                        // No assignment or error fetching
                        setCurrentAssignment(null);
                        setSelectedUser(null);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching assignment:", error);
                if (isMounted) {
                    setError("Failed to fetch current assignment");
                    setLoading(false);
                }
            }
        };

        fetchCurrentAssignment();

        return () => {
            isMounted = false;
        };
    }, [job?._id, open, users]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setError(null); // Clear any previous errors
    };

    const handleAssign = async () => {
        if (!selectedUser || !job) {
            setError("Please select a user to assign");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await onAssign(job._id, selectedUser.id);
            
            if (result) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 1500); // Close after 1.5 seconds to show success message
            } else {
                setError("Failed to assign user. Please try again.");
            }
        } catch (error) {
            console.error("Error in assignment:", error);
            setError("An error occurred during assignment");
        } finally {
            setLoading(false);
        }
    };

    const getFilteredUsers = () => {
        if (!users) return [];
        
        if (!searchQuery || searchQuery.trim() === '') return users;
        
        const query = searchQuery.toLowerCase();
        
        return users.filter(user => {
            if (!user) return false;
            
            const nameMatch = user.name && typeof user.name === 'string' 
                ? user.name.toLowerCase().includes(query) 
                : false;
            
            const emailMatch = user.email && typeof user.email === 'string'
                ? user.email.toLowerCase().includes(query)
                : false;
            
            const deptMatch = user.department && typeof user.department === 'string'
                ? user.department.toLowerCase().includes(query)
                : false;
            
            return nameMatch || emailMatch || deptMatch;
        });
    };
    
    const filteredUsers = getFilteredUsers();

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 3
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1
            }}>
                <Typography variant="h6" component="div" fontWeight={600}>
                    Assign JNF to PCC Member
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 1 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        JNF successfully assigned!
                    </Alert>
                )}
                
                {/* Show current assignment only if it exists and has all required fields */}
                {currentAssignment?.user?.email && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom fontWeight={600}>
                            Current Assignment
                        </Typography>
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: (theme) => theme.palette.mode === 'dark' 
                                ? 'rgba(255,255,255,0.05)' 
                                : 'rgba(0,0,0,0.02)',
                            borderRadius: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                    <Person />
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight={500}>
                                        {currentAssignment.user.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {currentAssignment.user.email}
                                    </Typography>
                                    {currentAssignment.user.department && (
                                        <Typography variant="body2" color="text.secondary">
                                            {currentAssignment.user.department}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}
                
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                    Select PCC Member
                </Typography>
                
                <TextField
                    fullWidth
                    placeholder="Search by name, email or department"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <IconButton 
                                    size="small" 
                                    onClick={() => setSearchQuery('')}
                                >
                                    <Close fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                
                <List sx={{ 
                    maxHeight: 300, 
                    overflow: 'auto',
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.02)',
                    borderRadius: 1
                }}>
                    {filteredUsers && filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => {
                            if (!user) return null;
                            
                            return (
                                <React.Fragment key={user.id || index}>
                                    <ListItem 
                                        button 
                                        selected={selectedUser && selectedUser.id === user.id}
                                        onClick={() => handleUserClick(user)}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                                                    ? 'rgba(144, 202, 249, 0.16)'
                                                    : 'rgba(33, 150, 243, 0.08)',
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                {user.name && typeof user.name === 'string' && user.name.length > 0 
                                                    ? user.name.charAt(0).toUpperCase() 
                                                    : <Person fontSize="small" />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <Typography variant="body1" fontWeight={500}>
                                                    {user.name || "Unnamed User"}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" component="span">
                                                        {user.email || "No email provided"}
                                                    </Typography>
                                                    {user.department && (
                                                        <Typography variant="body2" component="div" color="text.secondary">
                                                            {user.department}
                                                        </Typography>
                                                    )}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < filteredUsers.length - 1 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <ListItem>
                            <ListItemText 
                                primary="No users found" 
                                secondary={searchQuery ? "Try a different search term" : "No users available"}
                            />
                        </ListItem>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default AssignUserDialog;