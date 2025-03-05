import { 
  Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, IconButton, TextField, InputAdornment, Avatar, Rating, Tooltip 
} from '@mui/material';
import { Search, FilterList, Business, Visibility, Edit, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import companyService from '../../../services/admin/companyService'; // Replace with your actual API base URL

const CompanyList = ({ onCompanySelect, selectedCompany }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await companyService.getCompanies();
        console.log("Response data:", response.data); // Debugging log
        const companiesData = response.data.data.data; // Adjusted to match the actual response structure
        console.log("Companies data:", companiesData); // Debugging log
        setCompanies(companiesData); // Set companies data
        setFilteredCompanies(companiesData); // Initially set filtered data to all companies
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    
    getCompanies();
  }, []);

  // Handle search on frontend
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
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Registered Companies</Typography>
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
            <IconButton>
              <FilterList />
            </IconButton>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Offers Made</TableCell>
              <TableCell>Avg Package</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {Array.isArray(filteredCompanies) && filteredCompanies.map((company) => (
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
                      {company.location}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                {Array.isArray(company.JNFs) && company.JNFs.length > 0 ? company.JNFs[0].companyDetails.domain : 'N/A'}
              </TableCell>
              <TableCell>
                <Rating value={company.rating} readOnly size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={company.status}
                  color={getStatusColor(company.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{company.lastVisit}</TableCell>
              <TableCell>{company.offersCount}</TableCell>
              <TableCell>{company.avgPackage}</TableCell>
              <TableCell>
                <Box>
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small"
                      onClick={() => onCompanySelect(company)}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompanyList;
