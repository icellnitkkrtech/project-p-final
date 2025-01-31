import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import JNFForm from '../jnfForm/JNFForm';

const CreateJNFDialog = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <JNFForm/>
            </DialogContent>
        </Dialog>
    );
};

export default CreateJNFDialog;
