import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Paper,
  TableContainer,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  InputAdornment,
  Alert,
  Divider,
  MenuItem
} from "@mui/material";
import { 
  Visibility, 
  Delete, 
  Business, 
  Search, 
  Work, 
  AccessTime, 
  CheckCircle, 
  PendingActions,
  Cancel,
  ViewModule,
  TableChart,
  FilterList,
  WorkOff
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import placementService from "../../../services/admin/placementService";
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const PlacementTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlacementId, setSelectedPlacementId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(isMobile ? 'grid' : 'table');
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'All',
    year: 'All',
    type: 'All'
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const data = await placementService.getAllPlacements();
        setPlacements(data);
      } catch (err) {
        setError("Failed to load placements");
        enqueueSnackbar("Error fetching placements", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDeleteClick = (id) => {
    setSelectedPlacementId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPlacementId) return;
    try {
      await placementService.deletePlacement(selectedPlacementId);
      setPlacements(placements.filter((p) => p._id !== selectedPlacementId));
      enqueueSnackbar("Placement deleted successfully", { variant: "success" });
      setDeleteDialogOpen(false);
    } catch (error) {
      setError("Failed to delete placement");
      enqueueSnackbar("Error deleting placement", { variant: "error" });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "inProgress":
        return <AccessTime fontSize="small" />;
      case "closed":
        return <CheckCircle fontSize="small" />;
      case "hold":
        return <PendingActions fontSize="small" />;
      default:
        return <Cancel fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "inProgress":
        return "info";
      case "closed":
        return "success";
      case "hold":
        return "warning";
      default:
        return "error";
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredPlacements = placements
    .filter(placement => {
      const matchesSearch = 
        placement.companyDetails?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        placement.jobProfile?.designation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status === 'All' || placement.status === filters.status;
      const matchesYear = filters.year === 'All' || placement.year === filters.year;
      const matchesType = filters.type === 'All' || placement.type === filters.type;

      return matchesSearch && matchesStatus && matchesYear && matchesType;
    })
    .sort((a, b) => {
      // Convert dates to timestamps for comparison
      const dateA = new Date(a.createdAt || a.dateCreated || a.created_at).getTime();
      const dateB = new Date(b.createdAt || b.dateCreated || b.created_at).getTime();
      // Sort in descending order (newest first)
      return dateB - dateA;
    });

  const formatDriveId = (placement) => {
    const year = new Date(placement.createdAt || placement.dateCreated || placement.created_at).getFullYear();
    const lastTwoDigits = year.toString().slice(-2);
    const serial = parseInt(placement._id.slice(-4), 16).toString().padStart(4, '0');
    return `PID${lastTwoDigits}${serial}`;
  };

  const PlacementCard = ({ placement }) => (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: theme => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme => theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.5)'
            : '0 4px 20px rgba(25, 118, 210, 0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar 
            src={placement.companyDetails?.logo} 
            alt={placement.companyDetails?.name}
            sx={{
              width: 56,
              height: 56,
              bgcolor: theme => theme.palette.primary.main,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Business sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 0.5,
                color: theme => theme.palette.mode === 'dark' 
                  ? '#fff' 
                  : '#1a1a1a'
              }}
            >
              {placement.companyDetails?.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Work fontSize="small" />
              {placement.jobProfile?.designation}
            </Typography>
          </Box>
        </Box>

        <Box 
          sx={{
            display: 'grid',
            gap: 2,
            mb: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: theme => theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(25, 118, 210, 0.04)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="body2"
              sx={{ 
                color: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)'
              }}
            >
              Status
            </Typography>
            <Chip
              icon={getStatusIcon(placement.status)}
              label={placement.status}
              color={getStatusColor(placement.status)}
              size="small"
              sx={{ 
                fontWeight: 500,
                textTransform: 'capitalize',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          </Box>
        </Box>

        <Box 
          display="flex" 
          justifyContent="flex-end" 
          gap={1}
          sx={{
            '& .MuiIconButton-root': {
              color: theme => theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.7)'
                : theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(25, 118, 210, 0.08)'
              }
            }
          }}
        >
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              onClick={() => handleNavigation(`/admin/placements/${placement._id}`)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Placement">
            <IconButton 
              size="small" 
              onClick={() => handleDeleteClick(placement._id)}
              sx={{ 
                color: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255,0,0,0.7)'
                  : theme.palette.error.main,
                '&:hover': {
                  bgcolor: theme => theme.palette.mode === 'dark'
                    ? 'rgba(255,0,0,0.05)'
                    : 'rgba(255,0,0,0.08)'
                }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search placements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              select
              size="small"
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="hold">On Hold</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Sessional Year"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="2023-2024">2023-2024</MenuItem>
              <MenuItem value="2024-2025">2024-2025</MenuItem>
              <MenuItem value="2025-2026">2025-2026</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Type"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="internship">Internship</MenuItem>
              <MenuItem value="fulltime">Full Time</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </TextField>

            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 0.5,
                ml: 1
              }}>
                <Tooltip title="Grid View">
                  <IconButton
                    size="small"
                    onClick={() => setViewMode('grid')}
                    sx={{
                      color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <ViewModule />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Table View">
                  <IconButton
                    size="small"
                    onClick={() => setViewMode('table')}
                    sx={{
                      color: viewMode === 'table' ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableChart />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : filteredPlacements.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight={400}
          gap={2}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: theme => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.02)',
            border: theme => `1px dashed ${theme.palette.divider}`
          }}
        >
          <WorkOff 
            sx={{ 
              fontSize: 80,
              color: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(0, 0, 0, 0.2)'
            }} 
          />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              color: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.7)' 
                : 'rgba(0, 0, 0, 0.6)'
            }}
          >
            No Placements Found
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              color: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.5)' 
                : 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {searchQuery || filters.status !== 'All' || filters.year !== 'All' || filters.type !== 'All' 
              ? 'Try adjusting your search or filters'
              : 'No placements have been added yet'}
          </Typography>
        </Box>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredPlacements.map((placement) => (
            <Grid item xs={12} sm={6} md={4} key={placement._id}>
              <PlacementCard placement={placement} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            maxHeight: 'calc(100vh - 200px)',
            overflowX: 'auto',
            '& .MuiTable-stickyHeader': {
              '& .MuiTableCell-head': {
                top: 0,
                zIndex: 1,
                position: 'sticky',
                backgroundColor: 'background.paper',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main'
                }
              }
            }
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ 
                '& .MuiTableCell-head': {
                  color: 'primary.main',
                  fontWeight: 600,
                  backgroundColor: 'transparent'
                }
              }}>
                <TableCell>Company</TableCell>
                <TableCell>Drive ID</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPlacements.map((placement) => (
                <TableRow 
                  key={placement._id}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme => theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        src={placement.companyDetails?.logo} 
                        alt={placement.companyDetails?.name}
                      >
                        <Business />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {placement.companyDetails?.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDriveId(placement)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {placement.jobProfile?.designation}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(placement.status)}
                      label={placement.status}
                      color={getStatusColor(placement.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleNavigation(`/admin/placements/${placement._id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Placement">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(placement._id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Placement</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this placement? This action cannot be undone.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlacementTable;