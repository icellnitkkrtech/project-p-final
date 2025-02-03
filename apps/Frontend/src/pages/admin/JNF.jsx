import { useState } from 'react';
import { Box, Typography, Button, Grid, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import JNFAnalytics from '../../components/admin/jnf/JNFAnalytics';
import JNFFilters from '../../components/admin/jnf/JNFFilters';
import JNFForm from '../../components/admin/jnf/JNFForm';
import { useJNF } from '../../hooks/admin/useJNF';
import { useModal } from '../../hooks/admin/useModal';

const JNF = () => {
  // Mock data for development
  const theme= useTheme();
  const mockData = [
    {
      id: 'JNF001',
      companyName: 'Tech Corp',
      jobRole: 'Software Developer',
      jobType: 'Full Time',
      package: '12.5',
      locations: 'Bangalore, Hyderabad',
      deadline: '2024-03-15',
      status: 'Open',
    },
    {
      id: 'JNF002',
      companyName: 'Data Systems',
      jobRole: 'Data Analyst',
      jobType: 'Internship',
      package: '8.0',
      locations: 'Mumbai',
      deadline: '2024-03-20',
      status: 'Open',
    },
  ];

  const { getJNFs } = useJNF();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedJNF, setSelectedJNF] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    company: 'All',
    status: 'All',
    type: 'All',
  });
  const [jnfs, setJnfs] = useState(mockData);

  const columns = [
    { field: 'id', headerName: 'JNF ID', width: 100 },
    { field: 'companyName', headerName: 'Company', width: 200 },
    { field: 'jobRole', headerName: 'Job Role', width: 200 },
    { field: 'jobType', headerName: 'Type', width: 120 },
    { field: 'package', headerName: 'Package (LPA)', width: 150 },
    { field: 'locations', headerName: 'Locations', width: 200 },
    { field: 'deadline', headerName: 'Deadline', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleFilterChange = (field, value) => {
    if (field === 'reset') {
      setFilters(value);
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleEdit = (jnf) => {
    setSelectedJNF(jnf);
    openModal();
  };

  const handleAdd = () => {
    setSelectedJNF(null);
    openModal();
  };

  const handleFormSubmit = (newJNF) => {
    setJnfs(prevJnfs => [...prevJnfs, newJNF]);
    closeModal();
  };
  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          color: theme.palette.text.primary,
          mb: 3 
        }}
      >
        Job Notification Forms
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Create JNF
        </Button>
      </Box>

      <JNFAnalytics />
      
      <JNFFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <DataTable
        columns={columns}
        data={jnfs}
        pagination={{
          page: 0,
          rowsPerPage: 10,
          total: jnfs.length,
        }}
      />

      <JNFForm
        open={isOpen}
        onClose={closeModal}
        jnf={selectedJNF}
        onSubmit={handleFormSubmit}
      />
    </Box>
  );
};

export default JNF;