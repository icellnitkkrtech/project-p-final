import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box } from '@mui/material';
import JNFFormPreview from '../jnfForm/JNFFormPreview';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewJNFDialog = ({ selectedJNF, onReview, onDelete, onClose }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);
    
    const handleConfirmOpen = (status) => {
        setStatusToUpdate(status);
        setConfirmOpen(true);
    };
    
    const handleConfirmClose = () => {
        setConfirmOpen(false);
        setStatusToUpdate(null);
    };
    
    const handleReview = () => {
        if (statusToUpdate) {
            onReview(selectedJNF.id, statusToUpdate);
        }
        handleConfirmClose();
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
                            color="error"
                            variant="contained"
                        >
                            Edit
                        </Button>
                    )}
                    {selectedJNF.status === 'pending' && (
                        <Box>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleConfirmOpen('accepted')}
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
                            onClick={() => onDelete(selectedJNF.id)}
                            sx={{ padding: 0.5 }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                </DialogActions>
            </Dialog>
            
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
        </>
    );
};

export default ViewJNFDialog;