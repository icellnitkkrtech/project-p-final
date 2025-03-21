import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Visibility,
  Download,
  Search,
  FilterList,
  Refresh,
  MoreVert
} from '@mui/icons-material';
import { AuditDetailsDialog } from './AuditDetailsDialog';
import { auditService } from '../../../services/admin/auditService';
import { useSnackbar } from 'notistack';

export const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLog, setSelectedLog] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionFilter, setActionFilter] = useState('all');
  const { enqueueSnackbar } = useSnackbar();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would call the API
      // const params = {
      //   page: page + 1,
      //   limit: rowsPerPage,
      //   search: searchQuery || undefined,
      //   action: actionFilter !== 'all' ? actionFilter : undefined,
      //   startDate: startDate ? startDate.toISOString() : undefined,
      //   endDate: endDate ? endDate.toISOString() : undefined
      // };
      // const response = await auditService.getLogs(params);
      
      // For now, using mock data
      setTimeout(() => {
        // Mock data
        const mockLogs = [
          {
            _id: '1',
            timestamp: new Date().toISOString(),
            user: { name: 'Admin User', email: 'admin@example.com' },
            action: 'create',
            resource: 'Student',
            resourceId: '60d21b4667d0d8992e610c85',
            ipAddress: '192.168.1.1',
            details: { name: 'John Doe', email: 'john@example.com' },
            userRole: 'admin'
          },
          {
            _id: '2',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user: { name: 'Coordinator', email: 'coordinator@example.com' },
            action: 'update',
            resource: 'Job',
            resourceId: '60d21b4667d0d8992e610c86',
            ipAddress: '192.168.1.2',
            details: { title: 'Software Engineer', salary: '100000' },
            userRole: 'coordinator'
          },
          {
            _id: '3',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            user: { name: 'System', email: 'system@example.com' },
            action: 'delete',
            resource: 'Application',
            resourceId: '60d21b4667d0d8992e610c87',
            ipAddress: '192.168.1.3',
            details: { reason: 'Expired' },
            userRole: 'system'
          },
          {
            _id: '4',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            user: { name: 'John Doe', email: 'john@example.com' },
            action: 'login',
            resource: 'User',
            resourceId: '60d21b4667d0d8992e610c88',
            ipAddress: '192.168.1.4',
            details: { browser: 'Chrome', os: 'Windows' },
            userRole: 'student'
          },
          {
            _id: '5',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            user: { name: 'Jane Smith', email: 'jane@example.com' },
            action: 'logout',
            resource: 'User',
            resourceId: '60d21b4667d0d8992e610c89',
            ipAddress: '192.168.1.5',
            details: { sessionDuration: '2h 15m' },
            userRole: 'company'
          }
        ];
        
        setLogs(mockLogs);
        setTotalCount(mockLogs.length);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching logs:', error);
      enqueueSnackbar('Error loading audit logs', { variant: 'error' });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage, actionFilter]);

  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    fetchLogs();
  };

  const handleRefresh = () => {
    fetchLogs();
    enqueueSnackbar('Logs refreshed', { variant: 'success' });
  };

  const handleExport = () => {
    try {
      // In a real implementation, you would call the API
      // await auditService.exportLogs('csv');
      enqueueSnackbar('Logs exported successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error exporting logs:', error);
      enqueueSnackbar('Error exporting logs', { variant: 'error' });
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterApply = () => {
    setPage(0);
    fetchLogs();
    handleFilterClose();
  };

  const handleFilterReset = () => {
    setActionFilter('all');
    // Remove date picker reset
    // setStartDate(null);
    // setEndDate(null);
    setPage(0);
    fetchLogs();
    handleFilterClose();
  };

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'create':
        return 'success';
      case 'update':
        return 'primary';
      case 'delete':
        return 'error';
      case 'login':
        return 'info';
      case 'logout':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Search logs..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterList />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>
      
      <Divider />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : logs.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No audit logs found
          </Typography>
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow 
                key={log._id}
                hover
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <TableCell onClick={() => handleViewDetails(log)}>
                  {formatDate(log.timestamp)}
                </TableCell>
                <TableCell onClick={() => handleViewDetails(log)}>
                  {log.user?.email || log.user?.name || 'N/A'}
                </TableCell>
                <TableCell onClick={() => handleViewDetails(log)}>
                  <Chip 
                    label={log.action || 'Unknown'} 
                    color={getActionColor(log.action)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell onClick={() => handleViewDetails(log)}>
                  {log.resource}
                </TableCell>
                <TableCell onClick={() => handleViewDetails(log)}>
                  {log.ipAddress}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(log)}
                      sx={{ color: 'primary.main' }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <AuditDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        logData={selectedLog}
      />

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            minWidth: 280,
            p: 2,
            borderRadius: 2
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Filter Audit Logs
        </Typography>
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Action Type</InputLabel>
          <Select
            value={actionFilter}
            label="Action Type"
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <MenuItem value="all">All Actions</MenuItem>
            <MenuItem value="create">Create</MenuItem>
            <MenuItem value="update">Update</MenuItem>
            <MenuItem value="delete">Delete</MenuItem>
            <MenuItem value="login">Login</MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
          </Select>
        </FormControl>
        
        {/* Remove DatePicker components */}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleFilterReset}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            size="small"
            onClick={handleFilterApply}
            color="primary"
          >
            Apply Filters
          </Button>
        </Box>
      </Menu>
    </Card>
  );
};
  