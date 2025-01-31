import React from 'react';
import { Tabs, Tab,TextField, Box, Button , Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DrivesHeader = (tab, setTab) => {
    return (
        <Box sx={{ justifyContent: 'space-between', p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Drive Management</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="All" value="all" />
                    <Tab label="Assigned" value="assigned" />
                    <Tab label="Ongoing" value="ongoing" />
                    <Tab label="Completed" value="completed" />
                </Tabs>

                <Box
                variant="outlined"
                    sx={{
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: 1,
                        p: 1,
                        display: 'flex',
                    }}
                >
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Search by company, domain, or designation..."
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            flex: 1,
                            color: 'black',
                            '&::placeholder': {
                                color: 'gray',
                                fontStyle: 'italic',
                            },
                        }}
                    />
                    <SearchIcon sx={{ color: '#4facfe', mr: 1 }} />
                </Box>
            </Box>
        </Box>
    );
};

export default DrivesHeader;
