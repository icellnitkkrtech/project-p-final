import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import jnfService from '../../../services/admin/jnfService';

const StatusButton = ({ job, onReview }) => {
    const [open, setOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(job.status);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCurrentStatus(job.status);
    }, [job.status]);

    const handleConfirm = (status) => {
        setStatusToUpdate(status);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setStatusToUpdate(null);
    };

    const handleReview = async () => {
        if (statusToUpdate) {
            setLoading(true);
            try {
                const response = await jnfService.updateStatus(job._id, statusToUpdate);
                if (response.success) {
                    setCurrentStatus(statusToUpdate);
                    onReview(job._id, statusToUpdate);
                    handleClose();
                }
            } catch (error) {
                console.error("Error updating JNF status:", error);
                alert("Failed to update status. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            {currentStatus === 'pending' ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="Accept" arrow>
                        <IconButton
                            sx={{ padding: 0.5 }}
                            color="success"
                            size="small"
                            onClick={() => handleConfirm('approved')}
                            disabled={loading}
                        >
                            <CheckCircleOutlineIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject" arrow>
                        <IconButton
                            sx={{ padding: 0.5 }}
                            color="error"
                            size="small"
                            onClick={() => handleConfirm('rejected')}
                            disabled={loading}
                        >
                            <CancelOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : (
                <Typography
                    variant="body2"
                    color={currentStatus === 'approved' ? 'success.main' : 'error.main'}
                >
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </Typography>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Status Change</DialogTitle>
                <DialogContent>
                    Are you sure you want to {statusToUpdate} this JNF?
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose} 
                        color="inherit"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleReview} 
                        color="primary" 
                        variant="contained"
                        disabled={loading}
                        autoFocus
                    >
                        {loading ? 'Updating...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StatusButton;