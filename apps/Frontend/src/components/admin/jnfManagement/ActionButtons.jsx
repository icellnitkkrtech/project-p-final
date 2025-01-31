import React from 'react';
import { IconButton, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ActionButtons = ({ job, onView, onAssign, onDelete }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            {job.status !== "draft" && (
            <IconButton
                color="primary"
                size="small"
                onClick={() => onView(job)}
                sx={{ padding: 0.5 }}
            >
                <VisibilityIcon fontSize="small" />
            </IconButton>
            )}
            {((job.status === "accepted") || (job.status === "pending")) && (
                <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => onAssign(job)}
                    sx={{ padding: 0.5 }}
                    disabled={job.status !== "accepted"}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            )}
             {job.status === 'draft' && (
                    <>
                        <IconButton
                            color="error"
                            size="small"
                            variant="contained"
                            onClick={() => onView()}
                            sx={{ padding: 0.5 }}
                        >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    </>
                )}
            {((job.status === 'rejected') || (job.status === "draft"))  && (
                <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(job)}
                    sx={{ padding: 0.5 }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
};

export default ActionButtons;
