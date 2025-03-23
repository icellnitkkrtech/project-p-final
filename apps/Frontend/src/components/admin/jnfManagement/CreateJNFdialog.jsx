import React, { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Index from '../JNFPosting/index';
import DraftConfirmDialog from '../JNFPosting/DraftConfirmDialog';

const CreateJNFDialog = ({ open, onClose }) => {
    const [showDraftDialog, setShowDraftDialog] = useState(false);
    const indexRef = useRef(null);

    const handleCloseAttempt = () => {
        if (indexRef.current && indexRef.current.formData) {
            const formData = indexRef.current.formData;
            // Check if form has any data
            const hasData = Object.keys(formData).some(key => {
                if (typeof formData[key] === 'object') {
                    return Object.keys(formData[key]).some(k => formData[key][k]);
                }
                return formData[key];
            });

            if (hasData) {
                setShowDraftDialog(true);
            } else {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const response = await jnfService.submit(formData);
            if (response.success) {
                // Close dialog after successful submission
                onClose();
            }
            return response;
        } catch (error) {
            console.error('Error submitting JNF:', error);
            throw error;
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleCloseAttempt}
                fullWidth
                maxWidth="lg"
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle>
                    Create Job Notification Form
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseAttempt}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Index 
                        onClose={onClose}
                        onSubmit={handleSubmit}
                        ref={indexRef}
                    />
                </DialogContent>
            </Dialog>

            <DraftConfirmDialog
                open={showDraftDialog}
                onClose={(action) => {
                    setShowDraftDialog(false);
                    if (action === 'discard') {
                        onClose();
                    }
                }}
                onSaveDraft={async () => {
                    if (indexRef.current && indexRef.current.handleSaveDraft) {
                        await indexRef.current.handleSaveDraft();
                    }
                    setShowDraftDialog(false);
                    onClose();
                }}
            />
        </>
    );
};

export default CreateJNFDialog;
