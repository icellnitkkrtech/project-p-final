import React from 'react';
import { IconButton, Box, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const ActionButtons = ({ job, jobId, onView, onAssign, onDelete }) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            gap: 1,
            '& .MuiIconButton-root': {
                color: (theme) => theme.palette.mode === 'dark' 
                    ? theme.palette.grey[400] 
                    : theme.palette.grey[700],
                '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.08)' 
                        : 'rgba(0,0,0,0.04)',
                }
            }
        }}>
            <Tooltip title="View Details" arrow placement="top">
                <IconButton
                    onClick={() => onView(job)}
                    size="small"
                    sx={{ 
                        padding: 1,
                        borderRadius: 1
                    }}
                >
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            
            {job.status !== "draft" && (
                <Tooltip title="Assign to PCC Member" arrow placement="top">
                    <IconButton
                        onClick={() => onAssign(job)}
                        size="small"
                        sx={{ 
                            padding: 1,
                            borderRadius: 1
                        }}
                    >
                        <PersonAddAltIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            
            {job.status === "draft" && (
                <Tooltip title="Edit JNF" arrow placement="top">
                    <IconButton
                        onClick={() => onView(job)}
                        size="small"
                        sx={{ 
                            padding: 1,
                            borderRadius: 1
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            
            <Tooltip title="Delete JNF" arrow placement="top">
                <IconButton
                    onClick={() => onDelete(job)}
                    size="small"
                    sx={{ 
                        padding: 1,
                        borderRadius: 1,
                        color: (theme) => theme.palette.error.main,
                        '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode === 'dark' 
                                ? 'rgba(244,67,54,0.08)' 
                                : 'rgba(244,67,54,0.04)',
                        }
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default ActionButtons;