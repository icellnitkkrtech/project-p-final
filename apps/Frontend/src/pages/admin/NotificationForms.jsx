import React, { useEffect, useState } from "react";
import { Box, Button, TextField, AppBar, Toolbar, Typography, Slide, useTheme, ToggleButtonGroup, ToggleButton, Paper, InputAdornment, Card, CardContent } from "@mui/material";
import { Search } from "@mui/icons-material";
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

    const handleViewJNF = (jnfItem) => setSelectedJNF(jnfItem);
    const handleOpenCreateDialog = () => setIsCreateDialogOpen(true);
    const handleCloseCreateDialog = () => setIsCreateDialogOpen(false);

    useEffect(() => {
        const fetchAllJNFs = async () => {
            const response = await jnfService.getAll();
            setJnfs(response.data);
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
            <JNFTable jnfs= {filteredJnfs} onView={handleViewJNF} onDelete={handleDeleteJNF} onReview={handleReview} onEdit={(jnf) => {
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

  const handleFormsToggle = (event, newValue) => {
    if (newValue !== null) {
      setActiveComponent(newValue);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Card 
        elevation={1} 
        sx={{ 
          borderRadius: 2, 
          mb: 3,
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
          }}>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2 
                }}
              >
                Notification Forms
              </Typography>
              
              <Paper 
                elevation={0}
                sx={{ 
                  display: 'inline-flex',
                  p: 0.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                }}
              >
                <ToggleButtonGroup
                  value={activeComponent}
                  exclusive
                  onChange={handleFormsToggle}
                  aria-label="notification forms toggle"
                  sx={{
                    '& .MuiToggleButtonGroup-grouped': {
                      border: 0,
                      borderRadius: 1.5,
                      mx: 0.5,
                      px: 2,
                      py: 0.75,
                      '&.Mui-selected': {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        }
                      },
                      '&:not(.Mui-selected)': {
                        bgcolor: 'transparent',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        }
                      }
                    }
                  }}
                >
                  <ToggleButton value={0} aria-label="JNF">
                    <Typography variant="button" fontWeight={500}>
                      Job Notification Form (JNF)
                    </Typography>
                  </ToggleButton>
                  <ToggleButton value={1} aria-label="INF">
                    <Typography variant="button" fontWeight={500}>
                      Internship Notification Form (INF)
                    </Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
            </Box>
            
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2 }}>
        {activeComponent === 0 && (
          <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={350}>
            <div>
              <JNFManagement searchTerm={searchTerm} key="jnf" />
            </div>
          </Slide>
        )}
        {activeComponent === 1 && (
          <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={350}>
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
