import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import JNFForm from '../JNFPosting';
import jnfService from '../../../services/admin/jnfService';

const EditJNFDialog = ({ open, onClose, jnf, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (updatedData) => {
        try {
            setLoading(true);
            setError(null);
            
            // The form will handle the submission and closing
            if (onUpdate) {
                onUpdate(updatedData);
            }
        } catch (err) {
            setError(err.message || 'Failed to update JNF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            fullScreen
            PaperProps={{
                sx: {
                    bgcolor: 'background.default',
                    height: '95%',
                    maxHeight: '100vh',
                    maxWidth: '85vw',
                    overflowY: 'auto',
                    borderRadius: '10px',
                    m: 'auto' // Center the dialog
                }
            }}
        >
            <Box sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8, 
                zIndex: 1 
            }}>
                <IconButton
                    onClick={onClose}
                    aria-label="close"
                    sx={{
                        bgcolor: 'background.paper',
                        '&:hover': {
                            bgcolor: 'action.hover'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <JNFForm
                        initialData={jnf}
                        onSubmit={handleSubmit}
                        isEditing={true}
                        onClose={onClose} // Pass onClose to JNFForm
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditJNFDialog;