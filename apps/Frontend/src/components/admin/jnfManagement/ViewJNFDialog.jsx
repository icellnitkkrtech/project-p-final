import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,IconButton, Box } from '@mui/material';
import JNFForm from '../jnfForm/JNFForm';
import JNFFormPreview from '../jnfForm/JNFFormPreview';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const ViewJNFDialog = ({ selectedJNF, onReview, onDelete, onClose,}) => {
    return (
        <Dialog open={!!selectedJNF} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle variant="h4">{`JNF Details - ${selectedJNF.name}`}
            <IconButton
                    sx={{ padding: 0.5, position: 'absolute', right: 0, top: 0 }}
                    color="default"
                    size="small"
                    onClick={onClose}                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <JNFFormPreview selectedJNF={selectedJNF}/>
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
                {selectedJNF.status === 'pending' && (
                    <Box>
                <IconButton
                    sx={{ padding: 0.5 }}
                    color="success"
                    size="small"
                    onClick= {() => onReview(selectedJNF.id, 'accepted')}
                >
                    <CheckIcon />
                </IconButton>
                    <IconButton
                    sx={{ padding: 0.5 }}
                    color="error"
                    size="small"
                    onClick={() => onReview(selectedJNF.id, 'rejected')}
                >
                    <CloseIcon />
                </IconButton>
                </Box>
                )}
                
                {((selectedJNF.status === 'rejected') || (selectedJNF.status === "draft")) && (
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
    );
};

export default ViewJNFDialog;