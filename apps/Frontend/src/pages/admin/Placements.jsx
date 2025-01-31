import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import PlacementAnalytics from '../../components/admin/placements/PlacementAnalytics';
import PlacementFilters from '../../components/admin/placements/PlacementFilters';
import { useTable } from '../../hooks/admin/useTable';
import { usePlacement } from '../../hooks/admin/usePlacement';
import { useTheme } from '@mui/material';

const Placements = () => {
  const theme = useTheme();
  const { getPlacements } = usePlacement();
  const [filters, setFilters] = useState({
    search: '',
    company: 'All',
    status: 'All',
    year: new Date().getFullYear().toString(),
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'companyName', headerName: 'Company', width: 200 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'package', headerName: 'Package (LPA)', width: 150 },
    { field: 'openings', headerName: 'Openings', width: 100 },
    { field: 'appliedCount', headerName: 'Applied', width: 100 },
    { field: 'selectedCount', headerName: 'Selected', width: 100 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 120 },
  ];

  // Mock data for development
  const mockData = [
    {
      id: 1,
      companyName: 'Tech Corp',
      role: 'Software Engineer',
      package: '12.5',
      openings: 10,
      appliedCount: 50,
      selectedCount: 5,
      status: 'In Progress',
      startDate: '2024-02-15',
    },
    {
      id: 2,
      companyName: 'Data Systems',
      role: 'Data Analyst',
      package: '8.5',
      openings: 5,
      appliedCount: 30,
      selectedCount: 3,
      status: 'Completed',
      startDate: '2024-02-10',
    },
  ];

  const mockPagination = {
    page: 0,
    rowsPerPage: 10,
    total: mockData.length,
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const [open, setOpen] = useState(false);
  const [newPlacement, setNewPlacement] = useState({
    companyName: '',
    role: '',
    package: '',
    openings: '',
    startDate: '',
  });

  const [placements, setPlacements] = useState(mockData);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlacement(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPlacement = () => {
    const newId = placements.length ? placements[placements.length - 1].id + 1 : 1;
    const newPlacementWithId = { ...newPlacement, id: newId };
    setPlacements(prev => [...prev, newPlacementWithId]);
    handleClose();
  };

  const handleUpdatePlacement = (id, updates) => {
    setPlacements(prev =>
      prev.map(placement =>
        placement.id === id ? { ...placement, ...updates } : placement
      )
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4"
        sx={{color:theme.palette.text.primary}}>Placements</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Placement Drive
        </Button>
      </Box>

      <PlacementAnalytics />
      
      <PlacementFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <DataTable
        columns={[
          ...columns,
          {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
              <Button
                variant="contained"
                onClick={() => handleUpdatePlacement(params.row.id, {
                  appliedCount: params.row.appliedCount + 1,
                  selectedCount: params.row.selectedCount + 1,
                  status: 'Completed'
                })}
              >
                Update
              </Button>
            ),
          },
        ]}
        data={placements}
        pagination={{ ...mockPagination, total: placements.length }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Placement Drive</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="companyName"
            label="Company Name"
            type="text"
            fullWidth
            value={newPlacement.companyName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="role"
            label="Role"
            type="text"
            fullWidth
            value={newPlacement.role}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="package"
            label="Package (LPA)"
            type="text"
            fullWidth
            value={newPlacement.package}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="openings"
            label="Openings"
            type="number"
            fullWidth
            value={newPlacement.openings}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPlacement.startDate}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddPlacement}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Placements;