import React from 'react';
import { Tabs, Tab,TextField, Box, Button , Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const NFHeader = ({ tab, setTab, onCreate, title }) => {
    return (
        <Box sx={{ justifyContent: 'space-between', p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color='primary'>{title} Management</Typography>
                <Button variant="contained" onClick={onCreate}>
                    Create {title}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="All" value="all" />
                    <Tab label="Accepted" value="accepted" />
                    <Tab label="Pending" value="pending" />
                    <Tab label="Draft" value="draft" />
                    <Tab label="Rejected" value="rejected" />
                </Tabs>
                {/* <Box>
                    <SearchIcon sx={{ color: '#4facfe', mr: 1 }} />
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Search by company, domain, or designation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            flex: 1,
                            color: 'black',
                            '&::placeholder': {
                                color: 'gray',
                                fontStyle: 'italic',
                            },
                        }}
                    />
                </Box> */}
            </Box>
        </Box>
    );
};

export default NFHeader;
