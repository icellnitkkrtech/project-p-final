import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import AssignUserDialog from './AssignUserDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import StatusButton from './StatusButton';
import ActionButtons from './ActionButtons';

const JNFTable = ({ jnfs, onView, onDelete, onReview }) => {
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [assignedTasks, setAssignedTasks] = useState({}); // State to store assigned tasks by job ID

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
        setAssignDialogOpen(false); // Close the dialog
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
                                <TableCell><b>Company</b></TableCell>
                                <TableCell><b>Domain</b></TableCell>
                                <TableCell><b>Job Designation</b></TableCell>
                                <TableCell><b>CTC</b></TableCell>
                                <TableCell align="center"><b>Status / Review</b></TableCell>
                                <TableCell align="center"><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jnfs.map((job) => (
                                <React.Fragment key={job.id}>
                                    <TableRow hover>
                                        <TableCell>{job.name}</TableCell>
                                        <TableCell>{job.domain}</TableCell>
                                        <TableCell>{job.jobProfiles.map((profile) => profile.designation).join('')}</TableCell>
                                        <TableCell>{job.jobProfiles.map((profile) => profile.ctc).join('')}</TableCell>
                                        <TableCell align="center">
                                            <StatusButton job={job} onReview={onReview} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <ActionButtons
                                                job={job}
                                                onView={onView}
                                                onAssign={handleAssignClick}
                                                onDelete={handleDeleteClick}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    {assignedTasks[job.id] && (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Assigned to: {assignedTasks[job.id].user.name} ({assignedTasks[job.id].user.email}) on {assignedTasks[job.id].date}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Assign User Dialog */}
            <AssignUserDialog
                open={assignDialogOpen}
                onClose={() => setAssignDialogOpen(false)}
                onAssign={handleAssign}
                users={[
                    { id: 1, name: 'User 1', email: 'user1@example.com' },
                    { id: 2, name: 'User 2', email: 'user2@example.com' },
                    { id: 3, name: 'User 3', email: 'user3@example.com' },
                ]}
                job={selectedJob}
            />

            {/* Delete Confirmation Dialog */}
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
