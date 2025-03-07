import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AssignUserDialog from './AssignUserDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import StatusButton from './StatusButton';
import ActionButtons from './ActionButtons';

const JNFTable = ({ jnfs, onView, onDelete, onReview }) => {
    const [expanded, setExpanded] = useState(null);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [assignedTasks, setAssignedTasks] = useState({});

    const handleExpandClick = (jobId) => {
        setExpanded(expanded === jobId ? null : jobId);
    };

    const handleAssignClick = (job) => {
        setSelectedJob(job);
        setAssignDialogOpen(true);
        };

    const handleDeleteClick = (job) => {
        setSelectedJob(job);
        setDeleteDialogOpen(true);
    };

    const handleAssign = (assignedTask) => {
        setAssignedTasks((prev) => ({
            ...prev,
            [assignedTask.job.id]: {
                user: assignedTask.user,
                date: assignedTask.date,
            },
        }));
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
                {jnfs.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 2 }}>
                        No JNFs available
                    </Typography>
                ) : (
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>JNF ID</b></TableCell>
                                <TableCell><b>Company</b></TableCell>
                                <TableCell><b>Domain</b></TableCell>
                                <TableCell align="center"><b>Status / Review</b></TableCell>
                                <TableCell align="center"><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jnfs.map((job) => (
                                <React.Fragment key={job.id}>
                                    <TableRow hover>
                                        <TableCell>{job.id}</TableCell>
                                        <TableCell>{job.name}</TableCell>
                                        <TableCell>{job.domain}</TableCell>
                                        <TableCell align="center">
                                            <StatusButton job={job} onReview={onReview} />
                                        </TableCell>
                                        <TableCell align="center" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <ActionButtons
                                                job={job}
                                                onView={onView}
                                                onAssign={handleAssignClick}
                                                onDelete={handleDeleteClick}
                                            />
                                            <IconButton onClick={() => handleExpandClick(job.id)}>
                                                {expanded === job.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={5} style={{ paddingBottom: 1, paddingTop: 1 }}>
                                            <Collapse in={expanded === job.id} timeout="auto" unmountOnExit>
                                                <Box sx={{ p: 2 }}>
                                                    <Typography variant="subtitle1" gutterBottom><b>Job Profiles:</b></Typography>
                                                    {job.jobProfiles.map((profile, index) => (
                                                        <Typography key={index} variant="body2">
                                                            - {profile.designation} (CTC: {profile.ctc})
                                                        </Typography>
                                                    ))}
                                                    {assignedTasks[job.id] && (
                                                        <Typography variant="body2" color="textSecondary" mt={1}>
                                                            <b>Assigned to:</b> {assignedTasks[job.id].user.name} ({assignedTasks[job.id].user.email}) on {assignedTasks[job.id].date}
                                                        </Typography>
                                                    )}
                                                    </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <AssignUserDialog
                open={assignDialogOpen}
                onClose={() => setAssignDialogOpen(false)}
                onAssign={handleAssign}
                users={[
                    { id: 1, name: 'Mohit(PCC)', email: 'mohit@example.com' },
                    { id: 2, name: 'Muskan(PCC)', email: 'muskan@example.com' },
                    { id: 3, name: 'Mohan(PCC)', email: 'mohan@example.com' },
                ]}
                job={selectedJob}
            />

            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                job={selectedJob}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => {
                    onDelete(selectedJob.id);
                    setDeleteDialogOpen(false);
                }}
            />
        </>
    );
};

export default JNFTable;
