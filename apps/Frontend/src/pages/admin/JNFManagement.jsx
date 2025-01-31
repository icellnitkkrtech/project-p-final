import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import JNFHeader from '../../components/admin/jnfManagement/JNFHeader';
import CreateJNFDialog from '../../components/admin/jnfManagement/CreateJNFdialog';
import ViewJNFDialog from '../../components/admin/jnfManagement/ViewJNFDialog';
import JNFTable from '../../components/admin/jnfManagement/JNFTable';
import jnfDetails from '../../components/admin/jnfManagement/jnfDetails';

const JNFManagement = () => {
    const [selectedJNF, setSelectedJNF] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [jnf, setJnf] = useState(jnfDetails);
    const [tab, setTab] = useState('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleViewJNF = (jnfItem) => setSelectedJNF(jnfItem);

    const handleOpenCreateDialog = () => setIsCreateDialogOpen(true);

    const handleCloseCreateDialog = () => setIsCreateDialogOpen(false);

    const handleReview = (jobId, newStatus) => {
        setJnf((prevJnf) =>
            prevJnf.map((job) =>
                job.id === jobId ? { ...job, status: newStatus } : job
            )
        );
    };

    const handleDeleteJNF = (jobId) => {
        setJnf((prevJnf) => prevJnf.filter((job) => job.id !== jobId));
    };

    // Filter logic for the table
    const filteredJnfs = jnf.filter((jnfItem) => {
        const search = searchTerm.toLowerCase();

        const matchesStatus = tab === 'all' || jnfItem.status === tab;
        const matchesSearch =
            jnfItem.companyDetails?.name?.toLowerCase().includes(search) ||
            jnfItem.companyDetails?.domain?.toLowerCase().includes(search) ||
            jnfItem.jobProfiles.some((profile) =>
                profile.designation?.toLowerCase().includes(search)
            );

        return matchesStatus && matchesSearch;
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', mt: 2 }}>
            {/* Header */}
            <JNFHeader
                tab={tab}
                setTab={setTab}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onCreate={handleOpenCreateDialog}
            />

            {/* JNF Table */}
            <JNFTable
                jnfs={filteredJnfs}
                onView={handleViewJNF}
                onDelete={handleDeleteJNF}
                onReview={handleReview}
            />

            {/* View JNF Dialog */}
            {selectedJNF && (
                <ViewJNFDialog
                    selectedJNF={selectedJNF}
                    onClose={() => setSelectedJNF(null)}
                    onUpdateStatus={(id, status) => {
                        setJnf((prevState) =>
                            prevState.map((jnfItem) =>
                                jnfItem.id === id ? { ...jnfItem, status } : jnfItem
                            )
                        );
                        setSelectedJNF(null);
                    }}
                />
            )}

            {/* Create JNF Dialog */}
            <CreateJNFDialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} />
        </Box>
    );
};

export default JNFManagement;
