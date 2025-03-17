import { 
  Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, TextField, InputAdornment, Avatar, Rating, Tooltip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert
} from '@mui/material';
import { Search, Business, Visibility, Edit, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import companyService from '../../../services/admin/companyService'; // Replace with your actual API base URL
import { getCompanyStatus, getRecruitmentStatus } from '../../../utils/companyUtils'; // Add this import
import { useTheme } from '@mui/material/styles';

const CompanyList = ({ companies = [], onCompanySelect, onCompanyEdit, selectedCompany, viewMode = 'grid', onCompanyUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (Array.isArray(companies)) {
      const filtered = companies.filter(company => 
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRecruitmentStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleViewClick = (company) => {
    onCompanySelect(company);
  };

  const handleEditClick = (company) => {
    onCompanyEdit(company);
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await companyService.deleteCompany(companyToDelete._id);
      onCompanyUpdate(); // This will trigger a refresh of the companies list
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    } catch (err) {
      setError('Failed to delete company');
      console.error(err);
    }
  };

  const CompanyCard = ({ company }) => (
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
            src={company.logo} 
            alt={company.companyName}
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
              {company.companyName}
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
              {company.website}
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
              label={company.status}
              color={company.status === 'active' ? 'success' : 'default'}
              size="small"
              sx={{ 
                fontWeight: 500,
                textTransform: 'capitalize',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="body2"
              sx={{ 
                color: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.7)'
                  : 'rgba(0,0,0,0.6)'
              }}
            >
              Recruitment
            </Typography>
            <Chip
              label={company.recruitmentStatus}
              color={getRecruitmentStatusColor(company.recruitmentStatus)}
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
            <IconButton size="small" onClick={() => handleViewClick(company)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Company">
            <IconButton size="small" onClick={() => handleEditClick(company)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Company">
            <IconButton 
              size="small" 
              onClick={() => handleDeleteClick(company)}
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          {filteredCompanies.length} Companies
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company._id}>
              <CompanyCard company={company} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Recruitment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={company.logo} alt={company.companyName}>
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {company.companyName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {company.website}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {company.industry || 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={company.status}
                    color={company.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={company.recruitmentStatus}
                    color={getRecruitmentStatusColor(company.recruitmentStatus)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton size="small" onClick={() => handleViewClick(company)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEditClick(company)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(company)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {companyToDelete?.companyName}? This action cannot be undone.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyList;
