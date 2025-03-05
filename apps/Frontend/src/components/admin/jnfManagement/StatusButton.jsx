// StatusCell.js
import React from 'react';
import { Box, IconButton, Typography , Tooltip} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const StatusButton = ({ job, onReview }) => {
    return job.status === 'pending' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <Tooltip title="Accept" arrow>
                <IconButton
                    sx={{ padding: 0.5 }}
                    color="success"
                    size="small"
                    onClick={() => onReview(job.id, 'accepted')}
                >
                    <CheckIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Reject" arrow>
                <IconButton
                    sx={{ padding: 0.5 }}
                    color="error"
                    size="small"
                    onClick={() => onReview(job.id, 'rejected')}
                >
                    <CloseIcon />
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
    );
};

export default StatusButton;
