import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    IconButton, 
    Box, 
    Typography 
} from '@mui/material';
import JNFFormPreview from '../JNFPosting/JNFFormPreview';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditJNFDialog from './EditJNFDialog';
import jnfService from '../../../services/admin/jnfService';

const ViewJNFDialog = ({ selectedJNF, onReview, onDelete, onClose, onUpdate }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    
    const handleConfirmOpen = (status) => {
        setStatusToUpdate(status);
        setConfirmOpen(true);
    };
    
    const handleConfirmClose = () => {
        setConfirmOpen(false);
        setStatusToUpdate(null);
    };
    
    const handleReview = async () => {
        try {
            if (statusToUpdate) {
                const response = await jnfService.updateStatus(selectedJNF._id, statusToUpdate);
                if (response.success) {
                    // Update parent component
                    onReview(selectedJNF._id, statusToUpdate);
                    // Close confirmation dialog
                    handleConfirmClose();
                    // Close main dialog
                    onClose();
                    // Show success message
                    alert(`JNF ${statusToUpdate} successfully`);
                }
            }
        } catch (error) {
            console.error("Error updating JNF status:", error);
            alert(`Failed to update JNF status: ${error.message}`);
        }
    };

    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        onDelete(selectedJNF._id); // Make sure to use _id instead of id
        setDeleteConfirmOpen(false);
        onClose();
    };

    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    const handleUpdateSuccess = (updatedJNF) => {
        if (onUpdate) {
            onUpdate(updatedJNF);
        }
        setEditDialogOpen(false);
        onClose();
    };
    
    return (
        <>
            <Dialog open={!!selectedJNF} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle variant="h4">
                    {`JNF Details - ${selectedJNF.name}`}
                    <IconButton
                        sx={{ padding: 0.5, position: 'absolute', right: 0, top: 0 }}
                        color="default"
                        size="small"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <JNFFormPreview selectedJNF={selectedJNF} />
                </DialogContent>
                <DialogActions>
                    {selectedJNF.status === 'draft' && (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleEditClick}
                            startIcon={<EditIcon />}
                        >
                            Edit
                        </Button>
                    )}
                    {selectedJNF.status === 'pending' && (
                        <Box>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleConfirmOpen('approved')}
                            >
                                Accept
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleConfirmOpen('rejected')}
                                sx={{ ml: 1 }}
                            >
                                Reject
                            </Button>
                        </Box>
                    )}
                    {((selectedJNF.status === 'rejected') || (selectedJNF.status === 'draft')) && (
                        <IconButton
                            color="error"
                            size="small"
                            onClick={handleDeleteClick}
                            sx={{ padding: 0.5 }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                </DialogActions>
            </Dialog>
            
            <EditJNFDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                jnf={selectedJNF}
                onUpdate={handleUpdateSuccess}
            />

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Confirm Status Change</DialogTitle>
                <DialogContent>
                    Are you sure you want to {statusToUpdate} this JNF?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleReview} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this JNF from {selectedJNF?.companyDetails?.name}?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteConfirmOpen(false)} 
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ViewJNFDialog;