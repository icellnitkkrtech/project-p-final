import React, { useEffect, useState } from "react";
import { Box, Button, TextField, AppBar, Toolbar, Typography, Slide, useTheme } from "@mui/material";
import NFHeader from "../../components/admin/jnfManagement/JNFHeader";
import CreateJNFDialog from "../../components/admin/jnfManagement/CreateJNFdialog";
import ViewJNFDialog from "../../components/admin/jnfManagement/ViewJNFDialog";
import JNFTable from "../../components/admin/jnfManagement/JNFTable";
import jnfDetails from "../../components/admin/jnfManagement/jnfDetails";
import axios from "../../config/axios";
import jnfService from "../../services/admin/jnfService";

const JNFManagement = ({ searchTerm }) => {
    const [jnfs, setJnfs] = useState([]);
    const [selectedJNF, setSelectedJNF] = useState(null);
    const [tab, setTab] = useState('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const handleViewJNF = (jnfItem) => setSelectedJNF(jnfItem);
    const handleOpenCreateDialog = () => setIsCreateDialogOpen(true);
    const handleCloseCreateDialog = () => setIsCreateDialogOpen(false);

    useEffect(() => {
        const fetchAllJNFs = async () => {
            try {
            const response = await jnfService.getAll();
            setJnfs(response.data);
            } catch (error) {
                console.error("Error fetching JNFs:", error);
              
    }finally {
        setLoading(false);
    }
        };
        fetchAllJNFs();
        }, []);
        console.log(jnfs);


    const handleReview = (jobId, newStatus) => {
        setJnfs((prevJnfs) =>
            prevJnfs.map((job) =>
                job.id === jobId ? { ...job, status: newStatus } : job
            )
        );
    };

    const handleDeleteJNF = async (jobId) => {
        try {
            await jnfService.delete(jobId);
            setJnfs((prevJnfs) => prevJnfs.filter((job) => job._id !== jobId));
        } catch (error) {
            console.error("Error deleting JNF:", error);
        }
    };

    const handleUpdate = (updatedJNF) => {
        setJnfs(prevJnfs => 
            prevJnfs.map(jnf => 
                jnf._id === updatedJNF._id ? updatedJNF : jnf
            )
        );
    };

    // Function to refresh JNF list
    const handleJNFUpdate = (updatedJNF) => {
        setJnfs(prevJnfs => 
            prevJnfs.map(jnf => 
                jnf._id === updatedJNF._id ? updatedJNF : jnf
            )
        );
        setSelectedJNF(null);
        setEditDialogOpen(false);
    };

    // Filter logic for the table
    const filteredJnfs = jnfs.filter((jnfItem) => {
        const search = searchTerm.toLowerCase();
        const matchesStatus = tab === 'all' || jnfItem.status === tab;
        const matchesSearch =
            jnfItem.name?.toLowerCase().includes(search) ||
            jnfItem.domain?.toLowerCase().includes(search) ||
            jnfItem.jobProfiles.some((profile) =>
                profile.designation?.toLowerCase().includes(search)
            );

        return matchesStatus && matchesSearch;
    });

    const handleStatusUpdate = (jnfId, newStatus) => {
        setJnfs(prevJnfs => 
            prevJnfs.map(jnf => 
                jnf._id === jnfId 
                    ? { ...jnf, status: newStatus }
                    : jnf
            )
        );
        setSelectedJNF(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', mt: 2 }}>
            <NFHeader tab={tab} setTab={setTab} onCreate={handleOpenCreateDialog} title = {"JNF"}/>
            <JNFTable jnfs= {filteredJnfs} onView={handleViewJNF} onDelete={handleDeleteJNF} onReview={handleReview}  isLoading={loading} onEdit={(jnf) => {
                    setSelectedJNF(jnf);
                    setEditDialogOpen(true);
                }} />
            {selectedJNF && (
                <ViewJNFDialog
                    selectedJNF={selectedJNF}
                    onClose={() => setSelectedJNF(null)}
                    onReview={handleStatusUpdate}
                    onDelete={handleDeleteJNF}
                    onUpdate={handleUpdate}
                />
            )}
            <CreateJNFDialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} />
            {editDialogOpen && (
                <EditJNFDialog
                    open={editDialogOpen}
                    jnf={selectedJNF}
                    onClose={() => {
                        setEditDialogOpen(false);
                        setSelectedJNF(null);
                    }}
                    onSubmit={handleJNFUpdate}
                />
            )}
        </Box>
    );
};

const INFManagement = ({ searchTerm }) => {
    const [selectedJNF, setSelectedJNF] = useState(null);
    const [jnf, setJnf] = useState(jnfDetails);
    const [tab, setTab] = useState('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleViewJNF = (jnfItem) => setSelectedJNF(jnfItem);
    const handleOpenCreateDialog = () => setIsCreateDialogOpen(true);
    const handleCloseCreateDialog = () => setIsCreateDialogOpen(false);
    const [availableStatuses, setAvailableStatuses] = useState([]);
    useEffect(() => {
        const fetchAllJNFs = async () => {
            const response = await jnfService.getAll();
            setJnf(response.data);
        };

        const fetchStatuses = async () => {
            const res = await jnfService.getAvailableStatuses();
            const statuses = res?.data?.data || [];
            setAvailableStatuses(statuses);
        };

        fetchAllJNFs();
        fetchStatuses();
    }, []);

    const handleReview = (jobId, newStatus) => {
        setJnf((prevJnf) =>
            prevJnf.map((job) =>
                job.id === jobId ? { ...job, status: newStatus } : job
            )
        );
    };
    useEffect(() => {
        fetchJNFs();
    }, []);
    const handleDeleteJNF = (jobId) => {
        setJnf((prevJnf) => prevJnf.filter((job) => job.id !== jobId));
    };

    // Filter logic for the table
    const filteredJnfs = jnf.filter((jnfItem) => {
        const search = searchTerm.toLowerCase();
        const matchesStatus = tab === 'all' || jnfItem.status === tab;
        const matchesSearch =
            jnfItem.name?.toLowerCase().includes(search) ||
            jnfItem.domain?.toLowerCase().includes(search) ||
            jnfItem.jobProfiles.some((profile) =>
                profile.designation?.toLowerCase().includes(search)
            );

        return matchesStatus && matchesSearch;
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', mt: 2 }}>
           <NFHeader
    tab={tab}
    setTab={setTab}
    onCreate={handleOpenCreateDialog}
    title="JNF"
    availableStatuses={availableStatuses}
/>

            <JNFTable jnfs={filteredJnfs} onView={handleViewJNF} onDelete={handleDeleteJNF} onReview={handleReview} />
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
                    onDelete={handleDeleteJNF}
                    onReview={handleReview}
                />
            )}
            <CreateJNFDialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} />
        </Box>
    );
};


const NotificationForms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeComponent, setActiveComponent] = useState(0);
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <AppBar position="static" sx={{ borderRadius: 2, backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#f5f5f5", color: theme.palette.text.primary }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
          <Typography variant="h5">Notification Forms</Typography>
            <Button variant={activeComponent === 0 ? "contained" : "outlined"} onClick={() => setActiveComponent(0)} size="small">JNF</Button>
            <Button variant={activeComponent === 1 ? "contained" : "outlined"} onClick={() => setActiveComponent(1)} size="small">INF</Button>
          </Box>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ backgroundColor: theme.palette.mode === "dark" ? "#616161" : "#e0e0e0", borderRadius: 1, width: 200, input: { color: theme.palette.text.primary } }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: 2 }}>
        {activeComponent === 0 && (
            <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <div>
                <JNFManagement searchTerm={searchTerm} key="jnf" />
            </div>
            </Slide>
        )}
        {activeComponent === 1 && (
            <Slide direction="right" in={true} mountOnEnter unmountOnExit>
            <div>
                <INFManagement searchTerm={searchTerm} key="inf" />
            </div>
            </Slide>
        )}
        </Box>

    </Box>
  );
};

export default NotificationForms;
