import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Download, FilterList, Search } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import reportService from '../../../services/admin/reportService';
import FilterDebug from '../../common/FilterDebug';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const THEME_COLORS = {
  primary: {
    light: '#f5f5f5',
    main: '#757575',
    dark: '#424242',
  },
  success: {
    light: '#ebf5eb',
    main: '#66bb6a',
  },
  warning: {
    light: '#fff8e1',
    main: '#ffa726',
  },
};

const CompanyReports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    industry: 'all',
    status: 'all',
    startDate: dayjs().subtract(1, 'year'),
    endDate: dayjs(),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportService.getFilteredReports('company', filters);
      setData(response);
    } catch (error) {
      console.error('Error fetching company data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFilters(prev => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.generateReport({
        type: 'company',
        format: 'xls',
        title: 'Company Placement Report',
        headers: [
          { header: 'Company Name', key: 'companyName', width: 30 },
          { header: 'Industry', key: 'industry', width: 20 },
          { header: 'Visits', key: 'visits', width: 15 },
          { header: 'Positions', key: 'positions', width: 25 },
          { header: 'Students Hired', key: 'studentsHired', width: 20 },
          { header: 'Average Package', key: 'averagePackage', width: 20 },
          { header: 'Job Profiles', key: 'jobProfiles', width: 30 }
        ],
        filters: {
          startDate: filters.startDate.toISOString(),
          endDate: filters.endDate.toISOString(),
          industry: filters.industry,
          year: filters.year
        }
      });
    } catch (error) {
      console.error('Error downloading company report:', error);
      setError('Failed to download report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChartDownload = async () => {
    try {
      setLoading(true);
      const response = await reportService.downloadCharts('company', filters);
      
      // Create blob and download
      const url = window.URL.createObjectURL(
        new Blob([response], { type: 'application/pdf' })
      );

      // Create and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `company_charts_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error downloading charts:', error);
      setError('Failed to download charts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  name="year"
                  label="Year"
                  value={filters.year}
                  onChange={handleFilterChange}
                >
                  {[2022, 2023, 2024].map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  name="industry"
                  label="Industry"
                  value={filters.industry}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Industries</MenuItem>
                  <MenuItem value="it">IT</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="consulting">Consulting</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={handleDateChange('startDate')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={handleDateChange('endDate')}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowDebug(!showDebug)}
                  >
                    {showDebug ? 'Hide Debug' : 'Show Debug'}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={handleApplyFilters}
                    disabled={loading}
                  >
                    {loading ? 'Applying...' : 'Apply Filters'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleDownload}
                    disabled={loading}
                    sx={{ ml: 1 }}
                  >
                    {loading ? 'Downloading...' : 'Download Report'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleChartDownload}
                    disabled={loading}
                    sx={{ ml: 1 }}
                  >
                    Download Charts
                  </Button>
                </Grid>
              </Grid>
                          </Grid>

            {showDebug && <FilterDebug filters={filters} />}
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Add a search field above the table */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Search Companies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Loading State */}
        {loading && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          </Grid>
        )}

        {/* Data Display */}
        {!loading && data && (
          <>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: 'grey.900',
                        borderBottom: '2px solid #e0e0e0'
                      }}>Company Name</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: 'grey.900',
                        borderBottom: '2px solid #e0e0e0'
                      }}>Industry</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: 'grey.900',
                        borderBottom: '2px solid #e0e0e0'
                      }} align="right">Visits</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: 'grey.900',
                        borderBottom: '2px solid #e0e0e0'
                      }} align="right">Students Hired</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: 'grey.900',
                        borderBottom: '2px solid #e0e0e0'
                      }} align="right">Average Package (LPA)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.companies
                      ?.filter(company => {
                        if (!searchQuery) return true;
                        const searchTermLower = searchQuery.toLowerCase();
                        const companyName = company?.name?.toLowerCase() || '';
                        const companyIndustry = company?.industry?.toLowerCase() || '';
                        return companyName.includes(searchTermLower) || 
                               companyIndustry.includes(searchTermLower);
                      })
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map((company, index) => (
                        <TableRow 
                          key={company.name || index}
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: 'grey.50' },
                            '&:hover': { backgroundColor: '#fafafa' },
                            borderBottom: '1px solid #e0e0e0'
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500, color: 'grey.900' }}>
                            {company.name || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ color: 'grey.800' }}>
                            {company.industry || 'N/A'}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'grey.800' }}>
                            {company.visits || 0}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ 
                              display: 'inline-block',
                              backgroundColor: company.studentsHired > 0 ? '#f0f7f0' : '#fff3e0',
                              color: company.studentsHired > 0 ? '#2e7d32' : '#ed6c02',
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: company.studentsHired > 0 ? '#a5d6a7' : '#ffe0b2'
                            }}>
                              {company.studentsHired || 0}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              sx={{
                                color: theme => {
                                  const value = parseFloat(company.averagePackage);
                                  if (value >= 20) return '#2e7d32';
                                  if (value >= 10) return '#1976d2';
                                  return 'grey.800';
                                }
                              }}
                            >
                              {parseFloat(company.averagePackage || 0).toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Charts */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Industry Distribution
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Array.isArray(data.industryData) ? data.industryData : []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="industry"
                          label={({ industry, count }) => `${industry}: ${count}`}
                        >
                          {Array.isArray(data.industryData) && data.industryData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Paying Companies Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Paying Companies
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.companies
                          ?.sort((a, b) => parseFloat(b.averagePackage) - parseFloat(a.averagePackage))
                          ?.slice(0, 5)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Package (LPA)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="averagePackage" fill="#8884d8" name="Average Package">
                          {data.companies?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Hiring Companies Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Hiring Companies
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.companies
                          ?.sort((a, b) => b.studentsHired - a.studentsHired)
                          ?.slice(0, 5)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Students Hired', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="studentsHired" fill="#82ca9d" name="Students Hired">
                          {data.companies?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Replace the Lowest Hiring Companies Chart with Industry-wise Package Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Package by Industry
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.values(data.companies.reduce((acc, company) => {
                          const industry = company.industry || 'Other';
                          if (!acc[industry]) {
                            acc[industry] = {
                              industry,
                              averagePackage: 0,
                              count: 0
                            };
                          }
                          acc[industry].averagePackage += parseFloat(company.averagePackage || 0);
                          acc[industry].count += 1;
                          return acc;
                        }, {})).map(item => ({
                          industry: item.industry,
                          averagePackage: (item.averagePackage / item.count).toFixed(2)
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="industry" />
                        <YAxis label={{ value: 'Average Package (LPA)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="averagePackage" fill="#8884d8" name="Average Package">
                          {data.companies?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </LocalizationProvider>
  );
};

export default CompanyReports;