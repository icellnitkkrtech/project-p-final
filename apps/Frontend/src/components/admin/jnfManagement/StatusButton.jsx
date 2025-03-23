import React, { useState } from 'react';
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
            try {
                await jnfService.update(job._id, { status: statusToUpdate });
                onReview(job._id, statusToUpdate);
            } catch (error) {
                console.error("Error updating JNF status:", error);
            }
        }
        handleClose();
    };

    return (
        <>
            {job.status === 'pending' ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="Accept" arrow>
                        <IconButton
                            sx={{ padding: 0.5 }}
                            color="success"
                            size="small"
                            onClick={() => handleConfirm('approved')}
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
                        >
                            <CancelOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : (
                <Typography
                    variant="body2"
                    color={job.status === 'approved' ? 'success.main' : 'error.main'}
                >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Typography>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm!</DialogTitle>
                <DialogContent>
                    Are you sure you want to set this to {statusToUpdate}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleReview} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StatusButton;