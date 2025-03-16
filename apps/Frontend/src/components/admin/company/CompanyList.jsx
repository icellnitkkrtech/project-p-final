import { 
  Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, TextField, InputAdornment, Avatar, Rating, Tooltip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert
} from '@mui/material';
import { Search, Business, Visibility, Edit, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import companyService from '../../../services/admin/companyService'; // Replace with your actual API base URL
import { getCompanyStatus, getRecruitmentStatus } from '../../../utils/companyUtils'; // Add this import

const CompanyList = ({ companies = [], onCompanySelect, onCompanyEdit, selectedCompany, viewMode = 'grid', onCompanyUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [error, setError] = useState(null);

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
    <Card elevation={1} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar src={company.logo} alt={company.companyName}>
            <Business />
          </Avatar>
          <Box>
            <Typography variant="h6">{company.companyName}</Typography>
            <Typography variant="body2" color="textSecondary">
              {company.website}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="textSecondary">
              Status
            </Typography>
            <Chip
              label={company.status}
              color={company.status === 'active' ? 'success' : 'default'}
              size="small"
            />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="textSecondary">
              Recruitment
            </Typography>
            <Chip
              label={company.recruitmentStatus}
              color={getRecruitmentStatusColor(company.recruitmentStatus)}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={1}>
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
