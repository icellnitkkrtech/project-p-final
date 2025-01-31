import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import JNFForm from '../jnfForm/JNFForm';

const ViewJNFDialog = ({ selectedJNF, onClose,}) => {
    return (
        <Dialog open={!!selectedJNF} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{`JNF Details - ${selectedJNF.name}`}</DialogTitle>
            <DialogContent>
                <JNFForm selectedJNF={selectedJNF}/>
            </DialogContent>
            <DialogActions>
                {selectedJNF.status === 'draft' && (
                    <>
                        <Button
                            onClick={handleEdit()}
                            color="error"
                            variant="contained"
                        >
                            Edit
                        </Button>
                    </>
                )}
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewJNFDialog;