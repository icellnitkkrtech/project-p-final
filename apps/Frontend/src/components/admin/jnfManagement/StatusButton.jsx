import React, {useState} from 'react';
import { Box, IconButton, Typography , Tooltip,  Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const StatusButton = ({ job }) => {
    const [open, setOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    const handleConfirm = (status) => {
        setStatusToUpdate(status);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setStatusToUpdate(null);
    };

    const handleReview = () => {
        if (statusToUpdate) {
            onReview(job.id, statusToUpdate);
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
                    onClick={() => handleConfirm('accepted')}
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
            color={job.status === 'accepted' ? 'success.main' : 'error.main'}
        >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </Typography>
    )}
    
    <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Status Change</DialogTitle>
                <DialogContent>
                    Are you sure you want to {statusToUpdate} this job?
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
