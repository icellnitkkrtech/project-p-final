import React, { useState } from 'react';
import { Box, IconButton, Typography, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import jnfService from '../../../services/admin/jnfService';

const StatusButton = ({ job, onReview }) => {
    const [open, setOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    const handleConfirm = (status) => {
        setStatusToUpdate(status);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleReview = () => {
        onReview(job._id, statusToUpdate);
        setOpen(false);
    };

    const getStatusConfig = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return {
                    color: 'success',
                    icon: <CheckCircleOutlineIcon fontSize="small" />,
                    label: 'Approved'
                };
            case 'rejected':
                return {
                    color: 'error',
                    icon: <CancelOutlinedIcon fontSize="small" />,
                    label: 'Rejected'
                };
            case 'pending':
                return {
                    color: 'warning',
                    icon: <PendingOutlinedIcon fontSize="small" />,
                    label: 'Pending'
                };
            case 'draft':
                return {
                    color: 'default',
                    icon: <DraftsOutlinedIcon fontSize="small" />,
                    label: 'Draft'
                };
            default:
                return {
                    color: 'default',
                    icon: <PendingOutlinedIcon fontSize="small" />,
                    label: status || 'Unknown'
                };
        }
    };

    const statusConfig = getStatusConfig(job.status);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Chip
                    label={statusConfig.label}
                    color={statusConfig.color}
                    size="small"
                    icon={statusConfig.icon}
                    sx={{ fontWeight: 500 }}
                />
                
                {job.status !== 'approved' && job.status !== 'rejected' && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Approve JNF" arrow>
                            <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleConfirm('approve')}
                                sx={{ 
                                    padding: 0.5,
                                    borderRadius: 1
                                }}
                            >
                                <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject JNF" arrow>
                            <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleConfirm('reject')}
                                sx={{ 
                                    padding: 0.5,
                                    borderRadius: 1
                                }}
                            >
                                <CancelOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>

            <Dialog 
                open={open} 
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: 3
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Confirm Status Change</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to {statusToUpdate} this JNF?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                        onClick={handleClose} 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleReview} 
                        variant="contained" 
                        color={statusToUpdate === 'approve' ? 'success' : 'error'}
                        sx={{ borderRadius: 1 }}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StatusButton;