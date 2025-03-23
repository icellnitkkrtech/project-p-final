import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

const DraftConfirmDialog = ({ open, onClose, onSaveDraft }) => {
    return (
        <Dialog 
            open={open} 
            onClose={() => onClose('keep')}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Save Changes?</DialogTitle>
            <DialogContent>
                <Typography>
                    Do you want to save your changes before closing?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
                <Button 
                    startIcon={<CloseIcon />}
                    onClick={() => onClose('discard')}
                    color="error"
                    variant="outlined"
                >
                    Don't Save
                </Button>
                <Button 
                    startIcon={<EditIcon />}
                    onClick={() => onClose('keep')}
                    color="primary"
                >
                    Keep Editing
                </Button>
                <Button 
                    startIcon={<SaveIcon />}
                    onClick={onSaveDraft}
                    variant="contained" 
                    color="primary"
                >
                    Save as Draft
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DraftConfirmDialog;