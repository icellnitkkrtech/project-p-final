import React, { useEffect ,useState } from 'react';
import {
    Table, TableBody, TableCell, Tooltip, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AssignUserDialog from './AssignUserDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import StatusButton from './StatusButton';
import ActionButtons from './ActionButtons';
import { Delete } from '@mui/icons-material';
import jnfService from '../../../services/admin/jnfService';
const JNFTable = ({ jnfs, onView, onDelete, onReview }) => {
    const [expanded, setExpanded] = useState(null);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [assignedTasks, setAssignedTasks] = useState({});
    const [pccUsers, setPccUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        console.log("delete this job or not???",job);
    };

    const handleAssign = (assignedTask) => {
        setAssignedTasks((prev) => ({
            ...prev,
            [assignedTask.job._id]: {
                user: assignedTask.user,
                date: assignedTask.date,
            },
        }));
    };

    const handleDelete = async (jobId) => {
        try {
            await jnfService.delete(jobId);
            // setJnf((prevJnf) => prevJnf.filter((job) => job._id !== jobId));
        } catch (error) {
            console.error("Error deleting JNF:", error);
        }
    };
    //fro fetching pcc from backend server
    useEffect(() => {
        const fetchPCCUsers = async () => {
            try {
                const response = await jnfService.getPCC();
                console.log("pcc ",response);
                if (response.data.success) {
                    setPccUsers(response.data.data);
                }
            } catch (error) {
                setError(error.message);
                console.error('Error fetching PCC users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPCCUsers();
    }, []);

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
                                <React.Fragment key={job._id}>
                                    <TableRow hover>
                                        <TableCell>{job._id}</TableCell>
                                        <TableCell>{job.companyDetails.name}</TableCell>
                                        <TableCell>{job.companyDetails.domain}</TableCell>
                                        <TableCell align="center">
                                            <StatusButton job={job} onReview={onReview} />
                                        </TableCell>
                                        <TableCell align="center" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <ActionButtons
                                                jobId={job._id}
                                                job = {job}
                                                onView={onView}
                                                onAssign={handleAssignClick}
                                                onDelete={handleDeleteClick}
                                            />
                                            {((job.status === 'rejected') || (job.status === "draft")) && (
                                                <Tooltip title="Delete" arrow>
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDelete(job._id)}
                                                        sx={{ padding: 0.5 }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <IconButton onClick={() => handleExpandClick(job._id)}>
                                                {expanded === job._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={5} style={{ paddingBottom: 1, paddingTop: 1 }}>
                                            <Collapse in={expanded === job._id} timeout="auto" unmountOnExit>
                                                <Box sx={{ p: 2 }}>
                                                    <Typography variant="subtitle1" gutterBottom><b>Job Profiles:</b></Typography>
                                                    {job.jobProfiles.map((profile, index) => (
                                                        <Typography key={index} variant="body2">
                                                            - {profile.designation} (CTC: {profile.ctc})
                                                        </Typography>
                                                    ))}
                                                    {assignedTasks[job._id] && (
                                                        <Typography variant="body2" color="textSecondary" mt={1}>
                                                            <b>Assigned to:</b> {assignedTasks[job._id].user.name} ({assignedTasks[job._id].user.email}) on {assignedTasks[job._id].date}
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
                users={pccUsers}
                loading={loading}
                error={error}
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
