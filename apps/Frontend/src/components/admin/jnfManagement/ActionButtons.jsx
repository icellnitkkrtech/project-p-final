import React from 'react';
import { IconButton, Box, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ActionButtons = ({ job,jobId, onView, onAssign, onDelete }) => {

    console.log(job);
    console.log(jobId);
    
    return (
            <>
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
            {((job.status === "approved") || (job.status === "pending")) && (
                <Tooltip title="Assign" arrow>
                    <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => onAssign(job)}
                        sx={{ padding: 0.5 }}
                        disabled={job.status !== "approved" }
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
            {/* {((job.status === 'rejected') || (job.status === "draft")) && (
                <Tooltip title="Delete" arrow>
                    <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(job._id)}
                        sx={{ padding: 0.5 }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )} */}
        </>
    );
};

export default ActionButtons;
