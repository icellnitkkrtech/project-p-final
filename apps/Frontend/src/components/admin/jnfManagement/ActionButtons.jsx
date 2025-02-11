import React from 'react';
import { IconButton, Box, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ActionButtons = ({ job, onView, onAssign, onDelete }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            {job.status !== "draft" && (
                <Tooltip title="View" arrow>
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onView(job)}
                        sx={{ padding: 0.5 }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            {((job.status === "accepted") || (job.status === "pending")) && (
                <Tooltip title="Assign" arrow>
                    <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => onAssign(job)}
                        sx={{ padding: 0.5 }}
                        disabled={job.status !== "accepted"}
                    >
                        <EditNoteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            {job.status === 'draft' && (
                <Tooltip title="Edit" arrow>
                    <IconButton
                        color="error"
                        size="small"
                        onClick={() => onView(job)}
                        sx={{ padding: 0.5 }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            {((job.status === 'rejected') || (job.status === "draft")) && (
                <Tooltip title="Delete" arrow>
                    <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(job)}
                        sx={{ padding: 0.5 }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
};

export default ActionButtons;
