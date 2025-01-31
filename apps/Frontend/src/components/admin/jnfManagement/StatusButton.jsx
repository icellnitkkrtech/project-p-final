// StatusCell.js
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const StatusButton = ({ job, onReview }) => {
    return job.status === 'pending' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            <IconButton
                sx={{ padding: 0.5 }}
                color="success"
                size="small"
                onClick={() => onReview(job.id, 'accepted')}
            >
                <CheckIcon />
            </IconButton>
            <IconButton
                sx={{ padding: 0.5 }}
                color="error"
                size="small"
                onClick={() => onReview(job.id, 'rejected')}
            >
                <CloseIcon />
            </IconButton>
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
